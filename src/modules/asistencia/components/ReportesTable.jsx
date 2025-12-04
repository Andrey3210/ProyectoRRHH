// src/modules/asistencia/components/ReportesTable.jsx

function TablaResumenPorEmpleado({ filas }) {
  return (
    <table className="reportes-table">
      <thead>
        <tr>
          <th>Empleado</th>
          <th>Área</th>
          <th>Días trabajados</th>
          <th>Faltas</th>
          <th>Tardanzas</th>
          <th>Horas extra</th>
        </tr>
      </thead>
      <tbody>
        {filas.map(f => (
          <tr key={f.id}>
            <td>{f.empleado}</td>
            <td>{f.area}</td>
            <td>{f.diasTrabajados}</td>
            <td>{f.faltas}</td>
            <td>{f.tardanzas}</td>
            <td>{f.horasExtra}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Para más adelante, cuando tengas detalle diario
function TablaDetallePorDia({ filas }) {
  return (
    <table className="reportes-table">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Empleado</th>
          <th>Área</th>
          <th>Estado</th>
          <th>Entrada</th>
          <th>Salida</th>
          <th>Horas trabajadas</th>
        </tr>
      </thead>
      <tbody>
        {filas.map(f => (
          <tr key={f.id}>
            <td>{f.fecha}</td>
            <td>{f.empleado}</td>
            <td>{f.area}</td>
            <td>{f.estado}</td>
            <td>{f.horaEntrada}</td>
            <td>{f.horaSalida}</td>
            <td>{f.horasTrabajadas}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ReportesTable({ tipoReporte, filas }) {
  const content = tipoReporte === "DetallePorDia"
    ? <TablaDetallePorDia filas={filas} />
    : <TablaResumenPorEmpleado filas={filas} />;

  return (
    <div className="reportes-table-wrapper">
      {content}
    </div>
  );
}

