import apiClient from "./client";

const API_BASE = "/asistencia";
const API_BASER = "/reporte";

export async function marcarAsistencia(idEmpleado) {
  const url = `${API_BASE}/marcar?idEmpleado=${idEmpleado}`;
  const resp = await fetch(`${apiClient.baseURL}${url}`, {
    method: "POST",
    headers: apiClient.getHeaders({ "Content-Type": "application/json" }),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // RegistroAsistencia
}

export async function obtenerHistorialAsistencia(idEmpleado, desde, hasta) {
  const params = new URLSearchParams({ desde, hasta }).toString();
  const url = `${API_BASE}/empleado/${idEmpleado}?${params}`;
  const resp = await fetch(`${apiClient.baseURL}${url}`, {
    headers: apiClient.getHeaders(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // array RegistroAsistencia
}

export async function obtenerEstadoActual(idEmpleado) {
  const url = `${API_BASE}/estado-actual/${idEmpleado}`;
  const resp = await fetch(`${apiClient.baseURL}${url}`, {
    headers: apiClient.getHeaders(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // RegistroAsistencia “preview”
}

export async function obtenerAsistenciaHoyTimeline() {
  const url = `${API_BASE}/hoy/timeline`;
  const resp = await fetch(`${apiClient.baseURL}${url}`, {
    headers: apiClient.getHeaders(),
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // array AsistenciaHoyDTO
}

export async function obtenerMiEmpleado(idUsuario) {
  const resp = await fetch(
    `${apiClient.baseURL}${API_BASE}/mi-empleado?idUsuario=${idUsuario}`,
    {
      headers: apiClient.getHeaders(),
    }
  );
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // { idEmpleado, nombreCompleto }
}

export async function guardarCorreccionAsistencia(payload) {
  const params = new URLSearchParams({
    idEmpleado: payload.idEmpleado,
    fecha: payload.fecha,
    tipoRegistro: payload.tipoRegistro,
    motivo: payload.motivo,
    idUsuarioCorrige: payload.idUsuarioCorrige,
  });
  if (payload.idRegistro) params.append("idRegistro", payload.idRegistro);
  if (payload.horaEntrada) params.append("horaEntrada", payload.horaEntrada);
  if (payload.horaSalida) params.append("horaSalida", payload.horaSalida);

  const resp = await fetch(`${apiClient.baseURL}${API_BASE}/correcciones`, {
    method: "POST",
    headers: apiClient.getHeaders({ "Content-Type": "application/x-www-form-urlencoded" }),
    body: params,
  });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json();
}

export async function obtenerReporteResumenAsistencia(filtros) {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio || "",
    fechaFin: filtros.fechaFin || "",
    // NO mandamos areaId porque solo tenemos nombres
    empleadoId: filtros.empleadoId === "Todos" ? "" : filtros.empleadoId,
    soloFaltas: filtros.soloFaltas,
    soloTardanzas: filtros.soloTardanzas,
    incluirSinRegistro: filtros.incluirDiasSinRegistro
  });

  const url = `${apiClient.baseURL}${API_BASER}/resumen-empleado?${params.toString()}`;

  const resp = await fetch(url, { headers: apiClient.getHeaders() });
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json(); // { resumen, detalle }
}

export async function obtenerReporteDetallePorDia(filtros) {
  const params = new URLSearchParams({
    fechaInicio: filtros.fechaInicio || "",
    fechaFin: filtros.fechaFin || "",
    empleadoId: filtros.empleadoId === "Todos" ? "" : filtros.empleadoId,
    area: filtros.area === "Todos" ? "" : filtros.area
  });

  const url = `${apiClient.baseURL}${API_BASER}/detalle-dia?${params.toString()}`;
  const resp = await fetch(url, { headers: apiClient.getHeaders() });
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  return await resp.json(); // array de DetalleDiaDTO
}



