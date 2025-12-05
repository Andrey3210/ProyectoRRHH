import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import reclutamientoService from '../../services/api/reclutamientoService'
import ofertaService from '../../services/api/ofertaService'
import candidatoService from '../../services/api/candidatoService'
import vacanteService from '../../services/api/vacanteService'
import { useNotification } from '../../components/common/NotificationProvider'
import { EtapaProceso } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Paginacion from './components/Paginacion'
import './GestionEntrevistas.css'

const GestionOfertas = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useNotification()
  
  const [candidatos, setCandidatos] = useState([])
  const [ofertas, setOfertas] = useState([])
  const [vacantes, setVacantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null)
  const [filtroVacante, setFiltroVacante] = useState('')
  const [filtroEstado, setFiltroEstado] = useState('TODAS')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const [formOferta, setFormOferta] = useState({
    salario: '',
    beneficios: '',
    condiciones: '',
    fechaInicio: ''
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [candidatosData, vacantesData] = await Promise.all([
        candidatoService.obtenerCandidatos(),
        vacanteService.obtenerVacantes()
      ])
      
      // Obtener candidatos en etapa OFERTA
      const candidatosEnOferta = []
      for (const vacante of vacantesData) {
        try {
          const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
          procesos.forEach(pp => {
            if (pp.etapaActual === EtapaProceso.OFERTA || pp.etapaActual === 'OFERTA') {
              const candidato = candidatosData.find(c => c.idPostulante === pp.idPostulante)
              if (candidato) {
                candidatosEnOferta.push({
                  idPostulante: pp.idPostulante,
                  nombreCompleto: candidato.nombreCompleto || `${candidato.nombres} ${candidato.apellidoPaterno}`,
                  email: candidato.email,
                  telefono: candidato.telefono,
                  idVacante: vacante.idVacante,
                  nombreVacante: vacante.nombre,
                  idProceso: pp.idProcesoActual,
                  idPostulanteProceso: pp.idPostulanteProceso
                })
              }
            }
          })
        } catch (err) {
          console.warn(`Error al obtener procesos de vacante ${vacante.idVacante}:`, err)
        }
      }
      
      // Cargar ofertas existentes
      let ofertasData = []
      try {
        ofertasData = await ofertaService.obtenerOfertas()
      } catch (err) {
        console.warn('Error al cargar ofertas:', err)
      }
      
      setCandidatos(candidatosEnOferta)
      setOfertas(Array.isArray(ofertasData) ? ofertasData : [])
      setVacantes(vacantesData || [])
    } catch (err) {
      console.error('Error al cargar datos:', err)
      showError('Error al cargar las ofertas')
    } finally {
      setLoading(false)
    }
  }

  const handleEmitirOferta = async () => {
    if (!candidatoSeleccionado || !candidatoSeleccionado.idVacante) {
      showError('No se encontró la vacante o el candidato')
      return
    }

    try {
      await ofertaService.emitirOferta({
        idVacante: candidatoSeleccionado.idVacante,
        idCandidato: candidatoSeleccionado.idPostulante,
        salarioOfrecido: parseFloat(formOferta.salario),
        beneficios: formOferta.beneficios || '',
        condiciones: formOferta.condiciones || '',
        fechaInicio: formOferta.fechaInicio
      })
      success('Oferta laboral emitida exitosamente')
      setShowModal(false)
      setFormOferta({ salario: '', beneficios: '', condiciones: '', fechaInicio: '' })
      setCandidatoSeleccionado(null)
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al emitir la oferta')
    }
  }

  const handleCerrarContratacion = async (candidato) => {
    if (!window.confirm(`¿Confirmar contratación de ${candidato.nombreCompleto}?`)) return
    
    if (!candidato.idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    try {
      await reclutamientoService.moverCandidatoEtapa(candidato.idPostulanteProceso, EtapaProceso.CONTRATACION)
      success('Contratación cerrada. Candidato convertido a empleado.')
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al cerrar la contratación')
    }
  }

  const handleRechazar = async (candidato) => {
    if (!window.confirm(`¿Está seguro de rechazar a ${candidato.nombreCompleto}?`)) return
    
    if (!candidato.idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    const motivo = prompt('Ingrese el motivo del rechazo:')
    if (!motivo) return

    try {
      await reclutamientoService.rechazarCandidato(candidato.idPostulanteProceso, motivo)
      success('Candidato rechazado')
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al rechazar el candidato')
    }
  }

  // Combinar candidatos con sus ofertas
  const candidatosConOfertas = candidatos.map(candidato => {
    const oferta = ofertas.find(o => 
      o.idCandidato === candidato.idPostulante && 
      o.idVacante === candidato.idVacante
    )
    return {
      ...candidato,
      oferta: oferta || null,
      tieneOferta: !!oferta
    }
  })

  const candidatosFiltrados = candidatosConOfertas.filter(c => {
    const vacanteMatch = !filtroVacante || c.nombreVacante === filtroVacante
    const estadoMatch = filtroEstado === 'TODAS' || 
      (filtroEstado === 'CON_OFERTA' && c.tieneOferta) ||
      (filtroEstado === 'SIN_OFERTA' && !c.tieneOferta)
    return vacanteMatch && estadoMatch
  })

  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pageCandidatos = candidatosFiltrados.slice(start, end)
  const totalPages = Math.ceil(candidatosFiltrados.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [filtroVacante, filtroEstado])

  if (loading) {
    return <LoadingSpinner message="Cargando ofertas..." />
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Gestión de Ofertas Laborales</h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Emita ofertas formales a los candidatos que aprobaron las evaluaciones
        </p>
      </div>

      <div className="filtros-entrevistas" style={{ display: 'flex', gap: '1rem' }}>
        <select value={filtroVacante} onChange={(e) => setFiltroVacante(e.target.value)}>
          <option value="">Todas las vacantes</option>
          {vacantes.map(v => (
            <option key={v.idVacante} value={v.nombre}>
              {v.nombre}
            </option>
          ))}
        </select>
        <select value={filtroEstado} onChange={(e) => setFiltroEstado(e.target.value)}>
          <option value="TODAS">Todas</option>
          <option value="CON_OFERTA">Con Oferta Emitida</option>
          <option value="SIN_OFERTA">Sin Oferta</option>
        </select>
      </div>

      <div className="entrevistas-grid">
        {pageCandidatos.length === 0 ? (
          <div className="empty-state">
            <p>No hay candidatos en etapa de Oferta</p>
          </div>
        ) : (
          pageCandidatos.map(candidato => (
            <div key={candidato.idPostulante} className="entrevista-card">
              <div className="entrevista-header">
                <h3>{candidato.nombreCompleto}</h3>
                <span className={`estado-badge ${candidato.tieneOferta ? 'estado-realizada' : 'estado-pendiente'}`}>
                  {candidato.tieneOferta ? 'Oferta Emitida' : 'Pendiente Oferta'}
                </span>
              </div>
              <div className="entrevista-info">
                <p><strong>Email:</strong> {candidato.email || '-'}</p>
                <p><strong>Teléfono:</strong> {candidato.telefono || '-'}</p>
                <p><strong>Vacante:</strong> {candidato.nombreVacante || '-'}</p>
                {candidato.oferta && (
                  <>
                    <p><strong>Salario Ofrecido:</strong> ${candidato.oferta.salarioOfrecido?.toLocaleString() || '-'}</p>
                    <p><strong>Fecha Inicio:</strong> {candidato.oferta.fechaInicio ? new Date(candidato.oferta.fechaInicio).toLocaleDateString('es-ES') : '-'}</p>
                    <p><strong>Estado Oferta:</strong> {candidato.oferta.estadoOferta || '-'}</p>
                  </>
                )}
              </div>
              <div className="entrevista-actions">
                {!candidato.tieneOferta ? (
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      setCandidatoSeleccionado(candidato)
                      setShowModal(true)
                    }}
                  >
                    Emitir Oferta
                  </button>
                ) : (
                  <>
                    <button 
                      className="btn-success" 
                      onClick={() => handleCerrarContratacion(candidato)}
                    >
                      ✓ Acepta Oferta - Cerrar Contratación
                    </button>
                    <button 
                      className="btn-danger" 
                      onClick={() => handleRechazar(candidato)}
                      style={{ marginTop: '8px' }}
                    >
                      ✗ Rechaza Oferta
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {candidatosFiltrados.length > itemsPerPage && (
        <Paginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        />
      )}

      {showModal && candidatoSeleccionado && (
        <div className="modal-overlay" onClick={() => {
          setShowModal(false)
          setCandidatoSeleccionado(null)
          setFormOferta({ salario: '', beneficios: '', condiciones: '', fechaInicio: '' })
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Emitir Oferta Laboral</h2>
            <div className="form-group">
              <label>Candidato *</label>
              <input
                type="text"
                value={candidatoSeleccionado.nombreCompleto}
                disabled
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', background: '#f5f5f5' }}
              />
            </div>
            <div className="form-group">
              <label>Vacante *</label>
              <input
                type="text"
                value={candidatoSeleccionado.nombreVacante}
                disabled
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', background: '#f5f5f5' }}
              />
            </div>
            <div className="form-group">
              <label>Salario Ofrecido *</label>
              <input
                type="number"
                value={formOferta.salario}
                onChange={(e) => setFormOferta({ ...formOferta, salario: e.target.value })}
                placeholder="Ej: 50000"
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
            <div className="form-group">
              <label>Beneficios</label>
              <textarea
                value={formOferta.beneficios}
                onChange={(e) => setFormOferta({ ...formOferta, beneficios: e.target.value })}
                rows="2"
                placeholder="Seguro médico, vacaciones, etc."
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label>Condiciones</label>
              <textarea
                value={formOferta.condiciones}
                onChange={(e) => setFormOferta({ ...formOferta, condiciones: e.target.value })}
                rows="2"
                placeholder="Modalidad, horario, etc."
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', resize: 'vertical' }}
              />
            </div>
            <div className="form-group">
              <label>Fecha de Inicio *</label>
              <input
                type="date"
                value={formOferta.fechaInicio}
                onChange={(e) => setFormOferta({ ...formOferta, fechaInicio: e.target.value })}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
            <div className="modal-actions">
              <button 
                type="button"
                className="btn-secondary" 
                onClick={() => {
                  setShowModal(false)
                  setCandidatoSeleccionado(null)
                  setFormOferta({ salario: '', beneficios: '', condiciones: '', fechaInicio: '' })
                }}
              >
                Cancelar
              </button>
              <button 
                type="button"
                className="btn-primary" 
                onClick={handleEmitirOferta}
              >
                Emitir Oferta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionOfertas

