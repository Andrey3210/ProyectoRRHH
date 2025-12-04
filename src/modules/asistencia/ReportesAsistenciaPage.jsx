// src/modules/asistencia/ReportesAsistenciaPage.jsx
import { useMemo, useState } from "react";
import "./ReportesAsistencia.css";
import ReportesFilters from "./components/ReportesFilters";
import ReportesSummary from "./components/ReportesSummary";
import ReportesTable from "./components/ReportesTable";
import {
  mockSummary,
  mockResumenPorEmpleado,
  mockDetallePorDia
} from "./reportesMockData";

export default function ReportesAsistenciaPage() {
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

  const [modoDetalle, setModoDetalle] = useState(false);

  const datosFiltrados = useMemo(() => {
    if (filtros.tipoReporte === "DetallePorDia") {
      let filas = [...mockDetallePorDia];

      if (filtros.area !== "Todos") {
        filas = filas.filter(f => f.area === filtros.area);
      }
      if (filtros.empleadoId !== "Todos") {
        filas = filas.filter(
          f => String(f.empleadoId) === String(filtros.empleadoId)
        );
      }
      if (filtros.fechaInicio) {
        filas = filas.filter(f => f.fecha >= filtros.fechaInicio);
      }
      if (filtros.fechaFin) {
        filas = filas.filter(f => f.fecha <= filtros.fechaFin);
      }
      if (filtros.soloFaltas) {
        filas = filas.filter(f => f.estado === "Falta");
      }
      if (filtros.soloTardanzas) {
        filas = filas.filter(f => f.estado === "Tarde");
      }

      return filas;
    } else {
      let filas = [...mockResumenPorEmpleado];

      if (filtros.area !== "Todos") {
        filas = filas.filter(f => f.area === filtros.area);
      }
      if (filtros.empleadoId !== "Todos") {
        filas = filas.filter(
          f => String(f.empleadoId) === String(filtros.empleadoId)
        );
      }
      if (filtros.soloFaltas) {
        filas = filas.filter(f => f.faltas > 0);
      }
      if (filtros.soloTardanzas) {
        filas = filas.filter(f => f.tardanzas > 0);
      }

      return filas;
    }
  }, [filtros]);

  const summaryCalculado = useMemo(() => {
    if (datosFiltrados.length === 0) return mockSummary;

    if (filtros.tipoReporte === "DetallePorDia") {
      let diasTrabajados = 0;
      let faltas = 0;
      let tardanzas = 0;
      let horasExtra = 0; // sin cálculo real, solo placeholder

      datosFiltrados.forEach(f => {
        if (f.estado === "Falta") faltas += 1;
        if (f.estado === "Tarde") tardanzas += 1;
        if (f.estado === "Puntual" || f.estado === "Tarde") {
          diasTrabajados += 1;
        }
      });

      return {
        diasTrabajados,
        faltas,
        tardanzas,
        horasExtra
      };
    } else {
      let diasTrabajados = 0;
      let faltas = 0;
      let tardanzas = 0;
      let horasExtra = 0;

      datosFiltrados.forEach(f => {
        diasTrabajados += f.diasTrabajados;
        faltas += f.faltas;
        tardanzas += f.tardanzas;
        horasExtra += f.horasExtra;
      });

      return {
        diasTrabajados,
        faltas,
        tardanzas,
        horasExtra: Number(horasExtra.toFixed(2))
      };
    }
  }, [datosFiltrados, filtros.tipoReporte]);

  const manejarAplicarFiltros = (nuevosFiltros) => {
    setFiltros(nuevosFiltros);
    setModoDetalle(nuevosFiltros.tipoReporte === "DetallePorDia");
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
    setModoDetalle(false);
  };

  const manejarExportar = (formato) => {
    console.log("Exportar", formato, "con filtros:", filtros);
  };

  return (
    <div className="employee-timeline-main">
      <h1 className="main-title">Reportes de asistencia</h1>

      <div className="reportes-content">
        <ReportesFilters
          filtros={filtros}
          onAplicar={manejarAplicarFiltros}
          onLimpiar={manejarLimpiar}
        />

        <div className="reportes-results-card">
          <div className="reportes-results-header">
            <h2 className="reportes-results-title">
              {modoDetalle ? "Detalle por día" : "Resumen por empleado"}
            </h2>
            <div className="reportes-actions">
              <button
                type="button"
                className="rep-btn-secondary"
                onClick={() => manejarExportar("excel")}
              >
                Exportar Excel
              </button>
              <button
                type="button"
                className="rep-btn-primary"
                onClick={() => manejarExportar("pdf")}
              >
                Exportar PDF
              </button>
            </div>
          </div>

          <ReportesSummary summary={summaryCalculado} />

          <ReportesTable
            tipoReporte={filtros.tipoReporte}
            filas={datosFiltrados}
          />
        </div>
      </div>
    </div>
  );
}
