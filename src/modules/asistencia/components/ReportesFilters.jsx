// src/modules/asistencia/components/ReportesFilters.jsx
import { useState, useEffect } from "react";
import { FaFilter } from "react-icons/fa";

const TIPOS_REPORTE = [
  { id: "ResumenPorEmpleado", label: "Resumen por empleado" },
  { id: "DetallePorDia", label: "Detalle por día" }
];

export default function ReportesFilters({
  filtros,
  onAplicar,
  onLimpiar,
  areasOptions,
  empleadosOptions
}) {
  const [local, setLocal] = useState(filtros);

  useEffect(() => {
    setLocal(filtros);
  }, [filtros]);

  const handleChange = (campo, valor) => {
    setLocal((prev) => ({ ...prev, [campo]: valor }));
  };

  const handleCheckbox = (campo) => {
    setLocal((prev) => ({ ...prev, [campo]: !prev[campo] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAplicar(local);
  };

  const handleReset = () => {
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
    setLocal(base);
    onLimpiar();
  };

  // áreas desde backend
  const areas =
    areasOptions && areasOptions.length > 0 ? areasOptions : ["Todos"];

  // empleados desde backend
  const empleados =
    empleadosOptions && empleadosOptions.length > 0
      ? empleadosOptions
      : [{ id: "Todos", nombre: "Todos" }];

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
            onChange={(e) => handleChange("fechaInicio", e.target.value)}
          />
        </div>
        <div className="rep-field">
          <label>Fecha fin</label>
          <input
            type="date"
            value={local.fechaFin}
            onChange={(e) => handleChange("fechaFin", e.target.value)}
          />
        </div>
        <div className="rep-field">
          <label>Área</label>
          <select
            value={local.area}
            onChange={(e) => handleChange("area", e.target.value)}
          >
            {areas.map((a) => (
              <option key={a} value={a}>
                {a}
              </option>
            ))}
          </select>
        </div>
        <div className="rep-field">
          <label>Empleado</label>
          <select
            value={local.empleadoId}
            onChange={(e) => handleChange("empleadoId", e.target.value)}
          >
            {empleados.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.nombre}
              </option>
            ))}
          </select>
        </div>
        <div className="rep-field">
          <label>Tipo de reporte</label>
          <select
            value={local.tipoReporte}
            onChange={(e) => handleChange("tipoReporte", e.target.value)}
          >
            {TIPOS_REPORTE.map((t) => (
              <option key={t.id} value={t.id}>
                {t.label}
              </option>
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
                disabled={local.tipoReporte === "DetallePorDia"}
              />
              Solo faltas
            </label>
            <label>
              <input
                type="checkbox"
                checked={local.soloTardanzas}
                onChange={() => handleCheckbox("soloTardanzas")}
                disabled={local.tipoReporte === "DetallePorDia"}
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
        <button type="submit" className="rep-btn-primary">
          Aplicar filtros
        </button>
      </div>
    </form>
  );
}
