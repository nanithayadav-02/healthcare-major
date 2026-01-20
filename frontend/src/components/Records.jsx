// src/components/Records.jsx
import React from "react";
import { useParams, useLocation } from "react-router-dom";

export default function Records() {
  const { patientId } = useParams();
  const q = new URLSearchParams(useLocation().search);
  const pid = patientId || q.get("patient");

  return (
    <div className="container">
      <div className="card" style={{ marginTop: 8 }}>
        <h2 style={{ marginTop: 0 }}>Medical Records</h2>
        <p style={{ color: "var(--muted)" }}>{pid ? `Patient ID: ${pid}` : "All records"}</p>
        <small style={{ color: "var(--muted)" }}>Replace this with the real records list later.</small>
      </div>
    </div>
  );
}
