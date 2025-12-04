// src/modules/asistencia/components/CorreccionesTable.jsx
export default function CorreccionesTable({ registros }) {
  return (
    <div className="audit-table-card">
      <h2 className="audit-subtitle">Correcciones de asistencia</h2>
      <table className="audit-table">
        <thead>
          <tr>
            <th>Fecha corrección</th>
            <th>Empleado</th>
            <th>Fecha asistencia</th>
            <th>Tipo</th>
            <th>Hora anterior</th>
            <th>Hora corregida</th>
            <th>Motivo</th>
            <th>Corregida por</th>
          </tr>
        </thead>
        <tbody>
          {registros.length === 0 ? (
            <tr>
              <td colSpan={8} style={{ textAlign: "center" }}>
                No hay correcciones en el rango seleccionado.
              </td>
            </tr>
          ) : (
            registros.map((r) => (
              <tr key={r.id}>
                <td>{r.fechaCorreccion}</td>
                <td>{r.nombreEmpleado}</td>
                <td>{r.fecha}</td>
                <td>{r.tipoCorreccion}</td>
                <td>{r.horaAnterior}</td>
                <td>{r.horaCorregida}</td>
                <td>{r.motivo}</td>
                <td>{r.corregidaPor}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
