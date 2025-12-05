// src/modules/asistencia/components/AuditoriaTable.jsx
export default function AuditoriaTable({ registros }) {
  return (
    <div className="audit-table-card">
      <h2 className="audit-subtitle">Auditoría del sistema</h2>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Fecha acción</th>
            <th>Usuario</th>
            <th>Módulo</th>
            <th>Acción</th>
            <th>IP</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center" }}>
                No hay registros en el rango seleccionado.
              </td>
            </tr>
          ) : (
            registros.map((r) => (
              <tr key={r.id}>
                <td>{r.fechaAccion}</td>
                <td>{r.usuario}</td>
                <td>{r.modulo}</td>
                <td>{r.accion}</td>
                <td>{r.ipAddress}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
