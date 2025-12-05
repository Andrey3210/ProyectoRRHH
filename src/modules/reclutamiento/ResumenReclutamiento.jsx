import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import ErrorMessage from '../../components/common/ErrorMessage'
import LoadingSpinner from '../../components/common/LoadingSpinner'
import { useRRHH } from '../../store/RRHHContext'

const StatCard = ({ label, value, accent, onClick }) => (
  <div className="resumen-card" style={{ borderColor: accent || 'var(--color-primary)' }}>
    <div className="resumen-card-header">
      <p>{label}</p>
      {onClick && (
        <button className="btn-link" onClick={onClick}>
          Ver detalle
        </button>
      )}
    </div>
    <h2>{value}</h2>
  </div>
)

const ResumenReclutamiento = () => {
  const navigate = useNavigate()
  const {
    candidatesData,
    positionsData,
    pipelineStages,
    loading,
    error,
    loadCandidates,
    loadPositions,
    setError
  } = useRRHH()

  useEffect(() => {
    loadCandidates()
    loadPositions()
  }, [loadCandidates, loadPositions])

  const pipelineResumen = useMemo(() => {
    const base = pipelineStages.reduce((acc, stage) => {
      acc[stage] = 0
      return acc
    }, {})

    candidatesData.forEach(candidate => {
      if (base[candidate.status] !== undefined) {
        base[candidate.status] += 1
      }
    })

    return base
  }, [candidatesData, pipelineStages])

  const posicionesCriticas = useMemo(() => {
    return positionsData
      .slice()
      .sort((a, b) => (b.candidates || 0) - (a.candidates || 0))
      .slice(0, 4)
  }, [positionsData])

  if (loading.candidates || loading.positions) {
    return (
      <div className="view-container active">
        <div className="view-header">
          <h1>Resumen de Reclutamiento</h1>
        </div>
        <LoadingSpinner message="Cargando datos de reclutamiento..." />
      </div>
    )
  }

  return (
    <div className="view-container active">
      <div className="view-header">
        <h1>Resumen de Reclutamiento</h1>
        <div className="view-actions">
          <button className="btn-secondary" onClick={() => navigate('/posiciones')}>
            Posiciones abiertas
          </button>
          <button className="btn-secondary" onClick={() => navigate('/candidatos')}>
            Lista de candidatos
          </button>
          <button className="btn-primary" onClick={() => navigate('/pipeline')}>
            Ir al pipeline
          </button>
        </div>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={() => {
            loadCandidates()
            loadPositions()
          }}
          onDismiss={() => setError(null)}
        />
      )}

      <div className="resumen-grid">
        <StatCard
          label="Candidatos activos"
          value={candidatesData.length}
          accent="var(--color-primary)"
          onClick={() => navigate('/candidatos')}
        />
        <StatCard
          label="Posiciones publicadas"
          value={positionsData.length}
          accent="var(--color-warning)"
          onClick={() => navigate('/posiciones')}
        />
        <StatCard
          label="Candidatos en proceso"
          value={candidatesData.filter(c => c.status !== 'Rechazado').length}
          accent="var(--color-success)"
          onClick={() => navigate('/pipeline')}
        />
        <StatCard
          label="Candidatos descartados"
          value={candidatesData.filter(c => c.status === 'Rechazado').length}
          accent="var(--color-danger)"
          onClick={() => navigate('/candidatos')}
        />
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Estado del pipeline</h3>
        </div>
        <div className="pipeline-resumen-grid">
          {pipelineStages.map(stage => (
            <div key={stage} className="pipeline-resumen-card">
              <p>{stage}</p>
              <strong>{pipelineResumen[stage] || 0}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Posiciones con más candidatos</h3>
          <button className="btn-link" onClick={() => navigate('/posiciones')}>
            Ver todas
          </button>
        </div>
        {posicionesCriticas.length === 0 ? (
          <p style={{ padding: '1rem', color: 'var(--color-text-secondary)' }}>
            Aún no hay posiciones registradas.
          </p>
        ) : (
          <div className="posiciones-grid">
            {posicionesCriticas.map(posicion => (
              <div key={posicion.id} className="posicion-card">
                <div className="posicion-card-header">
                  <h4>{posicion.name}</h4>
                  <span className={`chip ${posicion.priority?.toLowerCase() || ''}`}>
                    {posicion.priority || 'Media'}
                  </span>
                </div>
                <p className="posicion-meta">{posicion.department}</p>
                <p className="posicion-meta">{posicion.tipoContrato} · {posicion.modalidad}</p>
                <div className="posicion-stats">
                  <span>{posicion.candidates} candidatos</span>
                  <span>{posicion.interviews} entrevistas</span>
                </div>
                <div className="posicion-actions">
                  <button
                    className="btn-link"
                    onClick={() => navigate(`/puesto/editar/${posicion.id}`)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn-secondary"
                    onClick={() => navigate('/pipeline', { state: { puesto: posicion.name } })}
                  >
                    Ver pipeline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ResumenReclutamiento
