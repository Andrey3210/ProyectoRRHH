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
        {filas.map((f) => (
          <tr key={f.empleadoId}>
            <td>{f.empleadoNombre}</td>
            <td>{f.areaNombre}</td>
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

function calcularHorasTrabajadas(horaEntrada, horaSalida) {
  if (!horaEntrada || !horaSalida) return 0;

  const [eh, em, es] = horaEntrada.split(":").map(Number);
  const [sh, sm, ss] = horaSalida.split(":").map(Number);

  const entradaSeg = eh * 3600 + em * 60 + (es || 0);
  const salidaSeg = sh * 3600 + sm * 60 + (ss || 0);
  const diffSeg = salidaSeg - entradaSeg;
  if (diffSeg <= 0) return 0;

  const horas = diffSeg / 3600;
  return Math.round(horas * 100) / 100; // 2 decimales
}

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
        {filas.map((f, idx) => (
          <tr key={idx}>
            <td>{f.fecha}</td>
            <td>{f.empleadoNombre}</td>
            <td>{f.areaNombre}</td>
            <td>{f.estado}</td>
            <td>{f.horaEntrada}</td>
            <td>{f.horaSalida}</td>
            <td>{calcularHorasTrabajadas(f.horaEntrada, f.horaSalida)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default function ReportesTable({ tipoReporte, filas }) {
  const content =
    tipoReporte === "DetallePorDia" ? (
      <TablaDetallePorDia filas={filas} />
    ) : (
      <TablaResumenPorEmpleado filas={filas} />
    );

  return <div className="reportes-table-wrapper">{content}</div>;
}
