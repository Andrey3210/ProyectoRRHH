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

const GestionContrataciones = () => {
  const navigate = useNavigate()
  const { success, error: showError } = useNotification()
  
  const [candidatos, setCandidatos] = useState([])
  const [vacantes, setVacantes] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtroVacante, setFiltroVacante] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

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
      
      // Obtener candidatos en etapa CONTRATACION
      const candidatosContratados = []
      for (const vacante of vacantesData) {
        try {
          const procesos = await reclutamientoService.obtenerCandidatosPorVacante(vacante.idVacante)
          procesos.forEach(pp => {
            if (pp.etapaActual === EtapaProceso.CONTRATACION || pp.etapaActual === 'CONTRATACION') {
              const candidato = candidatosData.find(c => c.idPostulante === pp.idPostulante)
              if (candidato) {
                candidatosContratados.push({
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
      
      setCandidatos(candidatosContratados)
      setVacantes(vacantesData || [])
    } catch (err) {
      console.error('Error al cargar datos:', err)
      showError('Error al cargar las contrataciones')
    } finally {
      setLoading(false)
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
    return <LoadingSpinner message="Cargando contrataciones..." />
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Gestión de Contrataciones</h1>
        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
          Candidatos que han sido contratados y deben integrarse con el módulo de Gestión de Empleados
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
            <p>No hay candidatos contratados</p>
          </div>
        ) : (
          pageCandidatos.map(candidato => (
            <div key={candidato.idPostulante} className="entrevista-card">
              <div className="entrevista-header">
                <h3>{candidato.nombreCompleto}</h3>
                <span className="estado-badge estado-realizada">Contratado</span>
              </div>
              <div className="entrevista-info">
                <p><strong>Email:</strong> {candidato.email || '-'}</p>
                <p><strong>Teléfono:</strong> {candidato.telefono || '-'}</p>
                <p><strong>Vacante:</strong> {candidato.nombreVacante || '-'}</p>
                <p style={{ color: '#28a745', fontWeight: 'bold', marginTop: '12px' }}>
                  ✓ Contratación cerrada - Listo para integrar con Gestión de Empleados
                </p>
              </div>
              <div className="entrevista-actions">
                <button 
                  className="btn-primary" 
                  onClick={() => navigate(`/candidatos/${candidato.idPostulante}`)}
                >
                  Ver Detalle
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
    </div>
  )
}

export default GestionContrataciones

