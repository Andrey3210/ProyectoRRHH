import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRRHH } from '../../store/RRHHContext'
import vacanteService from '../../services/api/vacanteService'
import reclutamientoService from '../../services/api/reclutamientoService'
import { EtapaProceso, EstadoPostulante } from '../../types'

const Pipeline = () => {
  const navigate = useNavigate()
  const { candidatesData, loadCandidates } = useRRHH()
  const [filterVacante, setFilterVacante] = useState('')
  const [vacantes, setVacantes] = useState([])
  const [candidatosRechazados, setCandidatosRechazados] = useState([])
  const [loading, setLoading] = useState(true)

  // Etapas del proceso según el enum del backend - ordenadas según flujo real
  const etapasProceso = [
    { key: EtapaProceso.REVISION_CV, label: 'Revisión CV', color: '#6c757d', icon: '📄' },
    { key: EtapaProceso.ENTREVISTA, label: 'Entrevista', color: '#3C83F6', icon: '💬' },
    { key: EtapaProceso.PRUEBA, label: 'Prueba Técnica', color: '#ffc107', icon: '✍️' },
    { key: EtapaProceso.OFERTA, label: 'Oferta', color: '#28a745', icon: '💰' },
    { key: EtapaProceso.CONTRATACION, label: 'Contratación', color: '#20c997', icon: '✅' }
  ]

  useEffect(() => {
    const cargarDatos = async () => {
      setLoading(true)
      try {
        const [vacantesData] = await Promise.all([
          vacanteService.obtenerVacantes({ estado: 'ABIERTA' })
        ])
        setVacantes(vacantesData)
        
        // Cargar candidatos rechazados de todas las vacantes
        const rechazados = []
        for (const vacante of vacantesData) {
          try {
            const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
            procesos.forEach(pp => {
              if (pp.estado === EstadoPostulante.DESCARTADO || pp.estado === 'DESCARTADO') {
                const postulante = pp.postulante || {}
                rechazados.push({
                  id: pp.idPostulante,
                  name: postulante.nombres && postulante.apellidoPaterno
                    ? `${postulante.nombres} ${postulante.apellidoPaterno} ${postulante.apellidoMaterno || ''}`.trim()
                    : `Candidato ${pp.idPostulante}`,
                  email: postulante.email || 'N/A',
                  phone: postulante.telefono || 'N/A',
                  position: vacante.nombre,
                  etapa: pp.etapaActual || EtapaProceso.REVISION_CV,
                  estado: pp.estado,
                  idVacante: vacante.idVacante
                })
              }
            })
          } catch (err) {
            console.warn(`Error al obtener rechazados de vacante ${vacante.idVacante}:`, err)
          }
        }
        setCandidatosRechazados(rechazados)
        
        // Recargar candidatos para tener datos actualizados
        if (loadCandidates) {
          await loadCandidates()
        }
      } catch (err) {
        console.error('Error al cargar datos:', err)
      } finally {
        setLoading(false)
      }
    }
    cargarDatos()
  }, [loadCandidates])

  const mapearEtapaBackendAFrontend = (etapaBackend) => {
    // Si ya es una etapa válida del enum, retornarla
    if (Object.values(EtapaProceso).includes(etapaBackend)) {
      return etapaBackend
    }
    // Mapeo de estados antiguos a nuevas etapas
    const mapeo = {
      'Nuevo': EtapaProceso.REVISION_CV,
      'En Proceso': EtapaProceso.REVISION_CV,
      'En Entrevista': EtapaProceso.ENTREVISTA,
      'Entrevistado': EtapaProceso.ENTREVISTA,
      'Prueba Técnica': EtapaProceso.PRUEBA,
      'Entrevista Final': EtapaProceso.ENTREVISTA,
      'Oferta': EtapaProceso.OFERTA,
      'Contratado': EtapaProceso.CONTRATACION,
      'Rechazado': 'DESCARTADO'
    }
    return mapeo[etapaBackend] || EtapaProceso.REVISION_CV
  }

  const handleCardClick = (candidate) => {
    // Si está en REVISION_CV, navegar a recepción de CVs
    if (candidate.etapa === EtapaProceso.REVISION_CV) {
      navigate(`/postulantes/${candidate.id}/cv`, {
        state: {
          postulante: candidate,
          nombrePuesto: candidate.position
        }
      })
    } else {
      // Para otras etapas, ir al detalle del candidato
      navigate(`/candidatos/${candidate.id}`)
    }
  }

  // Filtrar candidatos por vacante si hay filtro activo
  const candidatosFiltrados = candidatesData.filter(c => {
    if (filterVacante) {
      return c.position === filterVacante
    }
    return true
  })

  if (loading) {
    return (
      <div className="view-container active">
        <div className="view-header">
          <h1>Pipeline de Selección</h1>
        </div>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <p>Cargando pipeline...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Pipeline de Selección</h1>
        <div className="pipeline-controls">
          <label>Filtrar por Vacante:</label>
          <select
            id="filter-pipeline-vacante"
            value={filterVacante}
            onChange={(e) => setFilterVacante(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
          >
            <option value="">Todas las vacantes</option>
            {vacantes.map(vacante => (
              <option key={vacante.idVacante} value={vacante.nombre}>
                {vacante.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div id="pipeline-container" className="pipeline-container">
        {etapasProceso.map(etapa => {
          // Filtrar candidatos por etapa (mapeando si es necesario) - excluir rechazados
          const candidates = candidatosFiltrados.filter(c => {
            const etapaCandidato = mapearEtapaBackendAFrontend(c.etapa || c.status)
            const esRechazado = c.estado === EstadoPostulante.DESCARTADO || c.estado === 'DESCARTADO'
            return etapaCandidato === etapa.key && !esRechazado
          })

          return (
            <div key={etapa.key} className="pipeline-column">
              <div
                className="pipeline-header"
                style={{ background: etapa.color }}
              >
                <span style={{ marginRight: '8px' }}>{etapa.icon}</span>
                {etapa.label}
                <span style={{ marginLeft: '8px', opacity: 0.9 }}>
                  ({candidates.length})
                </span>
              </div>
              <div className="pipeline-column-content">
                {candidates.length > 0 ? (
                  candidates.map(candidate => (
                    <div
                      key={candidate.id}
                      className="pipeline-card"
                      onClick={() => handleCardClick(candidate)}
                      style={{ cursor: 'pointer' }}
                      title={`Clic para ${candidate.etapa === EtapaProceso.REVISION_CV ? 'revisar CV' : 'ver detalle'}`}
                    >
                      <div className="pipeline-card-name">{candidate.name}</div>
                      <div className="pipeline-card-email">{candidate.email}</div>
                      <div className="pipeline-card-position">{candidate.position}</div>
                      {candidate.phone && (
                        <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                          📞 {candidate.phone}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="pipeline-empty-state">
                    <p>No hay candidatos</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
        
        {/* Columna de Rechazados */}
        <div className="pipeline-column">
          <div
            className="pipeline-header"
            style={{ background: '#dc3545' }}
          >
            <span style={{ marginRight: '8px' }}>❌</span>
            Rechazados
            <span style={{ marginLeft: '8px', opacity: 0.9 }}>
              ({candidatosRechazados.filter(c => !filterVacante || c.position === filterVacante).length})
            </span>
          </div>
          <div className="pipeline-column-content">
            {candidatosRechazados.filter(c => !filterVacante || c.position === filterVacante).length > 0 ? (
              candidatosRechazados
                .filter(c => !filterVacante || c.position === filterVacante)
                .map(candidate => (
                  <div
                    key={candidate.id}
                    className="pipeline-card"
                    onClick={() => navigate(`/candidatos/${candidate.id}`)}
                    style={{ cursor: 'pointer', opacity: 0.7, borderLeft: '4px solid #dc3545' }}
                    title="Clic para ver detalle"
                  >
                    <div className="pipeline-card-name">{candidate.name}</div>
                    <div className="pipeline-card-email">{candidate.email}</div>
                    <div className="pipeline-card-position">{candidate.position}</div>
                    <div style={{ fontSize: '11px', color: '#dc3545', marginTop: '4px', fontStyle: 'italic' }}>
                      Rechazado en: {candidate.etapa === EtapaProceso.REVISION_CV ? 'Revisión CV' :
                        candidate.etapa === EtapaProceso.ENTREVISTA ? 'Entrevista' :
                        candidate.etapa === EtapaProceso.PRUEBA ? 'Prueba Técnica' :
                        candidate.etapa === EtapaProceso.OFERTA ? 'Oferta' : 'Revisión CV'}
                    </div>
                    {candidate.phone && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        📞 {candidate.phone}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="pipeline-empty-state">
                <p>No hay candidatos rechazados</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Pipeline

