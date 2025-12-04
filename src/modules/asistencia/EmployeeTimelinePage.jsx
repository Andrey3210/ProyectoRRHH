// src/modules/asistencia/EmployeeTimelinePage.jsx
import { useEffect, useMemo, useState } from "react";
import "./EmployeeTimeline.css";
import { HOURS } from "./employeeMockData";
import EmployeeTimelineFilters from "./components/EmployeeTimelineFilters";
import EmployeeTimelineGrid from "./components/EmployeeTimelineGrid";
import EditAttendanceModal from "./components/EditAttendanceModal";
import { obtenerAsistenciaHoyTimeline } from "../../services/api/asistenciaApi";


export default function EmployeeTimelinePage() {
  const [data, setData] = useState([]); // antes mockEmployeeAttendance
  const [search, setSearch] = useState("");
  const [area, setArea] = useState("Todos");
  const [estado, setEstado] = useState("Todos");
  const [selectedTramo, setSelectedTramo] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  // Cargar asistencia real de hoy
  useEffect(() => {
    const cargar = async () => {
      try {
        setCargando(true);
        setError("");
        const registros = await obtenerAsistenciaHoyTimeline();
        // registros: [{ idEmpleado, nombreCompleto, area, tipoRegistro, inicio, fin }]
        const empleadosMap = new Map();

        registros.forEach((r, index) => {
          if (!empleadosMap.has(r.idEmpleado)) {
            empleadosMap.set(r.idEmpleado, {
              id: r.idEmpleado,
              nombre: r.nombreCompleto,
              area: r.area || "General",
              tramos: [],
            });
          }
          const emp = empleadosMap.get(r.idEmpleado);
          emp.tramos.push({
            id: index + 1,           // id local del tramo
            inicio: r.inicio,        // "HH:mm"
            fin: r.fin,              // "HH:mm" o null
            estado: r.tipoRegistro,  // PUNTUAL, TARDE, FALTA, JUSTIFICADA
          });
        });

        setData(Array.from(empleadosMap.values()));
      } catch (e) {
        console.error(e);
        setError(e.message || "Error al cargar asistencia de hoy");
      } finally {
        setCargando(false);
      }
    };

    cargar();
  }, []);

  const employees = useMemo(() => {
    return data.filter((emp) => {
      const matchName = emp.nombre.toLowerCase().includes(search.toLowerCase());
      const matchArea = area === "Todos" || emp.area === area;
      const hasEstado =
        estado === "Todos" ||
        emp.tramos.some((t) => t.estado === estado);
      return matchName && matchArea && hasEstado;
    });
  }, [data, search, area, estado]);

  const handleOpenEdit = (empId, tramoId) => {
    const emp = data.find((e) => e.id === empId);
    const tramo = emp?.tramos.find((t) => t.id === tramoId);
    if (!emp || !tramo) return;
    setSelectedTramo({
      empleadoId: emp.id,
      empleadoNombre: emp.nombre,
      ...tramo,
    });
  };

  const handleCloseEdit = () => setSelectedTramo(null);

  const handleSaveEdit = (updated) => {
    setData((prev) =>
      prev.map((emp) => {
        if (emp.id !== updated.empleadoId) return emp;
        return {
          ...emp,
          tramos: emp.tramos.map((t) =>
            t.id === updated.id
              ? {
                  ...t,
                  inicio: updated.inicio,
                  fin: updated.fin,
                  estado: updated.estado,
                }
              : t
          ),
        };
      })
    );
    setSelectedTramo(null);
  };

  const areasDisponibles = useMemo(() => {
    const set = new Set();
    data.forEach(emp => {
      if (emp.area) set.add(emp.area);
    });
    return Array.from(set);
  }, [data]);


  return (
    <div className="employee-timeline-main">
      <h1 className="main-title">Asistencia de empleados</h1>

      {error && <p className="asistencia-error">{error}</p>}
      {cargando && <p>Cargando asistencia de hoy...</p>}

      <div className="timeline-content">
        <EmployeeTimelineFilters
          search={search}
          onSearchChange={setSearch}
          area={area}
          onAreaChange={setArea}
          estado={estado}
          onEstadoChange={setEstado}
          areasDisponibles={areasDisponibles}
        />

        <EmployeeTimelineGrid
          hours={HOURS}
          employees={employees}
          onBarClick={handleOpenEdit}
        />
      </div>

      {selectedTramo && (
        <EditAttendanceModal
          tramo={selectedTramo}
          onClose={handleCloseEdit}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
