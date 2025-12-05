import React from 'react'
import { EtapaProceso } from '../../../types'

const CandidatosTable = ({ candidates, onViewDetail }) => {
  const getStatusClass = (status, etapa) => {
    // Si tiene etapa, usar esa para el estilo
    const estadoParaEstilo = etapa || status
    return 'estado-' + estadoParaEstilo.toLowerCase().replace(/ /g, '-').replace(/_/g, '-')
  }

  const getEtapaLabel = (candidate) => {
    // Priorizar etapa sobre status
    if (candidate.etapa) {
      const etapasLabels = {
        [EtapaProceso.REVISION_CV]: 'Revisión CV',
        [EtapaProceso.ENTREVISTA]: 'Entrevista',
        [EtapaProceso.PRUEBA]: 'Prueba Técnica',
        [EtapaProceso.OFERTA]: 'Oferta',
        [EtapaProceso.CONTRATACION]: 'Contratación'
      }
      return etapasLabels[candidate.etapa] || candidate.etapa
    }
    return candidate.status || 'Sin estado'
  }

  const getEtapaColor = (candidate) => {
    const etapa = candidate.etapa || candidate.status
    const colores = {
      [EtapaProceso.REVISION_CV]: '#6c757d',
      [EtapaProceso.ENTREVISTA]: '#3C83F6',
      [EtapaProceso.PRUEBA]: '#ffc107',
      [EtapaProceso.OFERTA]: '#28a745',
      [EtapaProceso.CONTRATACION]: '#20c997',
      'Rechazado': '#dc3545',
      'DESCARTADO': '#dc3545'
    }
    return colores[etapa] || '#6c757d'
  }

  return (
    <div className="table-responsive">
      <table id="candidates-table" className="candidates-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Vacante</th>
            <th>Etapa</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody id="candidates-tbody">
          {candidates.map(candidate => {
            const etapaLabel = getEtapaLabel(candidate)
            const etapaColor = getEtapaColor(candidate)
            
            return (
              <tr key={candidate.id}>
                <td>{candidate.name}</td>
                <td>{candidate.email}</td>
                <td>{candidate.phone || 'N/A'}</td>
                <td>{candidate.position || 'No especificado'}</td>
                <td>
                  <span 
                    className={`estado-badge ${getStatusClass(candidate.status, candidate.etapa)}`}
                    style={{ 
                      backgroundColor: etapaColor,
                      color: 'white',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '12px',
                      fontWeight: '500'
                    }}
                  >
                    {etapaLabel}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn-secondary" 
                    onClick={() => onViewDetail(candidate.id)}
                  >
                    Ver Detalle
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default CandidatosTable

