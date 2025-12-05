// src/modules/asistencia/ReportesAsistenciaPage.jsx
import { useState, useMemo } from "react";
import "./ReportesAsistencia.css";
import ReportesFilters from "./components/ReportesFilters";
import ReportesSummary from "./components/ReportesSummary";
import ReportesTable from "./components/ReportesTable";
import {
  obtenerReporteResumenAsistencia,
  obtenerReporteDetallePorDia
} from "../../services/api/asistenciaApi";
import AsistenciaNavTabs from "./components/AsistenciaNavTabs";

export default function ReportesAsistenciaPage() {
  const [areasDisponibles, setAreasDisponibles] = useState(["Todos"]);
  const [empleadosDisponibles, setEmpleadosDisponibles] = useState([
    { id: "Todos", nombre: "Todos" }
  ]);

  const [filtros, setFiltros] = useState({
    fechaInicio: "",
    fechaFin: "",
    area: "Todos",
    empleadoId: "Todos",
    tipoReporte: "ResumenPorEmpleado",
    soloFaltas: false,
    soloTardanzas: false,
    incluirDiasSinRegistro: false
  });

  const [filas, setFilas] = useState([]);
  const [summary, setSummary] = useState({
    diasTrabajados: 0,
    faltas: 0,
    tardanzas: 0,
    horasExtra: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const limpiarSummary = () =>
    setSummary({
      diasTrabajados: 0,
      faltas: 0,
      tardanzas: 0,
      horasExtra: 0
    });

  const cargarReporte = async (f) => {
    if (!f.fechaInicio || !f.fechaFin) {
      setFilas([]);
      limpiarSummary();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (f.tipoReporte === "DetallePorDia") {
        const detalle = await obtenerReporteDetallePorDia(f);
        setFilas(detalle);
        limpiarSummary();

        const areasUnicas = [
          "Todos",
          ...new Set(detalle.map((r) => r.areaNombre).filter((a) => a))
        ];
        setAreasDisponibles(areasUnicas);

        const empleadosUnicos = [
          { id: "Todos", nombre: "Todos" },
          ...Array.from(
            new Map(
              detalle.map((r) => [
                r.empleadoId,
                { id: String(r.empleadoId), nombre: r.empleadoNombre }
              ])
            ).values()
          )
        ];
        setEmpleadosDisponibles(empleadosUnicos);
      } else {
        const data = await obtenerReporteResumenAsistencia(f);
        const detalle = data.detalle || [];

        setSummary(
          data.resumen || {
            diasTrabajados: 0,
            faltas: 0,
            tardanzas: 0,
            horasExtra: 0
          }
        );
        setFilas(detalle);

        const areasUnicas = [
          "Todos",
          ...new Set(detalle.map((r) => r.areaNombre).filter((a) => a))
        ];
        setAreasDisponibles(areasUnicas);

        const empleadosUnicos = [
          { id: "Todos", nombre: "Todos" },
          ...Array.from(
            new Map(
              detalle.map((r) => [
                r.empleadoId,
                { id: String(r.empleadoId), nombre: r.empleadoNombre }
              ])
            ).values()
          )
        ];
        setEmpleadosDisponibles(empleadosUnicos);
      }
    } catch (e) {
      console.error(e);
      setError(e.message);
      setFilas([]);
      limpiarSummary();
    } finally {
      setLoading(false);
    }
  };

  const manejarAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setFilas([]);
    limpiarSummary();
    cargarReporte(nuevosFiltros);
  };

  const manejarLimpiar = () => {
    const base = {
      fechaInicio: "",
      fechaFin: "",
      area: "Todos",
      empleadoId: "Todos",
      tipoReporte: "ResumenPorEmpleado",
      soloFaltas: false,
      soloTardanzas: false,
      incluirDiasSinRegistro: false
    };
    setFiltros(base);
    setFilas([]);
    limpiarSummary();
    setError(null);
    setAreasDisponibles(["Todos"]);
    setEmpleadosDisponibles([{ id: "Todos", nombre: "Todos" }]);
  };

  const filasFiltradas = useMemo(() => {
    if (!filtros.fechaInicio || !filtros.fechaFin) return [];

    let resultado = filas;

    if (filtros.area && filtros.area !== "Todos") {
      const areaSel = filtros.area.trim().toLowerCase();
      resultado = resultado.filter(
        (f) => (f.areaNombre || "").trim().toLowerCase() === areaSel
      );
    }

    if (filtros.empleadoId && filtros.empleadoId !== "Todos") {
      resultado = resultado.filter(
        (f) => String(f.empleadoId) === String(filtros.empleadoId)
      );
    }

    if (filtros.tipoReporte === "ResumenPorEmpleado") {
      if (filtros.soloFaltas) {
        resultado = resultado.filter((f) => f.faltas > 0);
      }
      if (filtros.soloTardanzas) {
        resultado = resultado.filter((f) => f.tardanzas > 0);
      }
    }

    return resultado;
  }, [
    filas,
    filtros.area,
    filtros.empleadoId,
    filtros.soloFaltas,
    filtros.soloTardanzas,
    filtros.tipoReporte,
    filtros.fechaInicio,
    filtros.fechaFin
  ]);

  // Resumen calculado a partir de la tabla filtrada
  const resumenCalculado = useMemo(() => {
    if (!filasFiltradas || filasFiltradas.length === 0) {
      return {
        diasTrabajados: 0,
        faltas: 0,
        tardanzas: 0,
        horasExtra: 0
      };
    }

    const diasTrabajados = filasFiltradas.reduce(
      (acc, f) => acc + (f.diasTrabajados || 0),
      0
    );
    const faltas = filasFiltradas.reduce(
      (acc, f) => acc + (f.faltas || 0),
      0
    );
    const tardanzas = filasFiltradas.reduce(
      (acc, f) => acc + (f.tardanzas || 0),
      0
    );
    const horasExtra = filasFiltradas.reduce(
      (acc, f) => acc + (f.horasExtra || 0),
      0
    );

    return { diasTrabajados, faltas, tardanzas, horasExtra };
  }, [filasFiltradas]);

  return (
    <div className="employee-timeline-main">
      <div className="asistencia-header">
        <h1 className="main-title">Reportes de asistencia</h1>
        <AsistenciaNavTabs />
      </div>

      <div className="reportes-content">
        <ReportesFilters
          filtros={filtros}
          onAplicar={manejarAplicarFiltros}
          onLimpiar={manejarLimpiar}
          areasOptions={areasDisponibles}
          empleadosOptions={empleadosDisponibles}
        />

        <div className="reportes-results-card">
          <div className="reportes-results-header">
            <h2 className="reportes-results-title">
              {filtros.tipoReporte === "DetallePorDia"
                ? "Detalle por día"
                : "Resumen por empleado"}
            </h2>
          </div>

          {error && <p className="rep-error">{error}</p>}
          {loading && <p>Cargando...</p>}

          {/* usar el resumen calculado desde las filas filtradas */}
          <ReportesSummary summary={resumenCalculado} />

          <ReportesTable
            tipoReporte={filtros.tipoReporte}
            filas={filasFiltradas}
          />
        </div>
      </div>
    </div>
  );
}
