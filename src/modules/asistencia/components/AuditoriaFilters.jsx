// src/modules/asistencia/components/AuditoriaFilters.jsx
export default function AuditoriaFilters({
  tipoVista,
  onTipoVistaChange,
  desde,
  hasta,
  onDesdeChange,
  onHastaChange,
  usuario,
  onUsuarioChange,
  empleadoId,
  onEmpleadoIdChange,
}) {
  return (
    <div className="audit-filters-card">
      <h2 className="audit-subtitle">Filtros de auditoría</h2>
      <div className="audit-filters-grid">
        <div className="audit-filter-field">
          <label>Fecha inicio</label>
          <input
            type="date"
            value={desde}
            onChange={(e) => onDesdeChange(e.target.value)}
          />
        </div>

        <div className="audit-filter-field">
          <label>Fecha fin</label>
          <input
            type="date"
            value={hasta}
            onChange={(e) => onHastaChange(e.target.value)}
          />
        </div>

        <div className="audit-filter-field">
          <label>Tipo de vista</label>
          <select
            value={tipoVista}
            onChange={(e) => onTipoVistaChange(e.target.value)}
          >
            <option value="AUDITORIA">Auditoría sistema</option>
            <option value="CORRECCIONES">Correcciones de asistencia</option>
          </select>
        </div>

        <div className="audit-filter-field">
          <label>Usuario</label>
          <input
            type="text"
            placeholder="Usuario que realizó la acción"
            value={usuario}
            onChange={(e) => onUsuarioChange(e.target.value)}
          />
        </div>

        {tipoVista === "CORRECCIONES" && (
          <div className="audit-filter-field">
            <label>ID empleado</label>
            <input
              type="number"
              placeholder="Empleado afectado"
              value={empleadoId}
              onChange={(e) => onEmpleadoIdChange(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
