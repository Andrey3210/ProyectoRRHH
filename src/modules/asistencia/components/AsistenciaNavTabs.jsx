// src/modules/asistencia/components/AsistenciaNavTabs.jsx
import { useNavigate, useLocation } from "react-router-dom";

export default function AsistenciaNavTabs() {
  const navigate = useNavigate();
  const location = useLocation();

  const current = location.pathname;

  const go = (path) => {
    if (current !== path) navigate(path);
  };

  return (
    <div className="asistencia-nav-tabs">
      <button
        type="button"
        className={current.includes("control-asistenciaReporte") ? "tab-btn" : "tab-btn tab-ghost"}
        onClick={() => go("/control-asistenciaReporte")}
      >
        Reportes
      </button>
      <button
        type="button"
        className={current.includes("control-asistenciaLineaTiempo") ? "tab-btn" : "tab-btn tab-ghost"}
        onClick={() => go("/control-asistenciaLineaTiempo")}
      >
        Línea de tiempo
      </button>
      <button
        type="button"
        className={current.endsWith("/control-asistencia") ? "tab-btn" : "tab-btn tab-ghost"}
        onClick={() => go("/control-asistencia")}
      >
        Mi asistencia
      </button>
    </div>
  );
}
