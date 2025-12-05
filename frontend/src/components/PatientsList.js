import React, { useEffect, useState } from "react";
import { getPatients } from "../api/api";
import { Link } from "react-router-dom";

export default function PatientsList() {
  console.log("DEBUG: PatientsList mounted");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
          <Link to="/add"><button className="btn btn-primary">+ Add Patient</button></Link>
        </div>
      </div>

      <div className="card">
        {error && <div style={{ color: "crimson", marginBottom: 8 }}>{error}</div>}
        {loading ? (
          <div>Loading…</div>
        ) : patients.length === 0 ? (
          <div className="hint">No patients yet. Click &quot;Add Patient&quot; to create one.</div>
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
                    <span style={{ marginRight: 8 }}>
                      <Link to={`/records/${p._id}`}><button className="btn btn-ghost">Records</button></Link>
                    </span>
                    <span>
                      <Link to={`/appointments?patientId=${p._id}`}><button className="btn btn-ghost">Appointments</button></Link>
                    </span>
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
