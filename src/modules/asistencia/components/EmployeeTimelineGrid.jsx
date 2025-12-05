// src/modules/asistencia/components/EmployeeTimelineGrid.jsx

// convierte "08:30" en número de horas desde 0 a 24
const timeToFloat = (hhmm) => {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h + m / 60;
};

const getBarStyle = (inicio, fin, estado) => {
  const dayStart = 6;
  const dayEnd = 23; // 11 pm

  const startFloat = timeToFloat(inicio);
  const start = Math.max(startFloat ?? dayStart, dayStart);

  // hora actual en formato float
  const now = new Date();
  const nowFloat = now.getHours() + now.getMinutes() / 60;

  // si no hay fin, usar hora actual; si hay fin, usar fin
  let endFloat;
  if (fin) {
    endFloat = timeToFloat(fin);
  } else {
    endFloat = nowFloat;
  }

  // acotar al rango y evitar width negativa
  let end = Math.min(Math.max(endFloat, start), dayEnd);

  const totalRange = dayEnd - dayStart;
  const leftPercent = ((start - dayStart) / totalRange) * 100;
  const widthPercent = ((end - start) / totalRange) * 100;

  let bg = "#3b82f6"; // azul por defecto
  if (estado === "Puntual") bg = "#22c55e";
  if (estado === "Tarde") bg = "#f97316";
  if (estado === "Falta") bg = "#ef4444";

  return {
    left: `${leftPercent}%`,
    width: `${widthPercent}%`,
    backgroundColor: bg
  };
};


export default function EmployeeTimelineGrid({ hours, employees, onBarClick }) {
  return (
    <div className="et-grid-wrapper">
      <div className="et-grid-header">
        <div className="et-col-name">Nombre</div>
        <div className="et-col-hours">
          {hours.map(h => (
            <div key={h} className="et-hour-cell">
              {h}
            </div>
          ))}
        </div>
      </div>

      <div className="et-grid-body">
        {employees.map(emp => (
          <div key={emp.id} className="et-row">
            <div className="et-cell-name">
              {emp.nombre}
            </div>
            <div className="et-row-timeline">
              <div className="et-grid-lines">
                {hours.map(h => (
                  <div key={h} className="et-grid-line" />
                ))}
              </div>

              {emp.tramos.map(tramo => (
                <button
                  key={tramo.id}
                  className="et-bar"
                  style={getBarStyle(tramo.inicio, tramo.fin, tramo.estado)}
                  onClick={() => onBarClick(emp.id, tramo.id)}
                  title={`${tramo.estado} (${tramo.inicio}${tramo.fin ? " - " + tramo.fin : ""})`}
                >
                  <span className="et-bar-label">
                    {tramo.estado}
                    {tramo.inicio && ` (${tramo.inicio}`}
                    {tramo.fin && ` - ${tramo.fin})`}
                    {!tramo.fin && tramo.inicio && ")"}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
