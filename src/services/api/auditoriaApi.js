// src/services/api/auditoriaApi.js
const API_BASE = "http://localhost:8080/api";

export async function obtenerAuditoria({ desde, hasta, usuario }) {
  const params = new URLSearchParams({ desde, hasta });
  if (usuario) params.append("usuario", usuario);
  const resp = await fetch(`${API_BASE}/auditoria?${params.toString()}`);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json();
}

export async function obtenerCorrecciones({ desde, hasta, empleadoId, usuario }) {
  const params = new URLSearchParams({ desde, hasta });
  if (empleadoId) params.append("empleadoId", empleadoId);
  if (usuario) params.append("usuario", usuario);
  const resp = await fetch(
    `${API_BASE}/auditoria/correcciones?${params.toString()}`
  );
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${text}`);
  }
  return await resp.json();
}
