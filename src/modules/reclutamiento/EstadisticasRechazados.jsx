import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import reclutamientoService from '../../services/api/reclutamientoService'
import candidatoService from '../../services/api/candidatoService'
import vacanteService from '../../services/api/vacanteService'
import { useNotification } from '../../components/common/NotificationProvider'
import { EtapaProceso, EstadoPostulante } from '../../types'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import Paginacion from './components/Paginacion'
import './GestionEntrevistas.css'

const EstadisticasRechazados = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useNotification()
  
  const [rechazados, setRechazados] = useState([])
  const [vacantes, setVacantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroVacante, setFiltroVacante] = useState('')
  const [filtroEtapa, setFiltroEtapa] = useState('TODAS')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Estadísticas por etapa
  const [estadisticasPorEtapa, setEstadisticasPorEtapa] = useState({})

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
      
      // Obtener candidatos rechazados de todas las vacantes
      const rechazadosData = []
      const estadisticas = {
        [EtapaProceso.REVISION_CV]: 0,
        [EtapaProceso.ENTREVISTA]: 0,
        [EtapaProceso.PRUEBA]: 0,
        [EtapaProceso.OFERTA]: 0,
        [EtapaProceso.CONTRATACION]: 0
      }

      for (const vacante of vacantesData) {
        try {
          const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
          procesos.forEach(pp => {
            if (pp.estado === EstadoPostulante.DESCARTADO || pp.estado === 'DESCARTADO') {
              const candidato = candidatosData.find(c => c.idPostulante === pp.idPostulante)
              if (candidato) {
                const etapa = pp.etapaActual || EtapaProceso.REVISION_CV
                estadisticas[etapa] = (estadisticas[etapa] || 0) + 1

                rechazadosData.push({
                  idPostulante: pp.idPostulante,
                  nombreCompleto: candidato.nombreCompleto || `${candidato.nombres} ${candidato.apellidoPaterno}`,
                  email: candidato.email,
                  telefono: candidato.telefono,
                  idVacante: vacante.idVacante,
                  nombreVacante: vacante.nombre,
                  etapaRechazo: etapa,
                  fechaRechazo: pp.fechaUltimaActualizacion || new Date().toISOString()
                })
              }
            }
          })
        } catch (err) {
          console.warn(`Error al obtener rechazados de vacante ${vacante.idVacante}:`, err)
        }
      }
      
      setRechazados(rechazadosData)
      setEstadisticasPorEtapa(estadisticas)
      setVacantes(vacantesData || [])
    } catch (err) {
      console.error('Error al cargar datos:', err)
      showError('Error al cargar las estadísticas de rechazados')
    } finally {
      setLoading(false)
    }
  }

  const getEtapaLabel = (etapa) => {
    const labels = {
      [EtapaProceso.REVISION_CV]: 'Revisión CV',
      [EtapaProceso.ENTREVISTA]: 'Entrevista',
      [EtapaProceso.PRUEBA]: 'Prueba Técnica',
      [EtapaProceso.OFERTA]: 'Oferta',
      [EtapaProceso.CONTRATACION]: 'Contratación'
    }
    return labels[etapa] || etapa
  }

  const getEtapaColor = (etapa) => {
    const colors = {
      [EtapaProceso.REVISION_CV]: '#6c757d',
      [EtapaProceso.ENTREVISTA]: '#3C83F6',
      [EtapaProceso.PRUEBA]: '#ffc107',
      [EtapaProceso.OFERTA]: '#28a745',
      [EtapaProceso.CONTRATACION]: '#20c997'
    }
    return colors[etapa] || '#6c757d'
  }

  const rechazadosFiltrados = rechazados.filter(r => {
    const vacanteMatch = !filtroVacante || r.nombreVacante === filtroVacante
    const etapaMatch = filtroEtapa === 'TODAS' || r.etapaRechazo === filtroEtapa
    return vacanteMatch && etapaMatch
  })

  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pageRechazados = rechazadosFiltrados.slice(start, end)
  const totalPages = Math.ceil(rechazadosFiltrados.length / itemsPerPage)

  useEffect(() => {
    setCurrentPage(1)
  }, [filtroVacante, filtroEtapa])

  if (loading) {
    return <LoadingSpinner message="Cargando estadísticas de rechazados..." />
  }

  const totalRechazados = rechazados.length

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Estadísticas de Candidatos Rechazados</h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Análisis de candidatos rechazados y la fase del proceso en la que fueron descartados
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '2rem' 
      }}>
        <div style={{ 
          background: 'white', 
          padding: '1.5rem', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          borderLeft: '4px solid #dc3545'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#dc3545' }}>
            {totalRechazados}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>Total Rechazados</div>
        </div>
        
        {Object.entries(estadisticasPorEtapa).map(([etapa, count]) => (
          count > 0 && (
            <div key={etapa} style={{ 
              background: 'white', 
              padding: '1.5rem', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              borderLeft: `4px solid ${getEtapaColor(etapa)}`
            }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getEtapaColor(etapa) }}>
                {count}
              </div>
              <div style={{ color: '#666', fontSize: '14px' }}>{getEtapaLabel(etapa)}</div>
              <div style={{ color: '#999', fontSize: '12px', marginTop: '4px' }}>
                {totalRechazados > 0 ? ((count / totalRechazados) * 100).toFixed(1) : 0}%
              </div>
            </div>
          )
        ))}
      </div>

      <div className="filtros-entrevistas" style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <select value={filtroVacante} onChange={(e) => setFiltroVacante(e.target.value)}>
          <option value="">Todas las vacantes</option>
          {vacantes.map(v => (
            <option key={v.idVacante} value={v.nombre}>
              {v.nombre}
            </option>
          ))}
        </select>
        <select value={filtroEtapa} onChange={(e) => setFiltroEtapa(e.target.value)}>
          <option value="TODAS">Todas las etapas</option>
          <option value={EtapaProceso.REVISION_CV}>Revisión CV</option>
          <option value={EtapaProceso.ENTREVISTA}>Entrevista</option>
          <option value={EtapaProceso.PRUEBA}>Prueba Técnica</option>
          <option value={EtapaProceso.OFERTA}>Oferta</option>
          <option value={EtapaProceso.CONTRATACION}>Contratación</option>
        </select>
      </div>

      <div className="entrevistas-grid">
        {pageRechazados.length === 0 ? (
          <div className="empty-state">
            <p>No hay candidatos rechazados con los filtros aplicados</p>
          </div>
        ) : (
          pageRechazados.map(rechazado => (
            <div key={rechazado.idPostulante} className="entrevista-card">
              <div className="entrevista-header">
                <h3>{rechazado.nombreCompleto}</h3>
                <span 
                  className="estado-badge" 
                  style={{ 
                    backgroundColor: getEtapaColor(rechazado.etapaRechazo),
                    color: 'white',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                >
                  {getEtapaLabel(rechazado.etapaRechazo)}
                </span>
              </div>
              <div className="entrevista-info">
                <p><strong>Email:</strong> {rechazado.email || '-'}</p>
                <p><strong>Teléfono:</strong> {rechazado.telefono || '-'}</p>
                <p><strong>Vacante:</strong> {rechazado.nombreVacante || '-'}</p>
                <p style={{ 
                  color: '#dc3545', 
                  fontWeight: 'bold', 
                  marginTop: '12px',
                  padding: '8px',
                  background: '#ffe6e6',
                  borderRadius: '4px'
                }}>
                  ❌ Rechazado en: {getEtapaLabel(rechazado.etapaRechazo)}
                </p>
                {rechazado.fechaRechazo && (
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    Fecha: {new Date(rechazado.fechaRechazo).toLocaleDateString('es-ES')}
                  </p>
                )}
              </div>
              <div className="entrevista-actions">
                <button 
                  className="btn-secondary" 
                  onClick={() => navigate(`/candidatos/${rechazado.idPostulante}`)}
                >
                  Ver Detalle
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {rechazadosFiltrados.length > itemsPerPage && (
        <Paginacion
          currentPage={currentPage}
          totalPages={totalPages}
          onPrevPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
          onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
        />
      )}
    </div>
  )
}

export default EstadisticasRechazados

