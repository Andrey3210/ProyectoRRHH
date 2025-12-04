import { useEffect, useState } from "react";
import MonthlySummaryPie from "./components/MonthlySummaryPie.jsx";
import AsistenciaTable from "./components/AsistenciaTable.jsx";
import CheckInCard from "./components/CheckInCard.jsx";
import "./AsistenciaDashboard.css";

import {
  marcarAsistencia,
  obtenerHistorialAsistencia,
  obtenerEstadoActual,  // ← se pasa como prop
} from "../../services/api/asistenciaApi";

export default function AsistenciaDashboard() {
  const idEmpleado = 2; // temporal

  const hoy = new Date();
  const hace30 = new Date(hoy);
  hace30.setDate(hoy.getDate() - 30);

  const [rango, setRango] = useState({
    desde: hace30.toISOString().slice(0, 10),
    hasta: hoy.toISOString().slice(0, 10)
  });

  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const cargarHistorial = async () => {
    if (!idEmpleado) return;
    try {
      setCargando(true);
      setError("");
      const data = await obtenerHistorialAsistencia(
        idEmpleado,
        rango.desde,
        rango.hasta
      );
      setHistorial(data);
    } catch (e) {
      setError(e.message || "Error al obtener historial de asistencia");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarHistorial();
  }, []);

  const handleMarcar = async () => {
    if (!idEmpleado) return;
    try {
      setCargando(true);
      setError("");
      await marcarAsistencia(idEmpleado);
      await cargarHistorial();
    } catch (e) {
      setError(e.message || "Error al marcar asistencia");
    } finally {
      setCargando(false);
    }
  };

  if (!idEmpleado) {
    return <p>No se encontró un empleado asociado al usuario actual.</p>;
  }

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="asistencia-main">
        <h1 className="main-title">Mi asistencia</h1>

        {error && <p className="asistencia-error">{error}</p>}

        <div className="content-grid">
          <div className="left-column">
            <CheckInCard
              onMarcar={handleMarcar}
              cargando={cargando}
              idEmpleado={idEmpleado}
              obtenerEstadoActual={obtenerEstadoActual}  // ← PASA LA FUNCIÓN
            />

            <div className="monthly-card">
              <h2 className="subtitle">Resumen mensual</h2>
              <div className="monthly-inner">
                <MonthlySummaryPie registros={historial} />
              </div>
            </div>
          </div>

          <div className="right-column">
            <AsistenciaTable registros={historial} />
          </div>
        </div>
      </div>
    </div>
  );
}
