import React, { useState, useEffect } from 'react';
import vacacionesService from '../../services/api/vacacionesService';
import './GestionVacaciones.css'; // Reutilizamos estilos

const ReporteSaldos = () => {
  const [reporte, setReporte] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    cargarReporte();
  }, []);

  return (
    <div className="reporte-container">
      <div className="table-card">
        <table className="vacaciones-table">
          <thead>
            <tr>
              <th>Empleado</th>
              <th>Área</th>
              <th className="text-center">Días Totales</th>
              <th className="text-center">Días Gozados</th>
              <th className="text-center">Días Pendientes</th>
              <th className="text-center">Estado</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="text-center p-4">Calculando saldos...</td></tr>
            ) : reporte.length === 0 ? (
              <tr><td colSpan="6" className="text-center p-4">No hay datos de saldos disponibles.</td></tr>
            ) : (
              reporte.map((item, index) => (
                <tr key={index}>
                  <td><div style={{fontWeight: '500'}}>{item.nombreCompleto}</div></td>
                  <td>{item.area || '-'}</td>
                  <td className="text-center">{item.diasTotales}</td>
                  <td className="text-center">{item.diasGozados}</td>
                  <td className="text-center">
                    <span style={{fontWeight: 'bold', color: item.diasPendientes > 5 ? '#166534' : '#b91c1c'}}>
                      {item.diasPendientes}
                    </span>
                  </td>
                  <td className="text-center">
                    {item.diasPendientes > 0 ? (
                      <span className="status-badge status-aprobada">Disponible</span>
                    ) : (
                      <span className="status-badge status-rechazada">Agotado</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReporteSaldos;