const API_BASE = "http://localhost:8080/api/asistencia";

export async function marcarAsistencia(idEmpleado) {
  const url = `${API_BASE}/marcar?idEmpleado=${idEmpleado}`;
  const resp = await fetch(url, { method: "POST" });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // RegistroAsistencia
}

export async function obtenerHistorialAsistencia(idEmpleado, desde, hasta) {
  const params = new URLSearchParams({ desde, hasta }).toString();
  const url = `${API_BASE}/empleado/${idEmpleado}?${params}`;
  console.log('URL solicitada:', url);
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // array RegistroAsistencia
}

export async function obtenerEstadoActual(idEmpleado) {
  const url = `${API_BASE}/estado-actual/${idEmpleado}`;
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // RegistroAsistencia “preview”
}

export async function obtenerAsistenciaHoyTimeline() {
  const url = `${API_BASE}/hoy/timeline`;
  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // array AsistenciaHoyDTO
}
