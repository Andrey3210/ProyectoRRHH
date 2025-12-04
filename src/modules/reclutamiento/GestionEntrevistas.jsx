import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import entrevistaService from '../../services/api/entrevistaService'
import candidatoService from '../../services/api/candidatoService'
import vacanteService from '../../services/api/vacanteService'
import reclutamientoService from '../../services/api/reclutamientoService'
import { useNotification } from '../../components/common/NotificationProvider'
import { EtapaProceso } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Paginacion from './components/Paginacion'
import './GestionEntrevistas.css'

const GestionEntrevistas = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { success, error: showError } = useNotification()
  
  const [entrevistas, setEntrevistas] = useState([])
  const [candidatos, setCandidatos] = useState([])
  const [vacantes, setVacantes] = useState([])
  const [procesosMap, setProcesosMap] = useState(new Map()) // Map<candidatoId, {idProceso, idVacante}>
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [entrevistaSeleccionada, setEntrevistaSeleccionada] = useState(null)
  const [filtroEstado, setFiltroEstado] = useState('TODAS')
  const [filtroVacante, setFiltroVacante] = useState('')
  const [cargandoProceso, setCargandoProceso] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12
  
  // Si se navega desde el detalle del candidato, abrir modal automáticamente
  useEffect(() => {
    if (location.state?.candidatoId) {
      const candidatoId = location.state.candidatoId.toString()
      setFormData(prev => ({
        ...prev,
        idCandidato: candidatoId
      }))
      // Cargar proceso del candidato automáticamente
      cargarProcesoDelCandidato(candidatoId)
      setShowModal(true)
    }
  }, [location.state])

  const [formData, setFormData] = useState({
    idCandidato: '',
    idProceso: '',
    fecha: '',
    hora: '',
    lugar: '',
    entrevistador: '',
    observaciones: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      // Obtener todas las entrevistas (no solo pendientes) para mostrar todas
      const [candidatosData, vacantesData] = await Promise.all([
        candidatoService.obtenerCandidatos(),
        vacanteService.obtenerVacantes()
      ])
      
      // Cargar procesos de todos los candidatos para tener el mapeo
      const procesosMapTemp = new Map()
      const candidatosEnEntrevista = [] // Candidatos en etapa ENTREVISTA sin entrevista programada
      
      try {
        for (const vacante of vacantesData) {
          try {
            const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
            procesos.forEach(pp => {
              if (pp.idPostulante && pp.idProcesoActual) {
                procesosMapTemp.set(pp.idPostulante.toString(), {
                  idProceso: pp.idProcesoActual,
                  idVacante: vacante.idVacante
                })
                
                // Si está en etapa ENTREVISTA, agregarlo a la lista
                if (pp.etapaActual === 'ENTREVISTA' || pp.etapaActual === EtapaProceso.ENTREVISTA) {
                  const candidato = candidatosData.find(c => c.idPostulante === pp.idPostulante)
                  if (candidato) {
                    candidatosEnEntrevista.push({
                      idPostulante: pp.idPostulante,
                      nombreCompleto: candidato.nombreCompleto || `${candidato.nombres} ${candidato.apellidoPaterno}`,
                      email: candidato.email,
                      telefono: candidato.telefono,
                      idVacante: vacante.idVacante,
                      nombreVacante: vacante.nombre,
                      idProceso: pp.idProcesoActual,
                      idPostulanteProceso: pp.idPostulanteProceso,
                      estado: pp.estado
                    })
                  }
                }
              }
            })
          } catch (err) {
            console.warn(`Error al obtener procesos de vacante ${vacante.idVacante}:`, err)
          }
        }
      } catch (err) {
        console.warn('Error al cargar procesos:', err)
      }
      setProcesosMap(procesosMapTemp)
      
      // Intentar obtener entrevistas programadas
      let entrevistasData = []
      try {
        entrevistasData = await entrevistaService.obtenerEntrevistasPendientes({ estado: '' })
      } catch (err) {
        console.warn('No se pudieron cargar entrevistas:', err)
        // Intentar obtener todas las entrevistas sin filtro
        try {
          entrevistasData = await entrevistaService.obtenerEntrevistasPendientes()
        } catch (e) {
          console.warn('Error al cargar entrevistas:', e)
        }
      }
      
      // Enriquecer entrevistas reales con idPostulanteProceso
      const entrevistasEnriquecidas = await Promise.all(
        entrevistasData.map(async (entrevista) => {
          // Buscar el proceso del candidato en el mapa
          const procesoInfo = procesosMapTemp.get(entrevista.idCandidato?.toString())
          if (procesoInfo) {
            // Buscar el PostulanteProceso para obtener el idPostulanteProceso
            for (const vacante of vacantesData) {
              try {
                const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
                const procesoCandidato = procesos.find(pp => 
                  pp.idPostulante === entrevista.idCandidato && 
                  pp.idProcesoActual === procesoInfo.idProceso
                )
                if (procesoCandidato) {
                  return {
                    ...entrevista,
                    idPostulanteProceso: procesoCandidato.idPostulanteProceso
                  }
                }
              } catch (err) {
                console.warn(`Error al buscar proceso para entrevista ${entrevista.idEntrevista}:`, err)
              }
            }
          }
          return entrevista
        })
      )
      
      const entrevistasConProceso = entrevistasEnriquecidas
      
      // Crear "entrevistas virtuales" para candidatos en etapa ENTREVISTA que no tienen entrevista programada
      const entrevistasVirtuales = candidatosEnEntrevista
        .filter(candidato => {
          // Solo incluir si no tiene una entrevista programada
          return !entrevistasConProceso.some(ent => ent.idCandidato === candidato.idPostulante)
        })
        .map(candidato => ({
          idEntrevista: `virtual-${candidato.idPostulante}`, // ID virtual
          idCandidato: candidato.idPostulante,
          idProceso: candidato.idProceso,
          idPostulanteProceso: candidato.idPostulanteProceso, // Necesario para mover etapa
          fecha: null,
          hora: null,
          lugar: null,
          entrevistador: null,
          observaciones: null,
          estado: 'PENDIENTE_PROGRAMAR', // Estado especial para indicar que necesita ser programada
          candidatoInfo: candidato // Información adicional del candidato
        }))
      
      // Combinar entrevistas reales con las virtuales
      const todasLasEntrevistas = [...entrevistasConProceso, ...entrevistasVirtuales]
      
      setEntrevistas(Array.isArray(todasLasEntrevistas) ? todasLasEntrevistas : [])
      setCandidatos(candidatosData || [])
      setVacantes(vacantesData || [])
    } catch (err) {
      console.error('Error al cargar datos:', err)
      showError('Error al cargar las entrevistas')
    } finally {
      setLoading(false)
    }
  }

  const cargarProcesoDelCandidato = async (candidatoId) => {
    if (!candidatoId) return null
    
    setCargandoProceso(true)
    try {
      // Buscar en el mapa de procesos
      const procesoInfo = procesosMap.get(candidatoId.toString())
      
      if (procesoInfo) {
        const procesoId = procesoInfo.idProceso.toString()
        setFormData(prev => ({
          ...prev,
          idProceso: procesoId,
          lugar: prev.lugar || 'Oficina principal - Sala de reuniones' // Mantener lugar si ya existe
        }))
        return procesoId
      } else {
        // Si no está en el mapa, buscar en todas las vacantes
        for (const vacante of vacantes) {
          try {
            const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
            const procesoCandidato = procesos.find(pp => pp.idPostulante?.toString() === candidatoId.toString())
            
            if (procesoCandidato && procesoCandidato.idProcesoActual) {
              const procesoId = procesoCandidato.idProcesoActual.toString()
              setFormData(prev => ({
                ...prev,
                idProceso: procesoId,
                lugar: prev.lugar || 'Oficina principal - Sala de reuniones' // Mantener lugar si ya existe
              }))
              // Actualizar el mapa para futuras referencias
              setProcesosMap(prev => {
                const nuevo = new Map(prev)
                nuevo.set(candidatoId.toString(), {
                  idProceso: procesoCandidato.idProcesoActual,
                  idVacante: vacante.idVacante
                })
                return nuevo
              })
              return procesoId
            }
          } catch (err) {
            console.warn(`Error al buscar proceso para candidato ${candidatoId} en vacante ${vacante.idVacante}:`, err)
          }
        }
      }
      return null
    } catch (err) {
      console.error('Error al cargar proceso del candidato:', err)
      return null
    } finally {
      setCargandoProceso(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      if (entrevistaSeleccionada) {
        // Actualizar entrevista existente
        await entrevistaService.reprogramarEntrevista(
          entrevistaSeleccionada.idEntrevista,
          formData.fecha,
          formData.hora
        )
        success('Entrevista actualizada exitosamente')
      } else {
        // Crear nueva entrevista
        const lugarFinal = formData.lugar || 'Oficina principal - Sala de reuniones'
        await entrevistaService.programarEntrevista({
          idCandidato: parseInt(formData.idCandidato),
          idProceso: parseInt(formData.idProceso),
          fecha: formData.fecha,
          hora: formData.hora,
          lugar: lugarFinal,
          entrevistador: formData.entrevistador
        })
        success('Entrevista programada exitosamente')
      }
      
      setShowModal(false)
      resetForm()
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al guardar la entrevista')
    }
  }

  const handleCancelar = async (idEntrevista) => {
    if (!window.confirm('¿Está seguro de cancelar esta entrevista?')) return
    
    try {
      await entrevistaService.cancelarEntrevista(idEntrevista, 'Cancelada por el usuario')
      success('Entrevista cancelada exitosamente')
      cargarDatos()
    } catch (err) {
      showError('Error al cancelar la entrevista')
    }
  }

  const handleMoverAPrueba = async (entrevista) => {
    // Obtener idPostulanteProceso desde la entrevista o desde el candidatoInfo
    const idPostulanteProceso = entrevista.idPostulanteProceso || entrevista.candidatoInfo?.idPostulanteProceso
    
    if (!idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    if (!window.confirm(`¿Está seguro de mover a ${entrevista.candidatoInfo?.nombreCompleto || 'este candidato'} a la etapa de Prueba Técnica?`)) {
      return
    }

    try {
      await reclutamientoService.moverCandidatoEtapa(idPostulanteProceso, EtapaProceso.PRUEBA)
      success('Candidato movido a etapa de Prueba Técnica')
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al mover el candidato a la siguiente etapa')
    }
  }

  const handleRechazarDesdeEntrevista = async (entrevista) => {
    const idPostulanteProceso = entrevista.idPostulanteProceso || entrevista.candidatoInfo?.idPostulanteProceso
    const nombreCandidato = entrevista.candidatoInfo?.nombreCompleto || 'este candidato'
    
    if (!idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    if (!window.confirm(`¿Está seguro de rechazar a ${nombreCandidato}?`)) {
      return
    }

    const motivo = prompt('Ingrese el motivo del rechazo:')
    if (!motivo || !motivo.trim()) {
      return
    }

    try {
      await reclutamientoService.rechazarCandidato(idPostulanteProceso, motivo.trim())
      success('Candidato rechazado')
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al rechazar el candidato')
    }
  }

  const handleEditar = (entrevista) => {
    setEntrevistaSeleccionada(entrevista)
    setFormData({
      idCandidato: entrevista.idCandidato || '',
      idProceso: entrevista.idProceso || '',
      fecha: entrevista.fecha || '',
      hora: entrevista.hora || '',
      lugar: entrevista.lugar || '',
      entrevistador: entrevista.entrevistador || '',
      observaciones: entrevista.observaciones || ''
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setFormData({
      idCandidato: '',
      idProceso: '',
      fecha: '',
      hora: '',
      lugar: '',
      entrevistador: '',
      observaciones: ''
    })
    setEntrevistaSeleccionada(null)
  }

  const entrevistasFiltradas = entrevistas.filter(ent => {
    if (filtroEstado === 'TODAS') {
      return true
    }
    if (filtroEstado === 'PENDIENTE_PROGRAMAR') {
      return ent.estado === 'PENDIENTE_PROGRAMAR'
    }
    // Para otros estados, filtrar normalmente pero excluir PENDIENTE_PROGRAMAR
    return ent.estado === filtroEstado && ent.estado !== 'PENDIENTE_PROGRAMAR'
  })

  // Calcular paginación
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pageEntrevistas = entrevistasFiltradas.slice(start, end)
  const totalPages = Math.ceil(entrevistasFiltradas.length / itemsPerPage)

  // Resetear a página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1)
  }, [filtroEstado, filtroVacante])

  if (loading) {
    return <LoadingSpinner message="Cargando entrevistas..." />
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Gestión de Entrevistas</h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Para programar una nueva entrevista, ve al detalle del candidato
        </p>
      </div>

      <div className="filtros-entrevistas">
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="TODAS">Todas las entrevistas</option>
          <option value="PENDIENTE_PROGRAMAR">Pendiente Programar</option>
          <option value="PENDIENTE">Pendientes</option>
          <option value="REALIZADA">Realizadas</option>
          <option value="CANCELADA">Canceladas</option>
        </select>
      </div>

      <div className="entrevistas-grid">
        {pageEntrevistas.length === 0 ? (
          <div className="empty-state">
            <p>No hay entrevistas programadas</p>
          </div>
        ) : (
          pageEntrevistas.map(entrevista => {
            const candidato = candidatos.find(c => c.idPostulante === entrevista.idCandidato) || entrevista.candidatoInfo
            const esVirtual = entrevista.idEntrevista?.toString().startsWith('virtual-')
            const nombreCompleto = candidato?.nombreCompleto || candidato?.nombres && candidato?.apellidoPaterno 
              ? `${candidato.nombres} ${candidato.apellidoPaterno}` 
              : 'Candidato no encontrado'
            
            return (
              <div key={entrevista.idEntrevista} className="entrevista-card">
                <div className="entrevista-header">
                  <h3>{nombreCompleto}</h3>
                  <span className={`estado-badge estado-${entrevista.estado?.toLowerCase().replace('_', '-')}`}>
                    {entrevista.estado === 'PENDIENTE_PROGRAMAR' ? 'Pendiente Programar' : entrevista.estado}
                  </span>
                </div>
                <div className="entrevista-info">
                  {entrevista.candidatoInfo && (
                    <>
                      <p><strong>Email:</strong> {entrevista.candidatoInfo.email || '-'}</p>
                      <p><strong>Teléfono:</strong> {entrevista.candidatoInfo.telefono || '-'}</p>
                      <p><strong>Vacante:</strong> {entrevista.candidatoInfo.nombreVacante || '-'}</p>
                    </>
                  )}
                  {!esVirtual && (
                    <>
                      <p><strong>Fecha:</strong> {entrevista.fecha ? new Date(entrevista.fecha).toLocaleDateString('es-ES') : '-'}</p>
                      <p><strong>Hora:</strong> {entrevista.hora || '-'}</p>
                      <p><strong>Lugar:</strong> {entrevista.lugar || '-'}</p>
                      <p><strong>Entrevistador:</strong> {entrevista.entrevistador || '-'}</p>
                      {entrevista.observaciones && (
                        <p><strong>Observaciones:</strong> {entrevista.observaciones}</p>
                      )}
                    </>
                  )}
                  {esVirtual && (
                    <p style={{ color: '#ff9800', fontStyle: 'italic' }}>
                      Este candidato está en etapa de entrevista pero aún no tiene una entrevista programada.
                    </p>
                  )}
                </div>
                <div className="entrevista-actions">
                  {esVirtual ? (
                    <>
                      <button 
                        className="btn-primary" 
                        onClick={async () => {
                          // Preparar datos del formulario
                          const candidatoId = entrevista.idCandidato.toString()
                          let procesoId = entrevista.idProceso?.toString() || ''
                          
                          // Si no hay proceso, intentar obtenerlo del mapa o cargarlo
                          if (!procesoId) {
                            const procesoInfo = procesosMap.get(candidatoId)
                            if (procesoInfo?.idProceso) {
                              procesoId = procesoInfo.idProceso.toString()
                            } else {
                              // Cargar proceso del candidato y esperar el resultado
                              procesoId = await cargarProcesoDelCandidato(candidatoId) || ''
                            }
                          }
                          
                          // Configurar formulario con los datos
                          setFormData({
                            idCandidato: candidatoId,
                            idProceso: procesoId,
                            fecha: '',
                            hora: '',
                            lugar: 'Oficina principal - Sala de reuniones',
                            entrevistador: '',
                            observaciones: ''
                          })
                          setEntrevistaSeleccionada(null) // No es edición, es creación
                          setShowModal(true)
                        }}
                      >
                        Programar Entrevista
                      </button>
                      <button 
                        className="btn-success" 
                        onClick={() => handleMoverAPrueba(entrevista)}
                        style={{ marginTop: '8px' }}
                      >
                        ✓ Pasa - Mover a Prueba
                      </button>
                      <button 
                        className="btn-danger" 
                        onClick={() => handleRechazarDesdeEntrevista(entrevista)}
                        style={{ marginTop: '8px' }}
                      >
                        ✗ Rechazar
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="btn-secondary" onClick={() => handleEditar(entrevista)}>
                        Editar
                      </button>
                      {entrevista.estado === 'PENDIENTE' && (
                        <button className="btn-danger" onClick={() => handleCancelar(entrevista.idEntrevista)}>
                          Cancelar
                        </button>
                      )}
                      <button 
                        className="btn-success" 
                        onClick={() => handleMoverAPrueba(entrevista)}
                        style={{ marginTop: '8px' }}
                      >
                        ✓ Pasa Entrevista - Mover a Prueba
                      </button>
                      <button 
                        className="btn-danger" 
                        onClick={() => handleRechazarDesdeEntrevista(entrevista)}
                        style={{ marginTop: '8px' }}
                      >
                        ✗ Rechazar
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>

      {entrevistasFiltradas.length > itemsPerPage && (
        <Paginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        />
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false)
          resetForm()
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{entrevistaSeleccionada ? 'Editar Entrevista' : 'Programar Nueva Entrevista'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Candidato *</label>
                <select
                  value={formData.idCandidato}
                  onChange={(e) => {
                    const nuevoCandidatoId = e.target.value
                    setFormData({ ...formData, idCandidato: nuevoCandidatoId })
                    // Cargar proceso automáticamente cuando se selecciona un candidato
                    if (nuevoCandidatoId) {
                      cargarProcesoDelCandidato(nuevoCandidatoId)
                    } else {
                      setFormData(prev => ({ ...prev, idProceso: '', lugar: '' }))
                    }
                  }}
                  required
                  disabled={!!entrevistaSeleccionada || (formData.idCandidato && !entrevistaSeleccionada)}
                >
                  <option value="">Seleccionar candidato</option>
                  {candidatos.map(c => (
                    <option key={c.idPostulante} value={c.idPostulante}>
                      {c.nombreCompleto || `${c.nombres} ${c.apellidoPaterno}`}
                    </option>
                  ))}
                </select>
                {formData.idCandidato && !entrevistaSeleccionada && (
                  <small style={{ color: '#28a745', fontSize: '12px', display: 'block', marginTop: '0.25rem' }}>
                    ✓ Candidato seleccionado automáticamente
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Proceso de Selección (ID) *</label>
                <input
                  type="number"
                  value={formData.idProceso}
                  onChange={(e) => setFormData({ ...formData, idProceso: e.target.value })}
                  placeholder={cargandoProceso ? 'Cargando...' : 'ID del proceso de selección'}
                  required
                  disabled={cargandoProceso || !!entrevistaSeleccionada}
                />
                {cargandoProceso && (
                  <small style={{ color: '#667eea', fontSize: '12px' }}>
                    Cargando proceso del candidato...
                  </small>
                )}
                {!cargandoProceso && formData.idProceso && (
                  <small style={{ color: '#28a745', fontSize: '12px' }}>
                    ✓ Proceso cargado automáticamente
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Fecha *</label>
                <input
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData({ ...formData, fecha: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Hora *</label>
                <input
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData({ ...formData, hora: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Lugar *</label>
                <input
                  type="text"
                  value={formData.lugar}
                  onChange={(e) => setFormData({ ...formData, lugar: e.target.value })}
                  placeholder="Ej: Oficina principal, Sala de reuniones"
                  required
                />
                {!formData.lugar && (
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    Se usará "Oficina principal - Sala de reuniones" por defecto
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>Entrevistador *</label>
                <input
                  type="text"
                  value={formData.entrevistador}
                  onChange={(e) => setFormData({ ...formData, entrevistador: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Observaciones</label>
                <textarea
                  value={formData.observaciones}
                  onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => {
                  setShowModal(false)
                  resetForm()
                }}>
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!formData.idProceso && cargandoProceso}
                >
                  {entrevistaSeleccionada ? 'Actualizar' : 'Programar Entrevista'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionEntrevistas

