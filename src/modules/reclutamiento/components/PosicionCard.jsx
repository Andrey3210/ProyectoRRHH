import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRRHH } from '../../../store/RRHHContext'
import reclutamientoService from '../../../services/api/reclutamientoService'
import vacanteService from '../../../services/api/vacanteService'
import { useNotification } from '../../../components/common/NotificationProvider'

const PosicionCard = ({ position }) => {
  const navigate = useNavigate()
  const { success, error: showError } = useNotification()
  const { loadPositions } = useRRHH()
  const [candidatosCount, setCandidatosCount] = useState(position.candidates || 0)
  const [estadoVacante, setEstadoVacante] = useState(position.estado || 'PAUSADA')
  const [loading, setLoading] = useState(false)
  const priorityClass = 'priority-' + position.priority.toLowerCase().replace(/ /g, '-')

  useEffect(() => {
    // Cargar el conteo real de candidatos vinculados a esta vacante y el estado
    const cargarDatos = async () => {
      try {
        const [candidatos, vacante] = await Promise.all([
          reclutamientoService.obtenerCandidatosPorVacante(position.id),
          vacanteService.obtenerVacantePorId(position.id)
        ])
        setCandidatosCount(candidatos.length)
        setEstadoVacante(vacante.estado || 'PAUSADA')
      } catch (err) {
        console.error('Error al cargar datos:', err)
      }
    }
    
    if (position.id) {
      cargarDatos()
    }
  }, [position.id])

  const handleVerCandidatos = () => {
    navigate('/candidatos', {
      state: {
        idVacante: position.id,
        nombreVacante: position.name
      }
    })
  }

  const handlePublicar = async () => {
    if (loading) return
    
    try {
      setLoading(true)
      await vacanteService.publicarVacante(position.id)
      success('Vacante publicada exitosamente. Ahora se pueden recibir postulaciones.')
      setEstadoVacante('ABIERTA')
      if (loadPositions) {
        await loadPositions()
      }
    } catch (err) {
      showError(err.message || 'Error al publicar la vacante. Verifica que tenga requisitos definidos.')
    } finally {
      setLoading(false)
    }
  }

  const handleCerrar = async () => {
    if (loading) return
    
    if (!window.confirm('¿Está seguro de cerrar esta vacante? No se podrán recibir más postulaciones.')) {
      return
    }
    
    try {
      setLoading(true)
      await vacanteService.cerrarVacante(position.id)
      success('Vacante cerrada exitosamente.')
      setEstadoVacante('CERRADA')
      if (loadPositions) {
        await loadPositions()
      }
    } catch (err) {
      showError(err.message || 'Error al cerrar la vacante.')
    } finally {
      setLoading(false)
    }
  }

  const getEstadoBadge = () => {
    const estados = {
      'ABIERTA': { label: 'Publicada', color: '#28a745', bg: '#d4edda' },
      'PAUSADA': { label: 'Pausada', color: '#ffc107', bg: '#fff3cd' },
      'CERRADA': { label: 'Cerrada', color: '#6c757d', bg: '#e2e3e5' }
    }
    const estado = estados[estadoVacante] || estados['PAUSADA']
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 'bold',
        color: estado.color,
        backgroundColor: estado.bg,
        display: 'inline-block',
        marginBottom: '8px'
      }}>
        {estado.label}
      </span>
    )
  }

  return (
    <div className="posicion-card">
      <h3>{position.name}</h3>
      <div className="department">{position.department}</div>
      {getEstadoBadge()}
      <div className="description">{position.description}</div>
      <div className={`priority-badge ${priorityClass}`}>{position.priority}</div>
      <div className="posicion-stats">
        <div className="stat-item">
          <div className="stat-number">{candidatosCount}</div>
          <div className="stat-label">Candidatos</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{position.selected}</div>
          <div className="stat-label">Seleccionados</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">{position.interviews}</div>
          <div className="stat-label">Entrevistas</div>
        </div>
      </div>
      <div style={{ display: 'flex', gap: '8px', flexDirection: 'column' }}>
        <button className="btn-primary" onClick={handleVerCandidatos}>
          Ver Candidatos
        </button>
        {estadoVacante === 'PAUSADA' && (
          <button 
            className="btn-success" 
            onClick={handlePublicar}
            disabled={loading}
            style={{ fontSize: '14px', padding: '8px' }}
          >
            {loading ? 'Publicando...' : '📢 Publicar Vacante'}
          </button>
        )}
        {estadoVacante === 'ABIERTA' && (
          <button 
            className="btn-secondary" 
            onClick={handleCerrar}
            disabled={loading}
            style={{ fontSize: '14px', padding: '8px' }}
          >
            {loading ? 'Cerrando...' : '🔒 Cerrar Vacante'}
          </button>
        )}
      </div>
    </div>
  )
}

export default PosicionCard

