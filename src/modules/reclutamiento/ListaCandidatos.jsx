import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useRRHH } from '../../store/RRHHContext'
import reclutamientoService from '../../services/api/reclutamientoService'
import CandidatosTable from './components/CandidatosTable'
import FiltrosCandidatos from './components/FiltrosCandidatos'
import Paginacion from './components/Paginacion'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'

const ListaCandidatos = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { idVacante, nombreVacante } = location.state || {}
  
  const { 
    candidatesData, 
    currentPage, 
    itemsPerPage, 
    filteredCandidates,
    loading,
    error,
    setCurrentPage,
    setFilteredCandidates,
    loadCandidates,
    setError
  } = useRRHH()

  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState('')
  const [puesto, setPuesto] = useState('')
  const [candidatosVacante, setCandidatosVacante] = useState([])
  const [cargandoVacante, setCargandoVacante] = useState(false)

  // Cargar candidatos de la vacante específica si se proporcionó idVacante
  useEffect(() => {
    if (idVacante) {
      setCargandoVacante(true)
      const cargarCandidatosVacante = async () => {
        try {
          const candidatos = await reclutamientoService.obtenerCandidatosPorVacante(idVacante)
          // Mapear a formato compatible con el contexto
          const candidatosMapeados = candidatos.map(pp => {
            const postulante = pp.postulante || {}
            return {
              id: postulante.idPostulante || pp.idPostulante,
              name: postulante.nombres && postulante.apellidoPaterno
                ? `${postulante.nombres} ${postulante.apellidoPaterno} ${postulante.apellidoMaterno || ''}`.trim()
                : `Candidato ${pp.idPostulante}`,
              email: postulante.email || 'N/A',
              phone: postulante.telefono || 'N/A',
              position: nombreVacante || 'No especificado',
              status: pp.etapaActual || 'REVISION_CV',
              etapa: pp.etapaActual || 'REVISION_CV',
              estado: pp.estado
            }
          })
          setCandidatosVacante(candidatosMapeados)
          // Auto-filtrar por esta vacante
          setPuesto(nombreVacante || '')
        } catch (err) {
          console.error('Error al cargar candidatos de la vacante:', err)
          setCandidatosVacante([])
        } finally {
          setCargandoVacante(false)
        }
      }
      cargarCandidatosVacante()
      // Limpiar el state después de usarlo
      window.history.replaceState({}, document.title)
    }
  }, [idVacante, nombreVacante])

  // Si hay idVacante, usar candidatosVacante, sino usar candidatesData del contexto
  const datosAConsultar = idVacante ? candidatosVacante : candidatesData

  useEffect(() => {
    const filtered = datosAConsultar.filter(candidate => {
      const searchMatch = candidate.name.toLowerCase().includes(search.toLowerCase()) ||
                        candidate.email.toLowerCase().includes(search.toLowerCase()) ||
                        candidate.position.toLowerCase().includes(search.toLowerCase())
      
      // Filtrar por etapa (puede venir como etapa o status)
      const etapaCandidato = candidate.etapa || candidate.status
      const estadoMatch = !estado || etapaCandidato === estado || candidate.status === estado
      
      // Filtrar por vacante/puesto
      const puestoMatch = !puesto || candidate.position === puesto
      
      return searchMatch && estadoMatch && puestoMatch
    })

    setFilteredCandidates(filtered)
    setCurrentPage(1)
  }, [search, estado, puesto, datosAConsultar, setFilteredCandidates, setCurrentPage])

  const handleViewDetail = (candidateId) => {
    navigate(`/candidatos/${candidateId}`)
  }

  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pageCandidates = filteredCandidates.slice(start, end)
  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage)

  if (loading.candidates) {
    return (
      <div className="view-container active">
        <div className="view-header">
          <h1>Reclutamiento y selección de personal</h1>
        </div>
        <LoadingSpinner message="Cargando candidatos..." />
      </div>
    )
  }

  if (cargandoVacante) {
    return (
      <div className="view-container active">
        <div className="view-header">
          <h1>Reclutamiento y selección de personal</h1>
          {nombreVacante && (
            <p style={{ marginTop: '8px', color: '#666', fontSize: '14px' }}>
              Candidatos de: <strong>{nombreVacante}</strong>
            </p>
          )}
        </div>
        <LoadingSpinner message="Cargando candidatos de la vacante..." />
      </div>
    )
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div>
            <h1>Reclutamiento y selección de personal</h1>
            {nombreVacante && (
              <p style={{ marginTop: '8px', color: '#666', fontSize: '14px', marginBottom: 0 }}>
                Candidatos de: <strong>{nombreVacante}</strong>
                <button 
                  onClick={() => {
                    setPuesto('')
                    window.history.replaceState({}, document.title)
                    navigate('/candidatos', { replace: true })
                  }}
                  style={{
                    marginLeft: '12px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    background: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Ver todos los candidatos
                </button>
              </p>
            )}
          </div>
        </div>
      </div>

      {error && (
        <ErrorMessage 
          message={error}
          onRetry={loadCandidates}
          onDismiss={() => setError(null)}
        />
      )}

      <FiltrosCandidatos
        search={search}
        estado={estado}
        puesto={puesto}
        onSearchChange={setSearch}
        onEstadoChange={setEstado}
        onPuestoChange={setPuesto}
      />

      {pageCandidates.length > 0 ? (
        <>
          <CandidatosTable 
            candidates={pageCandidates}
            onViewDetail={handleViewDetail}
          />

          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevPage={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            onNextPage={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
          />
        </>
      ) : (
        <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
          No se encontraron candidatos con los filtros aplicados.
        </div>
      )}
    </div>
  )
}

export default ListaCandidatos

