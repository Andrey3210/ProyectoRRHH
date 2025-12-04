import { FaSearch, FaChevronDown, FaFilter } from "react-icons/fa";

export default function EmployeeTimelineFilters({
  filters,          // Recibe el objeto { search, area, status }
  onFilterChange,   // Recibe la función (key, value) => ...
  areasOptions = [] // Recibe las áreas dinámicas desde el padre
}) {
  
  // Lista de estados posibles (basado en tus enums de backend)
  const estados = [
    { value: "", label: "Todos los estados" },
    { value: "PUNTUAL", label: "Puntual" },
    { value: "TARDE", label: "Tarde" },
    { value: "FALTA", label: "Falta" },
    { value: "PENDIENTE", label: "Pendiente" }, // Agregado por si acaso
    { value: "JUSTIFICADA", label: "Justificada" }
  ];

  return (
    <div className="et-filters">
      {/* --- Buscador por Nombre --- */}
      <div className="et-search-wrapper">
        <FaSearch className="et-search-icon" />
        <input
          type="text"
          className="et-search-input"
          placeholder="Buscar por nombre..."
          value={filters.search} // Usamos filters.search
          onChange={(e) => onFilterChange("search", e.target.value)} // Key "search"
        />
      </div>

      <div className="et-filter-selects">
        
        {/* --- Filtro de Área --- */}
        <div className="et-select">
          <span className="et-select-label">
            <FaFilter style={{ marginRight: 6, fontSize: 12 }} />
            Área
          </span>
          <div className="et-select-box">
            <select
              value={filters.area} // Usamos filters.area
              onChange={(e) => onFilterChange("area", e.target.value)} // Key "area"
            >
              {/* Opción por defecto para limpiar el filtro */}
              <option value="">Todas las áreas</option>
              
              {/* Mapeamos las áreas dinámicas */}
              {areasOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <FaChevronDown className="et-select-icon" />
          </div>
        </div>

        {/* --- Filtro de Estado --- */}
        <div className="et-select">
          <span className="et-select-label">Estado</span>
          <div className="et-select-box">
            <select
              value={filters.status} // Usamos filters.status (nota: en el padre usamos 'status')
              onChange={(e) => onFilterChange("status", e.target.value)} // Key "status"
            >
              {estados.map((estado) => (
                <option key={estado.value} value={estado.value}>
                  {estado.label}
                </option>
              ))}
            </select>
            <FaChevronDown className="et-select-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}