import { FaSearch, FaChevronDown, FaFilter } from "react-icons/fa";

export default function EmployeeTimelineFilters({
  search,
  onSearchChange,
  area,
  onAreaChange,
  estado,
  onEstadoChange,
  areasDisponibles = [], // ← viene del padre
}) {
  const estados = ["Todos", "Presente", "PUNTUAL", "TARDE", "FALTA", "JUSTIFICADA"];

  const areas = ["Todos", ...areasDisponibles];

  return (
    <div className="et-filters">
      <div className="et-search-wrapper">
        <FaSearch className="et-search-icon" />
        <input
          type="text"
          className="et-search-input"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>

      <div className="et-filter-selects">
        <div className="et-select">
          <span className="et-select-label">
            <FaFilter style={{ marginRight: 6, fontSize: 12 }} />
            Área
          </span>
          <div className="et-select-box">
            <select
              value={area}
              onChange={e => onAreaChange(e.target.value)}
            >
              {areas.map(a => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
            <FaChevronDown className="et-select-icon" />
          </div>
        </div>

        <div className="et-select">
          <span className="et-select-label">Estado</span>
          <div className="et-select-box">
            <select
              value={estado}
              onChange={e => onEstadoChange(e.target.value)}
            >
              {estados.map(eo => (
                <option key={eo} value={eo}>{eo}</option>
              ))}
            </select>
            <FaChevronDown className="et-select-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}
