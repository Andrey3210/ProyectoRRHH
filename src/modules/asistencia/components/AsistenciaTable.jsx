import { useState } from "react";
import { FaFilter, FaTimes } from "react-icons/fa";

export default function AsistenciaTable({ registros = [], desde, hasta, onDateChange }) {
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState("TODOS");

  const estadoConfig = {
    PRESENTE: { color: "#3b82f6", label: "Presente" },
    Puntual: { color: "#22c55e", label: "Puntual" },
    PUNTUAL: { color: "#22c55e", label: "Puntual" },
    TARDE: { color: "#f97316", label: "Tarde" },
    Tarde: { color: "#f97316", label: "Tarde" },
    FALTA: { color: "#ef4444", label: "Falta" },
    Falta: { color: "#ef4444", label: "Falta" }
  };

  // Filtrado por estado + orden cronológico (más antiguos arriba)
  const registrosFiltrados = registros
    .filter((r) => {
      if (statusFilter === "TODOS") return true;
      const estadoRegistro = (r.tipoRegistro || "").toUpperCase();
      return estadoRegistro === statusFilter;
    })
    .slice()
    .sort((a, b) => {
      const da = a.fecha || "";
      const db = b.fecha || "";

      if (da < db) return 1;   // más reciente (fecha mayor) primero
      if (da > db) return -1;

      const ha = a.horaEntrada || "00:00:00";
      const hb = b.horaEntrada || "00:00:00";

      if (ha < hb) return 1;   // hora más alta primero
      if (ha > hb) return -1;
      return 0;
    });


  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e0e0e0",
        padding: "18px 22px",
        minHeight: 0,
        position: "relative"
      }}
    >
      {/* Header con botón Filtrar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px"
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: "600", margin: 0, color: "#222" }}>
          Historial de asistencias
        </h2>

        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 12px",
            borderRadius: "8px",
            backgroundColor: showFilters ? "#e5e7eb" : "#f3f4f6",
            border: "1px solid #d1d5db",
            fontSize: "13px",
            fontWeight: "500",
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
        >
          <FaFilter style={{ fontSize: "11px" }} />
          {showFilters ? "Cerrar Filtros" : "Filtrar"}
        </button>
      </div>

      {/* Panel de Filtros (Popup) */}
      {showFilters && (
        <div
          style={{
            position: "absolute",
            top: "60px",
            right: "22px",
            width: "300px",
            backgroundColor: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
            padding: "16px",
            zIndex: 50,
            display: "flex",
            flexDirection: "column",
            gap: "12px"
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: "600", fontSize: "14px" }}>Filtros</span>
            <FaTimes
              style={{ cursor: "pointer", color: "#9ca3af" }}
              onClick={() => setShowFilters(false)}
            />
          </div>

          {/* Filtro de Fechas (Afecta a la API) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#6b7280" }}>
              Rango de Fechas
            </label>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="date"
                value={desde}
                onChange={(e) => onDateChange({ desde: e.target.value })}
                style={inputStyle}
              />
              <input
                type="date"
                value={hasta}
                onChange={(e) => onDateChange({ hasta: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Filtro de Estado (Local) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{ fontSize: "12px", fontWeight: "500", color: "#6b7280" }}>Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              style={inputStyle}
            >
              <option value="TODOS">Todos</option>
              <option value="PUNTUAL">Puntual</option>
              <option value="TARDE">Tarde</option>
              <option value="FALTA">Falta</option>
            </select>
          </div>

          <button
            onClick={() => {
              setStatusFilter("TODOS");
            }}
            style={{
              marginTop: "5px",
              padding: "6px",
              fontSize: "12px",
              color: "#4b5563",
              background: "transparent",
              border: "1px dashed #d1d5db",
              cursor: "pointer",
              borderRadius: "4px"
            }}
          >
            Limpiar filtro de estado
          </button>
        </div>
      )}

      {/* Tabla */}
      <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr
              style={{
                borderBottom: "2px solid #e5e7eb",
                position: "sticky",
                top: 0,
                backgroundColor: "#ffffff"
              }}
            >
              <th style={thStyle}>Fecha</th>
              <th style={thStyle}>Hora de ingreso</th>
              <th style={thStyle}>Hora de salida</th>
              <th style={thStyle}>Estado</th>
            </tr>
          </thead>
          <tbody>
            {registrosFiltrados.map((r, i) => {
              const estado = r.tipoRegistro || "-";
              const cfg = estadoConfig[estado] || {
                color: "#9ca3af",
                label: estado
              };
              return (
                <tr
                  key={r.id ?? i}
                  style={{
                    borderBottom: "1px solid #f3f4f6",
                    transition: "background-color 0.15s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
                >
                  <td style={tdStyle}>{r.fecha}</td>
                  <td style={tdStyle}>{r.horaEntrada ?? "-"}</td>
                  <td style={tdStyle}>{r.horaSalida ?? "-"}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                      <div
                        style={{
                          width: "9px",
                          height: "9px",
                          borderRadius: "50%",
                          backgroundColor: cfg.color,
                          flexShrink: 0
                        }}
                      />
                      <span>{cfg.label}</span>
                    </div>
                  </td>
                </tr>
              );
            })}

            {registrosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "20px",
                    fontSize: "14px",
                    color: "#6b7280",
                    textAlign: "center"
                  }}
                >
                  {registros.length > 0
                    ? "No hay coincidencias con el filtro de estado."
                    : "No hay registros en el rango de fechas seleccionado."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Estilos auxiliares
const thStyle = {
  padding: "10px 8px",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "14px",
  color: "#374151"
};

const tdStyle = {
  padding: "10px 8px",
  fontSize: "13px",
  color: "#1f2937"
};

const inputStyle = {
  width: "100%",
  padding: "8px",
  borderRadius: "6px",
  border: "1px solid #d1d5db",
  fontSize: "13px",
  outline: "none"
};
