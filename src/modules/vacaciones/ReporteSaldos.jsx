import React, { useState, useEffect } from 'react';
import vacacionesService from '../../services/api/vacacionesService';
import './GestionVacaciones.css';

const ReporteSaldos = () => {
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- NUEVO ESTADO PARA EL FILTRO ---
  const [filtroArea, setFiltroArea] = useState('');

  useEffect(() => {
    cargarReporte();
  }, []);

  const cargarReporte = async () => {
    try {
      const data = await vacacionesService.obtenerReporteSaldos();
      setReporte(data || []);
    } catch (error) {
      console.error("Error cargando reporte", error);
    } finally {
      setLoading(false);
    }
  };

  // 1. OBTENER LISTA DE ÁREAS (DEPARTAMENTOS) ÚNICAS PARA EL SELECT
  // Usamos un Set para eliminar duplicados
  const areasDisponibles = [...new Set(reporte.map(item => item.departamento || 'General'))].sort();

  // 2. APLICAR FILTRO
  const reporteFiltrado = reporte.filter(item => {
    if (!filtroArea) return true; // Si no hay filtro, mostrar todo
    return (item.departamento || 'General') === filtroArea;
  });

  // 3. AGRUPAR (Usamos la lista ya filtrada)
  const reporteAgrupado = reporteFiltrado.reduce((acc, item) => {
    const grupo = item.departamento || 'General';
    if (!acc[grupo]) acc[grupo] = [];
    acc[grupo].push(item);
    return acc;
  }, {});

  const departamentosAVisualizar = Object.keys(reporteAgrupado).sort();

  if (loading) return <div className="text-center p-4">Calculando saldos...</div>;
  
  return (
    <div className="reporte-container">
      
      {/* --- BARRA DE FILTRO --- */}
      <div className="filter-bar mb-4" style={{display: 'flex', alignItems: 'center', gap: '15px', padding: '30px 0px'}}>
        <label style={{fontWeight: '600', color: '#374151'}}>Filtrar por Área:</label>
        <select 
          value={filtroArea} 
          onChange={(e) => setFiltroArea(e.target.value)}
          className="form-select-underline"
          style={{maxWidth: '250px', padding: '8px', borderRadius: '6px', border: '1px solid #d1d5db'}}
        >
          <option value="">Todas las áreas</option>
          {areasDisponibles.map(area => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>
      </div>

      {reporte.length === 0 ? (
        <div className="text-center p-4">No hay datos de saldos disponibles.</div>
      ) : (
        /* --- RENDERIZADO DE SECCIONES --- */
        departamentosAVisualizar.map((depto) => (
          <div key={depto} className="area-section">
            
            <h3 className="area-title">
              <span className="area-indicator"></span>
              {depto}
              <span className="area-count">({reporteAgrupado[depto].length} empleados)</span>
            </h3>

            <div className="table-card mb-4">
              <table className="vacaciones-table">
                <thead>
                  <tr>
                    <th style={{width: '30%'}}>Empleado</th>
                    <th style={{width: '20%'}}>Sub-Área</th>
                    <th className="text-center">Días Totales</th>
                    <th className="text-center">Días Gozados</th>
                    <th className="text-center">Días Pendientes</th>
                    <th className="text-center">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {reporteAgrupado[depto].map((item, index) => (
                    <tr key={index}>
                      <td><div style={{fontWeight: '500'}}>{item.nombreCompleto}</div></td>
                      <td className="text-muted small">{item.area || '-'}</td>
                      <td className="text-center">{item.diasTotales}</td>
                      <td className="text-center">{item.diasGozados}</td>
                      
                      <td className="text-center">
                        <span style={{
                          fontWeight: 'bold', 
                          color: item.diasPendientes < 0 ? '#dc2626' : (item.diasPendientes > 5 ? '#166534' : '#d97706')
                        }}>
                          {item.diasPendientes < 0 
                            ? `${Math.abs(item.diasPendientes)} (Deuda)` 
                            : item.diasPendientes}
                        </span>
                      </td>

                      <td className="text-center">
                        {item.diasPendientes > 0 ? (
                          <span className="status-badge status-aprobada">Disponible</span>
                        ) : item.diasPendientes === 0 ? (
                          <span className="status-badge status-rechazada" style={{backgroundColor: '#e5e7eb', color: '#374151'}}>Agotado</span>
                        ) : (
                          <span className="status-badge status-rechazada" style={{backgroundColor: '#fee2e2', color: '#991b1b'}}>
                            Excedido
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ReporteSaldos;