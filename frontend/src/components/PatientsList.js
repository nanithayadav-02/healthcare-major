import React, { useEffect, useState } from "react";
import { getPatients } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function openRecords(patientId) {
    navigate("/appointments");
  }
  function openAppointments(patientId) {
    // use the "patientId" query param (matches backend/api helper)
    navigate(`/appointments?patientId=${patientId}`);
  }

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        setLoading(true);
        const data = await getPatients();
        if (mounted) setPatients(data || []);
      } catch (err) {
        console.error(err);
        setError("Failed to load patients");
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <div className="brand">
          <div className="logo">HC</div>
          <div>
            <h2 style={{ margin: 0 }}>Patients</h2>
            <div className="hint">List of registered patients</div>
          </div>
        </div>

        <div className="nav">
          <button className="btn btn-primary" onClick={() => navigate("/add")}>+ Add Patient</button>
        </div>
      </div>

      <div className="card pastel">
        {error && <div style={{ color: "crimson" }}>{error}</div>}

        {loading ? (
          <div>Loading…</div>
        ) : patients.length === 0 ? (
          <div className="hint">No patients yet. Click “Add Patient”.</div>
        ) : (
          <table className="table" role="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {patients.map((p) => (
                <tr key={p._id}>
                  <td>{p.name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.phone}</td>

                  <td>
                    <button className="btn btn-ghost" onClick={() => openRecords(p._id)}>Records</button>
                    <button className="btn btn-ghost" onClick={() => openAppointments(p._id)}>Appointments</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
