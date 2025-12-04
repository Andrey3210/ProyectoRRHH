import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useNotification } from '../../components/common/NotificationProvider'
import reclutamientoService from '../../services/api/reclutamientoService'
import entrevistaService from '../../services/api/entrevistaService'
import ofertaService from '../../services/api/ofertaService'
import candidatoService from '../../services/api/candidatoService'
import vacanteService from '../../services/api/vacanteService'
import { EtapaProceso, EstadoPostulante } from '../../types'
import './ProcesoSeleccion.css'

/**
 * Componente que gestiona todo el flujo del proceso de selección según el diagrama
 * Permite: mover etapas, registrar entrevistas, evaluaciones, ofertas, etc.
 */
const ProcesoSeleccion = ({ candidatoId, onUpdate }) => {
  const { success, error: showError } = useNotification()
  const [candidato, setCandidato] = useState(null)
  const [procesoInfo, setProcesoInfo] = useState(null)
  const [vacante, setVacante] = useState(null)
  const [etapaActual, setEtapaActual] = useState(null)
  const [estadoCandidato, setEstadoCandidato] = useState(null)
  const [loading, setLoading] = useState(true)

  // Estados para modales
  const [showEvaluacionModal, setShowEvaluacionModal] = useState(false)
  const [showOfertaModal, setShowOfertaModal] = useState(false)
  const [showRechazarModal, setShowRechazarModal] = useState(false)

  // Formularios
  const [formEvaluacion, setFormEvaluacion] = useState({ tipo: 'TECNICA', puntuacion: 0, observaciones: '' })
  const [formOferta, setFormOferta] = useState({ salario: '', beneficios: '', condiciones: '', fechaInicio: '' })
  const [motivoRechazo, setMotivoRechazo] = useState('')

  useEffect(() => {
    cargarDatos()
  }, [candidatoId])

  const cargarDatos = async () => {
    try {
      setLoading(true)
      const [candidatoData, vacantesData] = await Promise.all([
        candidatoService.obtenerCandidatoPorId(candidatoId),
        vacanteService.obtenerVacantes()
      ])
      
      setCandidato(candidatoData)
      
      // Buscar el proceso del candidato
      for (const v of vacantesData) {
        try {
          const procesos = await reclutamientoService.obtenerCandidatosPorVacante(v.idVacante)
          const procesoCandidato = procesos.find(pp => pp.idPostulante === candidatoData.idPostulante)
          
          if (procesoCandidato) {
            setProcesoInfo(procesoCandidato)
            setEtapaActual(procesoCandidato.etapaActual || EtapaProceso.REVISION_CV)
            setEstadoCandidato(procesoCandidato.estado || EstadoPostulante.ACTIVO)
            setVacante(vacantesData.find(vac => vac.idVacante === v.idVacante))
            break
          }
        } catch (err) {
          console.warn(`Error al buscar proceso en vacante ${v.idVacante}:`, err)
        }
      }
    } catch (err) {
      console.error('Error al cargar datos:', err)
      showError('Error al cargar la información del proceso')
    } finally {
      setLoading(false)
    }
  }

  // 1. Mover a siguiente etapa
  const handleMoverEtapa = async (nuevaEtapa) => {
    if (!procesoInfo || !procesoInfo.idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    try {
      await reclutamientoService.moverCandidatoEtapa(procesoInfo.idPostulanteProceso, nuevaEtapa)
      success(`Candidato movido a etapa: ${nuevaEtapa}`)
      await cargarDatos()
      if (onUpdate) onUpdate()
    } catch (err) {
      showError(err.message || 'Error al mover el candidato de etapa')
    }
  }

  // 2. Rechazar candidato
  const handleRechazar = async () => {
    if (!procesoInfo || !procesoInfo.idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    if (!motivoRechazo.trim()) {
      showError('Debe especificar un motivo de rechazo')
      return
    }

    try {
      await reclutamientoService.rechazarCandidato(procesoInfo.idPostulanteProceso, motivoRechazo)
      success('Candidato rechazado')
      setShowRechazarModal(false)
      setMotivoRechazo('')
      await cargarDatos()
      if (onUpdate) onUpdate()
    } catch (err) {
      showError(err.message || 'Error al rechazar el candidato')
    }
  }

  // 3. Registrar evaluación
  const handleRegistrarEvaluacion = async () => {
    if (!procesoInfo || !procesoInfo.idProcesoActual) {
      showError('No se encontró el proceso del candidato')
      return
    }

    try {
      // Usar el servicio de reclutamiento para evaluar
      await reclutamientoService.evaluarCandidato(
        candidato.idPostulante,
        procesoInfo.idProcesoActual,
        {
          tipoEvaluacion: formEvaluacion.tipo,
          puntuacion: formEvaluacion.puntuacion,
          observaciones: formEvaluacion.observaciones
        }
      )
      success('Evaluación registrada exitosamente')
      setShowEvaluacionModal(false)
      setFormEvaluacion({ tipo: 'TECNICA', puntuacion: 0, observaciones: '' })
      await cargarDatos()
      if (onUpdate) onUpdate()
    } catch (err) {
      showError(err.message || 'Error al registrar la evaluación')
    }
  }

  // 4. Emitir oferta
  const handleEmitirOferta = async () => {
    if (!vacante || !candidato) {
      showError('No se encontró la vacante o el candidato')
      return
    }

    try {
      await ofertaService.emitirOferta({
        idVacante: vacante.idVacante,
        idCandidato: candidato.idPostulante,
        salarioOfrecido: parseFloat(formOferta.salario),
        beneficios: formOferta.beneficios || '',
        condiciones: formOferta.condiciones || '',
        fechaInicio: formOferta.fechaInicio
      })
      success('Oferta laboral emitida exitosamente')
      setShowOfertaModal(false)
      setFormOferta({ salario: '', beneficios: '', condiciones: '', fechaInicio: '' })
      await cargarDatos()
      if (onUpdate) onUpdate()
    } catch (err) {
      showError(err.message || 'Error al emitir la oferta')
    }
  }

  // 5. Cerrar contratación
  const handleCerrarContratacion = async () => {
    if (!procesoInfo || !procesoInfo.idPostulanteProceso) {
      showError('No se encontró el proceso del candidato')
      return
    }

    try {
      await reclutamientoService.moverCandidatoEtapa(procesoInfo.idPostulanteProceso, EtapaProceso.CONTRATACION)
      success('Contratación cerrada. Candidato convertido a empleado.')
      await cargarDatos()
      if (onUpdate) onUpdate()
    } catch (err) {
      showError(err.message || 'Error al cerrar la contratación')
    }
  }

  if (loading) {
    return <div className="proceso-seleccion-loading">Cargando proceso de selección...</div>
  }

  if (!procesoInfo) {
    return (
      <div className="proceso-seleccion-error">
        <p>No se encontró un proceso de selección para este candidato.</p>
        <p>El candidato debe estar vinculado a una vacante.</p>
      </div>
    )
  }

  // Verificar si el candidato está rechazado
  const estaRechazado = estadoCandidato === EstadoPostulante.DESCARTADO || estadoCandidato === 'DESCARTADO'
  const estaContratado = estadoCandidato === EstadoPostulante.CONTRATADO || estadoCandidato === 'CONTRATADO'

  const puedeMoverAEntrevista = etapaActual === EtapaProceso.REVISION_CV && !estaRechazado && !estaContratado
  const puedeMoverAPrueba = etapaActual === EtapaProceso.ENTREVISTA && !estaRechazado && !estaContratado
  const puedeMoverAOferta = etapaActual === EtapaProceso.PRUEBA && !estaRechazado && !estaContratado
  const puedeCerrarContratacion = etapaActual === EtapaProceso.OFERTA && !estaRechazado && !estaContratado

  return (
    <div className="proceso-seleccion-container">
      <div className="proceso-seleccion-header">
        <h3>Proceso de Selección</h3>
        <div className="proceso-seleccion-info">
          <span><strong>Etapa Actual:</strong> {etapaActual}</span>
          {estaRechazado && (
            <span style={{ 
              marginLeft: '16px', 
              padding: '4px 12px', 
              backgroundColor: '#dc3545', 
              color: 'white', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              ❌ RECHAZADO
            </span>
          )}
          {estaContratado && (
            <span style={{ 
              marginLeft: '16px', 
              padding: '4px 12px', 
              backgroundColor: '#28a745', 
              color: 'white', 
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold'
            }}>
              ✅ CONTRATADO
            </span>
          )}
        </div>
      </div>

      <div className="proceso-seleccion-etapas">
        {/* Mostrar mensaje si está rechazado */}
        {estaRechazado && (
          <div className="proceso-etapa-card" style={{ 
            backgroundColor: '#fff3cd', 
            borderLeft: '4px solid #dc3545',
            padding: '1.5rem'
          }}>
            <h4 style={{ color: '#dc3545', marginBottom: '0.5rem' }}>❌ Candidato Rechazado</h4>
            <p style={{ color: '#856404', marginBottom: '0.5rem' }}>
              Este candidato fue rechazado en la etapa: <strong>{etapaActual}</strong>
            </p>
            {procesoInfo.motivoRechazo && (
              <div style={{ 
                marginTop: '1rem', 
                padding: '0.75rem', 
                backgroundColor: 'white', 
                borderRadius: '4px',
                border: '1px solid #dc3545'
              }}>
                <strong>Motivo del rechazo:</strong>
                <p style={{ marginTop: '0.5rem', color: '#333' }}>{procesoInfo.motivoRechazo}</p>
              </div>
            )}
            <p style={{ marginTop: '1rem', fontSize: '13px', color: '#856404' }}>
              No se pueden realizar más acciones sobre este candidato en el proceso de selección.
            </p>
          </div>
        )}

        {/* Mostrar proceso normal solo si NO está rechazado */}
        {!estaRechazado && (
          <>
            {/* ETAPA 1: REVISION_CV */}
            {etapaActual === EtapaProceso.REVISION_CV && (
          <div className="proceso-etapa-card">
            <h4>1. Revisión de CV</h4>
            <p>Revise el CV del candidato y determine si cumple con los requisitos mínimos.</p>
            <div className="proceso-acciones">
              <button className="btn-success" onClick={() => handleMoverEtapa(EtapaProceso.ENTREVISTA)}>
                ✓ Cumple requisitos - Mover a Entrevista
              </button>
              <button className="btn-danger" onClick={() => setShowRechazarModal(true)}>
                ✗ No cumple requisitos - Rechazar
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 2: ENTREVISTA */}
        {etapaActual === EtapaProceso.ENTREVISTA && (
          <div className="proceso-etapa-card">
            <h4>2. Realizar Entrevista</h4>
            <p>Programe y realice la entrevista con el candidato.</p>
            <div className="proceso-acciones">
              <button className="btn-primary" onClick={() => window.location.href = `/entrevistas`}>
                Ver Entrevistas Programadas
              </button>
              <button className="btn-secondary" onClick={() => handleMoverEtapa(EtapaProceso.PRUEBA)}>
                ✓ Pasa Entrevista - Mover a Prueba
              </button>
              <button className="btn-danger" onClick={() => setShowRechazarModal(true)}>
                ✗ No Pasa - Rechazar
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 3: PRUEBA */}
        {etapaActual === EtapaProceso.PRUEBA && (
          <div className="proceso-etapa-card">
            <h4>3. Realizar Evaluación</h4>
            <p>Registre los resultados de la evaluación técnica o psicológica.</p>
            <div className="proceso-acciones">
              <button className="btn-primary" onClick={() => setShowEvaluacionModal(true)}>
                Registrar Evaluación
              </button>
              <button className="btn-success" onClick={() => handleMoverEtapa(EtapaProceso.OFERTA)}>
                ✓ Aprueba Prueba - Mover a Oferta
              </button>
              <button className="btn-danger" onClick={() => setShowRechazarModal(true)}>
                ✗ No Aprueba - Rechazar
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 4: OFERTA */}
        {etapaActual === EtapaProceso.OFERTA && (
          <div className="proceso-etapa-card">
            <h4>4. Emitir Oferta Laboral</h4>
            <p>Genere y envíe la oferta formal al candidato.</p>
            <div className="proceso-acciones">
              <button className="btn-primary" onClick={() => setShowOfertaModal(true)}>
                Emitir Oferta
              </button>
              <button className="btn-success" onClick={handleCerrarContratacion}>
                ✓ Acepta Oferta - Cerrar Contratación
              </button>
              <button className="btn-danger" onClick={() => setShowRechazarModal(true)}>
                ✗ Rechaza Oferta
              </button>
            </div>
          </div>
        )}

        {/* ETAPA 5: CONTRATACION */}
        {etapaActual === EtapaProceso.CONTRATACION && (
          <div className="proceso-etapa-card proceso-completado">
            <h4>✓ Contratación Cerrada</h4>
            <p>El candidato ha sido contratado y debe integrarse con el módulo de Gestión de Empleados.</p>
          </div>
        )}
          </>
        )}
      </div>

      {/* MODAL: Evaluación */}
      {showEvaluacionModal && (
        <div className="modal-overlay" onClick={() => setShowEvaluacionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Registrar Evaluación</h3>
            <div className="form-group">
              <label>Tipo de Evaluación *</label>
              <select
                value={formEvaluacion.tipo}
                onChange={(e) => setFormEvaluacion({ ...formEvaluacion, tipo: e.target.value })}
                required
              >
                <option value="TECNICA">Técnica</option>
                <option value="PSICOLOGICA">Psicológica</option>
                <option value="OTRA">Otra</option>
              </select>
            </div>
            <div className="form-group">
              <label>Puntuación (0-100) *</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formEvaluacion.puntuacion}
                onChange={(e) => setFormEvaluacion({ ...formEvaluacion, puntuacion: parseInt(e.target.value) })}
                required
              />
            </div>
            <div className="form-group">
              <label>Observaciones</label>
              <textarea
                value={formEvaluacion.observaciones}
                onChange={(e) => setFormEvaluacion({ ...formEvaluacion, observaciones: e.target.value })}
                rows="3"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowEvaluacionModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleRegistrarEvaluacion}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Oferta */}
      {showOfertaModal && (
        <div className="modal-overlay" onClick={() => setShowOfertaModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Emitir Oferta Laboral</h3>
            <div className="form-group">
              <label>Salario Ofrecido *</label>
              <input
                type="number"
                value={formOferta.salario}
                onChange={(e) => setFormOferta({ ...formOferta, salario: e.target.value })}
                placeholder="Ej: 50000"
                required
              />
            </div>
            <div className="form-group">
              <label>Beneficios</label>
              <textarea
                value={formOferta.beneficios}
                onChange={(e) => setFormOferta({ ...formOferta, beneficios: e.target.value })}
                rows="2"
                placeholder="Seguro médico, vacaciones, etc."
              />
            </div>
            <div className="form-group">
              <label>Condiciones</label>
              <textarea
                value={formOferta.condiciones}
                onChange={(e) => setFormOferta({ ...formOferta, condiciones: e.target.value })}
                rows="2"
                placeholder="Modalidad, horario, etc."
              />
            </div>
            <div className="form-group">
              <label>Fecha de Inicio *</label>
              <input
                type="date"
                value={formOferta.fechaInicio}
                onChange={(e) => setFormOferta({ ...formOferta, fechaInicio: e.target.value })}
                required
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowOfertaModal(false)}>Cancelar</button>
              <button className="btn-primary" onClick={handleEmitirOferta}>Emitir Oferta</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Rechazar */}
      {showRechazarModal && (
        <div className="modal-overlay" onClick={() => setShowRechazarModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Rechazar Candidato</h3>
            <div className="form-group">
              <label>Motivo del Rechazo *</label>
              <textarea
                value={motivoRechazo}
                onChange={(e) => setMotivoRechazo(e.target.value)}
                rows="4"
                placeholder="Especifique el motivo del rechazo..."
                required
              />
            </div>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setShowRechazarModal(false)}>Cancelar</button>
              <button className="btn-danger" onClick={handleRechazar}>Confirmar Rechazo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcesoSeleccion

