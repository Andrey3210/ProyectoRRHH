import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import reclutamientoService from '../../services/api/reclutamientoService'
import candidatoService from '../../services/api/candidatoService'
import vacanteService from '../../services/api/vacanteService'
import { useNotification } from '../../components/common/NotificationProvider'
import { EtapaProceso } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Paginacion from './components/Paginacion'
import './GestionEntrevistas.css'

const GestionEvaluaciones = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useNotification()
  
  const [candidatos, setCandidatos] = useState([])
  const [vacantes, setVacantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [candidatoSeleccionado, setCandidatoSeleccionado] = useState(null)
  const [filtroVacante, setFiltroVacante] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  const [formEvaluacion, setFormEvaluacion] = useState({
    tipo: 'TECNICA',
    puntuacion: 0,
    observaciones: ''
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
      
      // Obtener candidatos en etapa PRUEBA
      const candidatosEnPrueba = []
      for (const vacante of vacantesData) {
        try {
          const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
          procesos.forEach(pp => {
            // Solo incluir candidatos en etapa PRUEBA y que NO estén rechazados
            const estaEnPrueba = pp.etapaActual === EtapaProceso.PRUEBA || pp.etapaActual === 'PRUEBA'
            const noEstaRechazado = pp.estado !== 'DESCARTADO' && pp.estado !== 'DESCARTADO'
            
            if (estaEnPrueba && noEstaRechazado) {
              const candidato = candidatosData.find(c => c.idPostulante === pp.idPostulante)
              if (candidato) {
                candidatosEnPrueba.push({
                  idPostulante: pp.idPostulante,
                  nombreCompleto: candidato.nombreCompleto || `${candidato.nombres} ${candidato.apellidoPaterno}`,
                  email: candidato.email,
                  telefono: candidato.telefono,
                  idVacante: vacante.idVacante,
                  nombreVacante: vacante.nombre,
                  idProceso: pp.idProcesoActual,
                  idPostulanteProceso: pp.idPostulanteProceso,
                  tieneEvaluacion: pp.calificacion != null && pp.calificacion !== undefined,
                  calificacion: pp.calificacion
                })
              }
            }
          })
        } catch (err) {
          console.warn(`Error al obtener procesos de vacante ${vacante.idVacante}:`, err)
        }
      }
      
      setCandidatos(candidatosEnPrueba)
      setVacantes(vacantesData || [])
    } catch (err) {
      console.error('Error al cargar datos:', err)
      showError('Error al cargar las evaluaciones')
    } finally {
      setLoading(false)
    }
  }

  const handleRegistrarEvaluacion = async () => {
    if (!candidatoSeleccionado || !candidatoSeleccionado.idProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    try {
      await reclutamientoService.evaluarCandidato(
        candidatoSeleccionado.idPostulante,
        candidatoSeleccionado.idProceso,
        {
          tipoEvaluacion: 'TECNICA', // Siempre técnica en esta sección
          puntuacion: formEvaluacion.puntuacion,
          observaciones: formEvaluacion.observaciones
        }
      )
      success('Evaluación registrada exitosamente')
      setShowModal(false)
      setFormEvaluacion({ tipo: 'TECNICA', puntuacion: 0, observaciones: '' })
      setCandidatoSeleccionado(null)
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al registrar la evaluación')
    }
  }

  const handleMoverAOferta = async (candidato) => {
    if (!candidato.idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    try {
      await reclutamientoService.moverCandidatoEtapa(candidato.idPostulanteProceso, EtapaProceso.OFERTA)
      success('Candidato movido a etapa de Oferta')
      cargarDatos()
    } catch (err) {
      showError(err.message || 'Error al mover el candidato')
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

  const candidatosFiltrados = candidatos.filter(c => {
    return !filtroVacante || c.nombreVacante === filtroVacante
  })

  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pageCandidatos = candidatosFiltrados.slice(start, end)
  const totalPages = Math.ceil(candidatosFiltrados.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [filtroVacante])

  if (loading) {
    return <LoadingSpinner message="Cargando evaluaciones..." />
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Gestión de Evaluaciones (Prueba Técnica)</h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Registre los resultados de las pruebas técnicas realizadas a los candidatos
        </p>
      </div>

      <div className="filtros-entrevistas">
        <select value={filtroVacante} onChange={(e) => setFiltroVacante(e.target.value)}>
          <option value="">Todas las vacantes</option>
          {vacantes.map(v => (
            <option key={v.idVacante} value={v.nombre}>
              {v.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="entrevistas-grid">
        {pageCandidatos.length === 0 ? (
          <div className="empty-state">
            <p>No hay candidatos en etapa de Prueba Técnica</p>
          </div>
        ) : (
          pageCandidatos.map(candidato => (
            <div key={candidato.idPostulante} className="entrevista-card">
              <div className="entrevista-header">
                <h3>{candidato.nombreCompleto}</h3>
                <span className="estado-badge" style={{ 
                  backgroundColor: '#ffc107', 
                  color: '#000',
                  fontWeight: 'bold'
                }}>PRUEBA TÉCNICA</span>
              </div>
              <div className="entrevista-info">
                <p><strong>Email:</strong> {candidato.email || '-'}</p>
                <p><strong>Teléfono:</strong> {candidato.telefono || '-'}</p>
                <p><strong>Vacante:</strong> {candidato.nombreVacante || '-'}</p>
              </div>
              <div className="entrevista-actions">
                {candidato.tieneEvaluacion ? (
                  <div style={{
                    padding: '12px',
                    backgroundColor: '#d4edda',
                    border: '1px solid #c3e6cb',
                    borderRadius: '4px',
                    textAlign: 'center',
                    color: '#155724',
                    fontWeight: 'bold',
                    marginBottom: '8px'
                  }}>
                    ✓ Evaluación Registrada
                    {candidato.calificacion != null && (
                      <div style={{ fontSize: '12px', marginTop: '4px', color: '#155724' }}>
                        Puntuación: {candidato.calificacion}
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      setCandidatoSeleccionado(candidato)
                      setShowModal(true)
                    }}
                  >
                    Registrar Evaluación
                  </button>
                )}
                <button 
                  className="btn-success" 
                  onClick={() => handleMoverAOferta(candidato)}
                  style={{ marginTop: '8px' }}
                  disabled={!candidato.tieneEvaluacion}
                >
                  ✓ Aprueba - Mover a Oferta
                </button>
                <button 
                  className="btn-danger" 
                  onClick={() => handleRechazar(candidato)}
                  style={{ marginTop: '8px' }}
                >
                  ✗ Rechazar
                </button>
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
          setFormEvaluacion({ tipo: 'TECNICA', puntuacion: 0, observaciones: '' })
        }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Registrar Evaluación</h2>
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
              <label>Tipo de Evaluación *</label>
              <input
                type="text"
                value="Prueba Técnica"
                disabled
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', background: '#f5f5f5', fontWeight: 'bold' }}
              />
              <input
                type="hidden"
                value="TECNICA"
              />
            </div>
            <div className="form-group">
              <label>Puntuación (0-100) *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formEvaluacion.puntuacion}
                onChange={(e) => setFormEvaluacion({ ...formEvaluacion, puntuacion: parseInt(e.target.value) || 0 })}
                required
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
              />
            </div>
            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                value={formEvaluacion.observaciones}
                onChange={(e) => setFormEvaluacion({ ...formEvaluacion, observaciones: e.target.value })}
                rows="3"
                style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', resize: 'vertical' }}
              />
            </div>
            <div className="modal-actions">
              <button 
                type="button"
                className="btn-secondary" 
                onClick={() => {
                  setShowModal(false)
                  setCandidatoSeleccionado(null)
                  setFormEvaluacion({ tipo: 'TECNICA', puntuacion: 0, observaciones: '' })
                }}
              >
                Cancelar
              </button>
              <button 
                type="button"
                className="btn-primary" 
                onClick={handleRegistrarEvaluacion}
              >
                Guardar Evaluación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GestionEvaluaciones

