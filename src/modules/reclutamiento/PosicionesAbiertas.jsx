import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRRHH } from '../../store/RRHHContext'
import PosicionCard from './components/PosicionCard'
import Paginacion from './components/Paginacion'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import ErrorMessage from '../../components/common/ErrorMessage'
import { EstadoVacante } from '../../types'

const PosicionesAbiertas = () => {
  const navigate = useNavigate()
  const { 
    positionsData, 
    loading, 
    error, 
    loadPositions, 
    setError 
  } = useRRHH()

  const [currentPage, setCurrentPage] = useState(1)
  const [filtroEstado, setFiltroEstado] = useState('TODAS')
  const itemsPerPage = 10

  const handleAgregarPuesto = () => {
    navigate('/puesto/nuevo')
  }

  // Filtrar posiciones por estado
  const posicionesFiltradas = positionsData.filter(position => {
    if (filtroEstado === 'TODAS') return true
    if (filtroEstado === 'ABIERTA') return position.estado === EstadoVacante.ABIERTA || position.estado === 'ABIERTA'
    if (filtroEstado === 'CERRADA') return position.estado === EstadoVacante.CERRADA || position.estado === 'CERRADA'
    if (filtroEstado === 'PAUSADA') return position.estado === EstadoVacante.PAUSADA || position.estado === 'PAUSADA'
    return true
  })

  // Calcular paginación
  const start = (currentPage - 1) * itemsPerPage
  const end = start + itemsPerPage
  const pagePositions = posicionesFiltradas.slice(start, end)
  const totalPages = Math.ceil(posicionesFiltradas.length / itemsPerPage)

  // Resetear a página 1 cuando cambian los datos o el filtro
  React.useEffect(() => {
    setCurrentPage(1)
  }, [positionsData.length, filtroEstado])

  if (loading.positions) {
    return (
      <div className="view-container active">
        <div className="view-header">
          <h1>Posiciones Abiertas</h1>
        </div>
        <LoadingSpinner message="Cargando posiciones..." />
      </div>
    )
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Posiciones Abiertas</h1>
        <button className="btn-primary" onClick={handleAgregarPuesto}>
          + Agregar Vacante
        </button>
      </div>

      {error && (
        <ErrorMessage 
          message={error}
          onRetry={loadPositions}
          onDismiss={() => setError(null)}
        />
      )}

      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1rem',
        padding: '0 1rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <label style={{ fontWeight: '500', fontSize: '14px' }}>Filtrar por estado:</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="TODAS">Todas</option>
            <option value="ABIERTA">Abiertas</option>
            <option value="PAUSADA">Pausadas</option>
            <option value="CERRADA">Cerradas</option>
          </select>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          Mostrando {posicionesFiltradas.length} de {positionsData.length} vacantes
        </div>
      </div>

      <div id="posiciones-grid" className="posiciones-grid">
        {pagePositions.length > 0 ? (
          pagePositions.map(position => (
            <PosicionCard key={position.id} position={position} />
          ))
        ) : (
          <div style={{ 
            gridColumn: '1 / -1', 
            padding: '2rem', 
            textAlign: 'center', 
            color: 'var(--color-text-secondary)' 
          }}>
            No hay oportunidades de trabajo disponibles. Crea una nueva oportunidad para comenzar.
          </div>
        )}
      </div>

      {posicionesFiltradas.length > itemsPerPage && (
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

export default PosicionesAbiertas

