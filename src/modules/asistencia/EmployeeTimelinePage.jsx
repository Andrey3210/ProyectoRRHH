import { useEffect, useState, useMemo } from "react";
import {
  obtenerAsistenciaHoyTimeline,
  guardarCorreccionAsistencia,
} from "../../services/api/asistenciaApi";
import EmployeeTimelineFilters from "./components/EmployeeTimelineFilters";
import EmployeeTimelineGrid from "./components/EmployeeTimelineGrid";
import EditAttendanceModal from "./components/EditAttendanceModal";
import authService from "../../services/api/authService";
import AsistenciaNavTabs from "../asistencia/components/AsistenciaNavTabs";
import "./EmployeeTimeline.css";

export default function EmployeeTimelinePage() {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState({ search: "", area: "", status: "" });
  const [areasDisponibles, setAreasDisponibles] = useState([]);
  const [selectedTramo, setSelectedTramo] = useState(null);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const data = await obtenerAsistenciaHoyTimeline();
      setEmpleados(data);

      const areasUnicas = [...new Set(
        data
          .map(emp => emp.area)
          .filter(area => area && area !== "Sin Área")
      )].sort();
      setAreasDisponibles(areasUnicas);
    } catch (error) {
      console.error("Error al cargar timeline:", error);
    } finally {
      setCargando(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFiltros(prev => ({ ...prev, [key]: value }));
  };

  const empleadosFiltrados = useMemo(() => {
    return empleados.filter((emp) => {
      const matchSearch = emp.nombreCompleto
        .toLowerCase()
        .includes(filtros.search.toLowerCase());

      const matchArea = filtros.area ? emp.area === filtros.area : true;

      const rawTipo = emp.tipoRegistro || emp.tipo || "";
      const matchStatus = filtros.status
        ? rawTipo.toUpperCase() === filtros.status.toUpperCase()
        : true;

      return matchSearch && matchArea && matchStatus;
    });
  }, [empleados, filtros]);

  const timelineData = useMemo(() => {
    const map = {};
    empleadosFiltrados.forEach((registro) => {
      if (!map[registro.idEmpleado]) {
        map[registro.idEmpleado] = {
          id: registro.idEmpleado,
          nombre: registro.nombreCompleto,
          tramos: [],
        };
      }
      if (registro.inicio) {
        const rawTipo = registro.tipoRegistro || registro.tipo || null;

        const estadoCapitalizado = rawTipo
          ? rawTipo.charAt(0).toUpperCase() + rawTipo.slice(1).toLowerCase()
          : "Pendiente";

        map[registro.idEmpleado].tramos.push({
          id: `${registro.idEmpleado}-${registro.inicio}`,
          inicio: registro.inicio,
          fin: registro.fin,
          estado: estadoCapitalizado,
          idRegistro: registro.idRegistro,
          fecha: registro.fecha,
          empleadoNombre: registro.nombreCompleto,
          empleadoId: registro.idEmpleado,
        });
      }
    });
    return Object.values(map);
  }, [empleadosFiltrados]);

  const hours = Array.from({ length: 18 }, (_, i) => i + 6);

  const handleSaveCorreccion = async (dataCorreccion) => {
    console.log("Corrección a guardar (handle):", dataCorreccion);

    try {
      const user = authService.getCurrentUser();

      await guardarCorreccionAsistencia({
        idRegistro: dataCorreccion.idRegistro || null,
        idEmpleado: dataCorreccion.empleadoId,
        fecha: dataCorreccion.fecha || new Date().toISOString().slice(0, 10),
        horaEntrada: dataCorreccion.inicio,
        horaSalida: dataCorreccion.fin || null,
        tipoRegistro: dataCorreccion.estado.toUpperCase(),
        motivo: dataCorreccion.motivo || "",
        idUsuarioCorrige: user?.idUsuario,
      });

      setSelectedTramo(null);
      await cargarDatos();
    } catch (e) {
      console.error("Error guardando corrección:", e);
    }
  };

  return (
    <div className="employee-timeline-main">
      <div className="asistencia-header">
        <h1 className="main-title">Monitoreo en tiempo real</h1>
        <AsistenciaNavTabs />
      </div>

      <div className="timeline-content">
        <EmployeeTimelineFilters
          filters={filtros}
          onFilterChange={handleFilterChange}
          areasOptions={areasDisponibles}
        />

        <div className="et-grid-wrapper et-grid-wrapper--spaced">
          {cargando ? (
            <p>Cargando asistencia...</p>
          ) : (
            <EmployeeTimelineGrid
              hours={hours}
              employees={timelineData}
              onBarClick={(idEmp, idTramo) => {
                const emp = timelineData.find(e => e.id === idEmp);
                const tramo = emp?.tramos.find(t => t.id === idTramo);
                if (tramo) {
                  setSelectedTramo(tramo);
                }
              }}
            />
          )}
        </div>
      </div>

      {selectedTramo && (
        <EditAttendanceModal
          tramo={selectedTramo}
          onClose={() => setSelectedTramo(null)}
          onSave={handleSaveCorreccion}
        />
      )}
    </div>
  );
}
