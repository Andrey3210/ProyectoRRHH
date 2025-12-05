import { useState, useEffect } from "react";
import { IoPowerSharp } from "react-icons/io5";

export default function CheckInCard({ 
  onMarcar, 
  cargando, 
  idEmpleado, 
  obtenerEstadoActual  
}) {
  const [info, setInfo] = useState({
    estado: "-",
    hora: "-",
    fecha: "-",
  });
  const [cargandoEstado, setCargandoEstado] = useState(false);

  // Función para formatear hora: "01:23:22.0052876" → "01:23"
  const formatearHora = (horaCompleta) => {
    if (!horaCompleta || horaCompleta === "-") return "-";
    return horaCompleta.slice(0, 5); // Solo HH:MM
  };

  // Carga estado actual automáticamente
useEffect(() => {
  if (!idEmpleado || !obtenerEstadoActual) return;

  const cargarEstado = async () => {
    try {
      setCargandoEstado(true);
      const preview = await obtenerEstadoActual(idEmpleado);
      if (!preview) {
        setInfo({ estado: "-", hora: "-", fecha: "-" });
        return;
      }

      // Mostrar el TIPO de registro (PUNTUAL/TARDE/FALTA...), no el EstadoRegistro
      const estadoPreview = preview.tipoRegistro || "-";   // ← aquí

      const horaRaw = preview.horaEntrada || preview.horaSalida || null;
      const fechaRaw = preview.fecha || null;

      setInfo({
        estado: estadoPreview,
        hora: formatearHora(horaRaw),
        fecha: fechaRaw || "-",
      });
    } catch (e) {
      console.error("Error obteniendo estado actual:", e);
      setInfo({ estado: "-", hora: "-", fecha: "-" });
    } finally {
      setCargandoEstado(false);
    }
  };

  cargarEstado();
}, [idEmpleado, obtenerEstadoActual]);




  const manejarClick = async () => {
    if (cargando || !onMarcar || !idEmpleado || !obtenerEstadoActual) return;
    
    try {
      await onMarcar();
      // Recarga estado actual inmediatamente después de marcar
      const ultimoRegistro = await obtenerEstadoActual(idEmpleado);
      if (ultimoRegistro) {
        setInfo({
          estado: ultimoRegistro.tipoRegistro ?? "-",
          hora: formatearHora(ultimoRegistro.horaEntrada || ultimoRegistro.horaSalida),
          fecha: ultimoRegistro.fecha ?? "-",
        });
      }
    } catch (e) {
      console.error("Error al actualizar estado:", e);
    }
  };

  return (
    <div
      style={{
        borderRadius: "16px",
        backgroundColor: "#ffffff",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.08)",
        border: "1px solid #e0e0e0",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
      }}
    >
      <h2
        style={{
          fontSize: "16px",
          fontWeight: "600",
          textAlign: "center",
          marginBottom: "4px",
          color: "#333",
        }}
      >
        Marcar Entrada/Salida
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
          marginBottom: "8px",
        }}
      >
        <button
          onClick={manejarClick}
          disabled={cargando || cargandoEstado}
          style={{
            width: "200px",
            height: "200px",
            borderRadius: "20px",
            backgroundColor: (cargando || cargandoEstado) ? "#93c5fd" : "#2f80ff",
            boxShadow: "0 6px 14px rgba(47, 128, 255, 0.35)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: (cargando || cargandoEstado) ? "default" : "pointer",
            border: "none",
            transition: "transform 0.2s",
          }}
          onMouseEnter={(e) =>
            !(cargando || cargandoEstado) && (e.currentTarget.style.transform = "scale(1.02)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "scale(1)")
          }
        >
          <IoPowerSharp style={{ fontSize: "110px", color: "white" }} />
        </button>
      </div>

      <div
        style={{
          marginTop: "8px",
          fontSize: "14px",
          color: "#555",
          lineHeight: "1.8",
        }}
      >
        <p style={{ marginBottom: "4px" }}>
          📍 <b>Estado:</b> {info.estado}
        </p>
        <p style={{ marginBottom: "4px" }}>
          🕐 <b>Hora:</b> {info.hora}
        </p>
        <p style={{ marginBottom: "0" }}>
          📅 <b>Fecha:</b> {info.fecha}
        </p>
      </div>
    </div>
  );
}
