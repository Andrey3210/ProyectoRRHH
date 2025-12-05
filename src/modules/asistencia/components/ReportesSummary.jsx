// src/modules/asistencia/components/ReportesSummary.jsx

export default function ReportesSummary({ summary }) {
  return (
    <div className="reportes-summary">
      <div className="rep-kpi-card">
        <span className="rep-kpi-label">Días trabajados</span>
        <span className="rep-kpi-value">{summary.diasTrabajados}</span>
      </div>
      <div className="rep-kpi-card">
        <span className="rep-kpi-label">Faltas</span>
        <span className="rep-kpi-value rep-kpi-danger">{summary.faltas}</span>
      </div>
      <div className="rep-kpi-card">
        <span className="rep-kpi-label">Tardanzas</span>
        <span className="rep-kpi-value rep-kpi-warning">
          {summary.tardanzas}
        </span>
      </div>
      <div className="rep-kpi-card">
        <span className="rep-kpi-label">Horas extra</span>
        <span className="rep-kpi-value">{summary.horasExtra}</span>
      </div>
    </div>
  );
}
