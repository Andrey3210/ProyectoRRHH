// src/modules/asistencia/components/ReportesFilters.jsx
import { useState } from "react";
import { FaFilter } from "react-icons/fa";

const AREAS = [
  "Todos",
  "Recursos humanos",
  "Ventas",
  "Operaciones",
  "Logística",
  "IT",
  "Marketing",
  "Finanzas"
];

const EMPLEADOS_MOCK = [
  { id: "Todos", nombre: "Todos" },
  { id: "1", nombre: "Estefano Alexis Ramírez García" },
  { id: "2", nombre: "María López" },
  { id: "3", nombre: "Juan Pérez" },
  { id: "4", nombre: "Lucía Martínez" }
];

const TIPOS_REPORTE = [
  { id: "ResumenPorEmpleado", label: "Resumen por empleado" },
  { id: "DetallePorDia", label: "Detalle por día" }
];

export default function ReportesFilters({ filtros, onAplicar, onLimpiar }) {
  const [local, setLocal] = useState(filtros);

  const handleChange = (campo, valor) => {
    setLocal(prev => ({ ...prev, [campo]: valor }));
  };

  const handleCheckbox = (campo) => {
    setLocal(prev => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAplicar(local);
  };

  const handleReset = () => {
    setLocal({
      fechaInicio: "",
      fechaFin: "",
      area: "Todos",
      empleadoId: "Todos",
      tipoReporte: "ResumenPorEmpleado",
      soloFaltas: false,
      soloTardanzas: false,
      incluirDiasSinRegistro: false
    });
    onLimpiar();
  };

  return (
    <form className="reportes-filters-card" onSubmit={handleSubmit}>
      <div className="reportes-filters-header">
        <span className="reportes-filters-title">
          <FaFilter style={{ marginRight: 6, fontSize: 13 }} />
          Filtros de reporte
        </span>
      </div>

      <div className="reportes-filters-grid">
        <div className="rep-field">
          <label>Fecha inicio</label>
          <input
            type="date"
            value={local.fechaInicio}
            onChange={e => handleChange("fechaInicio", e.target.value)}
          />
        </div>
        <div className="rep-field">
          <label>Fecha fin</label>
          <input
            type="date"
            value={local.fechaFin}
            onChange={e => handleChange("fechaFin", e.target.value)}
          />
        </div>
        <div className="rep-field">
          <label>Área</label>
          <select
            value={local.area}
            onChange={e => handleChange("area", e.target.value)}
          >
            {AREAS.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
        <div className="rep-field">
          <label>Empleado</label>
          <select
            value={local.empleadoId}
            onChange={e => handleChange("empleadoId", e.target.value)}
          >
            {EMPLEADOS_MOCK.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.nombre}</option>
            ))}
          </select>
        </div>
        <div className="rep-field">
          <label>Tipo de reporte</label>
          <select
            value={local.tipoReporte}
            onChange={e => handleChange("tipoReporte", e.target.value)}
          >
            {TIPOS_REPORTE.map(t => (
              <option key={t.id} value={t.id}>{t.label}</option>
            ))}
          </select>
        </div>

        <div className="rep-field rep-field-checkboxes">
          <label>Opciones</label>
          <div className="rep-checkboxes">
            <label>
              <input
                type="checkbox"
                checked={local.soloFaltas}
                onChange={() => handleCheckbox("soloFaltas")}
              />
              Solo faltas
            </label>
            <label>
              <input
                type="checkbox"
                checked={local.soloTardanzas}
                onChange={() => handleCheckbox("soloTardanzas")}
              />
              Solo tardanzas
            </label>
            <label>
              <input
                type="checkbox"
                checked={local.incluirDiasSinRegistro}
                onChange={() => handleCheckbox("incluirDiasSinRegistro")}
              />
              Incluir días sin registro
            </label>
          </div>
        </div>
      </div>

      <div className="reportes-filters-actions">
        <button
          type="button"
          className="rep-btn-secondary"
          onClick={handleReset}
        >
          Limpiar
        </button>
        <button
          type="submit"
          className="rep-btn-primary"
        >
          Aplicar filtros
        </button>
      </div>
    </form>
  );
}
