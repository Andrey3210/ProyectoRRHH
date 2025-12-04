// src/modules/asistencia/AuditoriaPage.jsx
import { useEffect, useState } from "react";
import "./AuditoriaPage.css";
import AuditoriaFilters from "./components/AuditoriaFilters.jsx";
import AuditoriaTable from "./components/AuditoriaTable.jsx";
import CorreccionesTable from "./components/CorreccionesTable.jsx";
import {
  obtenerAuditoria,
  obtenerCorrecciones,
} from "../../services/api/auditoriaApi";

export default function AuditoriaPage() {
  const hoy = new Date();
  const hace7 = new Date(hoy);
  hace7.setDate(hoy.getDate() - 7);

  const [tipoVista, setTipoVista] = useState("AUDITORIA"); // AUDITORIA | CORRECCIONES
  const [desde, setDesde] = useState(hace7.toISOString().slice(0, 10));
  const [hasta, setHasta] = useState(hoy.toISOString().slice(0, 10));
  const [usuario, setUsuario] = useState("");
  const [empleadoId, setEmpleadoId] = useState("");
  const [data, setData] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError("");
        if (tipoVista === "AUDITORIA") {
          const registros = await obtenerAuditoria({
            desde,
            hasta,
            usuario: usuario || undefined,
          });
          setData(registros);
        } else {
          const registros = await obtenerCorrecciones({
            desde,
            hasta,
            empleadoId: empleadoId || undefined,
            usuario: usuario || undefined,
          });
          setData(registros);
        }
      } catch (e) {
        console.error(e);
        setError(e.message || "Error al cargar auditoría");
      } finally {
        setCargando(false);
      }
    };
    cargar();
  }, [tipoVista, desde, hasta, usuario, empleadoId]);

  return (
    <div className="audit-main">
      <h1 className="audit-title">Auditoría y correcciones</h1>

      <AuditoriaFilters
        tipoVista={tipoVista}
        onTipoVistaChange={setTipoVista}
        desde={desde}
        hasta={hasta}
        onDesdeChange={setDesde}
        onHastaChange={setHasta}
        usuario={usuario}
        onUsuarioChange={setUsuario}
        empleadoId={empleadoId}
        onEmpleadoIdChange={setEmpleadoId}
      />

      {error && <p className="audit-error">{error}</p>}
      {cargando && <p>Cargando...</p>}

      {tipoVista === "AUDITORIA" ? (
        <AuditoriaTable registros={data} />
      ) : (
        <CorreccionesTable registros={data} />
      )}
    </div>
  );
}
