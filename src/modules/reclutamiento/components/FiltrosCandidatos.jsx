import React, { useState, useEffect } from 'react'
import vacanteService from '../../../services/api/vacanteService'
import { EtapaProceso } from '../../../types'

const FiltrosCandidatos = ({ search, estado, puesto, onSearchChange, onEstadoChange, onPuestoChange }) => {
  const [vacantes, setVacantes] = useState([])

  useEffect(() => {
    const cargarVacantes = async () => {
      try {
        const data = await vacanteService.obtenerVacantes({ estado: 'ABIERTA' })
        setVacantes(data)
      } catch (err) {
        console.error('Error al cargar vacantes para filtro:', err)
      }
    }
    cargarVacantes()
  }, [])

  // Etapas del proceso según el backend
  const etapasDisponibles = [
    { value: '', label: 'Todas las etapas' },
    { value: EtapaProceso.REVISION_CV, label: 'Revisión CV' },
    { value: EtapaProceso.ENTREVISTA, label: 'Entrevista' },
    { value: EtapaProceso.PRUEBA, label: 'Prueba Técnica' },
    { value: EtapaProceso.OFERTA, label: 'Oferta' },
    { value: EtapaProceso.CONTRATACION, label: 'Contratación' }
  ]

  return (
    <div className="filters-section" style={{ 
      display: 'flex', 
      gap: '1rem', 
      flexWrap: 'wrap', 
      alignItems: 'center',
      padding: '1rem',
      background: '#f8f9fa',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <div className="search-box" style={{ flex: '1', minWidth: '250px' }}>
        <span className="search-icon" style={{ marginRight: '8px' }}>🔍</span>
        <input
          type="text"
          id="search-candidates"
          placeholder="Buscar por nombre, email o vacante..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>
      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontWeight: '500', fontSize: '14px' }}>Etapa:</label>
        <select 
          id="filter-estado" 
          value={estado} 
          onChange={(e) => onEstadoChange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '150px'
          }}
        >
          {etapasDisponibles.map(etapa => (
            <option key={etapa.value} value={etapa.value}>
              {etapa.label}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <label style={{ fontWeight: '500', fontSize: '14px' }}>Vacante:</label>
        <select 
          id="filter-puesto" 
          value={puesto} 
          onChange={(e) => onPuestoChange(e.target.value)}
          style={{
            padding: '8px 12px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            minWidth: '200px'
          }}
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
  )
}

export default FiltrosCandidatos

