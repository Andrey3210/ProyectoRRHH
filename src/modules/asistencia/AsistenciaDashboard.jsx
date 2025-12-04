import { useEffect, useState } from "react";
import MonthlySummaryPie from "./components/MonthlySummaryPie.jsx";
import AsistenciaTable from "./components/AsistenciaTable.jsx";
import CheckInCard from "./components/CheckInCard.jsx";
import "./AsistenciaDashboard.css";
import authService from "../../services/api/authService";
import AsistenciaNavTabs from "./components/AsistenciaNavTabs";

import {
  marcarAsistencia,
  obtenerHistorialAsistencia,
  obtenerEstadoActual,
  obtenerMiEmpleado,
} from "../../services/api/asistenciaApi";

export default function AsistenciaDashboard() {
  const user = authService.getCurrentUser();
  const idUsuario = user?.idUsuario;

  const hoy = new Date();
  const hace30 = new Date(hoy);
  hace30.setDate(hoy.getDate() - 30);

  const [rango, setRango] = useState({
    desde: hace30.toISOString().slice(0, 10),
    hasta: hoy.toISOString().slice(0, 10),
  });

  const [idEmpleado, setIdEmpleado] = useState(null);
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarEmpleado = async () => {
      if (!idUsuario) return;
      try {
        setCargando(true);
        setError("");
        const emp = await obtenerMiEmpleado(idUsuario);
        setIdEmpleado(emp.idEmpleado);
      } catch (e) {
        console.error(e);
        setError("No se encontró un empleado asociado al usuario actual.");
      } finally {
        setCargando(false);
      }
    };
    cargarEmpleado();
  }, [idUsuario]);

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
    if (!idEmpleado) return;
    cargarHistorial();
  }, [idEmpleado, rango.desde, rango.hasta]);

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

  const handleDateChange = (nuevoRango) => {
    setRango((prev) => ({ ...prev, ...nuevoRango }));
  };

  if (!user) return <p>No hay usuario autenticado.</p>;
  if (!idEmpleado && !cargando) return <p>No se encontró un empleado asociado.</p>;

  return (
    <div style={{ position: "relative", width: "100%", height: "100%" }}>
      <div className="asistencia-main">
        <div className="asistencia-header">
          <h1 className="main-title">Mi asistencia</h1>
          <AsistenciaNavTabs />
        </div>

        {error && <p className="asistencia-error">{error}</p>}

        <div className="content-grid">
          <div className="left-column">
            <CheckInCard
              onMarcar={handleMarcar}
              cargando={cargando}
              idEmpleado={idEmpleado}
              obtenerEstadoActual={obtenerEstadoActual}
            />

            <div className="monthly-card">
              <h2 className="subtitle">Resumen mensual</h2>
              <div className="monthly-inner">
                <MonthlySummaryPie registros={historial} />
              </div>
            </div>
          </div>

          <div className="right-column">
            <AsistenciaTable
              registros={historial}
              desde={rango.desde}
              hasta={rango.hasta}
              onDateChange={handleDateChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
