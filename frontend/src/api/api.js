// frontend/src/api/api.js
// Lightweight fetch helper + common API functions used across the frontend.
// Uses localStorage.getItem('token') for Authorization header.

const BASE = "http://127.0.0.1:5000/api";

function getTokenHeader() {
  const token = localStorage.getItem("token") || "";
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function fetchJson(url, opts = {}) {
  const res = await fetch(url, opts);
  const text = await res.text();
  let json = null;
  try { json = text ? JSON.parse(text) : null; } catch (e) { /* ignore parse error */ }

  if (!res.ok) {
    // throw an object to make debugging easier in caller
    const err = { status: res.status, body: json || text || res.statusText };
    throw err;
  }
  return json;
}

/* Patients */
export async function getPatients() {
  const url = `${BASE}/patients`;
  return fetchJson(url, { method: "GET", headers: { "Content-Type": "application/json", ...getTokenHeader() } });
}

export async function createPatient(payload) {
  const url = `${BASE}/patients`;
  return fetchJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(payload),
  });
}

/* Records */
export async function getRecords(patientId) {
  const q = patientId ? `?patientId=${encodeURIComponent(patientId)}` : "";
  const url = `${BASE}/records${q}`;
  return fetchJson(url, { method: "GET", headers: { "Content-Type": "application/json", ...getTokenHeader() } });
}

export async function createRecord(payload) {
  const url = `${BASE}/records`;
  return fetchJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(payload),
  });
}

/* Appointments */
export async function getAppointments(patientId) {
  const q = patientId ? `?patientId=${encodeURIComponent(patientId)}` : "";
  const url = `${BASE}/appointments${q}`;
  return fetchJson(url, { method: "GET", headers: { "Content-Type": "application/json", ...getTokenHeader() } });
}

export async function createAppointment(payload) {
  const url = `${BASE}/appointments`;
  return fetchJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...getTokenHeader() },
    body: JSON.stringify(payload),
  });
}

/* Auth (simple helpers used by frontend if needed) */
export async function register(payload) {
  const url = `${BASE}/auth/register`;
  return fetchJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function login(payload) {
  const url = `${BASE}/auth/login`;
  return fetchJson(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

/* default export (optional) */
export default {
  getPatients,
  createPatient,
  getRecords,
  createRecord,
  getAppointments,
  createAppointment,
  register,
  login,
};
