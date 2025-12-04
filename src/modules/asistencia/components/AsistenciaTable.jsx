import { FaFilter } from "react-icons/fa";

export default function AsistenciaTable({ registros = [] }) {
  const estadoConfig = {
    PRESENTE: { color: "#3b82f6", label: "Presente" },
    Puntual: { color: "#22c55e", label: "Puntual" },
    PUNTUAL: { color: "#22c55e", label: "Puntual" },
    TARDE: { color: "#f97316", label: "Tarde" },
    Tarde: { color: "#f97316", label: "Tarde" },
    FALTA: { color: "#ef4444", label: "Falta" },
    Falta: { color: "#ef4444", label: "Falta" }
  };

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
        minHeight: 0
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "14px"
        }}
      >
        <h2
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: 0,
            color: "#222"
          }}
        >
          Historial de asistencias
        </h2>

        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "7px 12px",
            borderRadius: "8px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            fontSize: "13px",
            fontWeight: "500",
            color: "#374151",
            cursor: "pointer",
            transition: "all 0.2s"
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#e5e7eb")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#f3f4f6")
          }
        >
          <FaFilter style={{ fontSize: "11px" }} />
          Filtrar
        </button>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: "auto",
          minHeight: 0
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse"
          }}
        >
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
            {registros.map((r, i) => {
              const estado = r.tipoRegistro || "-";
              const cfg =
                estadoConfig[estado] || {
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
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#f9fafb")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "transparent")
                  }
                >
                  <td style={tdStyle}>{r.fecha}</td>
                  <td style={tdStyle}>{r.horaEntrada ?? "-"}</td>
                  <td style={tdStyle}>{r.horaSalida ?? "-"}</td>
                  <td style={tdStyle}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "7px"
                      }}
                    >
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

            {registros.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{
                    padding: "12px 8px",
                    fontSize: "13px",
                    color: "#6b7280",
                    textAlign: "center"
                  }}
                >
                  No hay registros en el rango seleccionado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
