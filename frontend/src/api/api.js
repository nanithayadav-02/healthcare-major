import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

export async function getPatients() { return api.get("/patients").then(r=>r.data); }
export async function createPatient(payload) { return api.post("/patients", payload).then(r=>r.data); }
export async function createRecord(payload) { return api.post("/records", payload).then(r=>r.data); }
export async function getRecords(patientId) { return api.get(`/records/${patientId}`).then(r=>r.data); }
export async function createAppointment(payload) { return api.post('/appointments', payload).then(r=>r.data); }
export async function getAppointments(patientId) {
  const url = patientId ? `/appointments?patientId=${patientId}` : "/appointments";
  return api.get(url).then(r=>r.data);
}

export default api;
