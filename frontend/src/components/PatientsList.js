import React, { useEffect, useState } from "react";
import { getPatients } from "../api/api";
import { Link } from "react-router-dom";

export default function PatientsList() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{ load(); }, []);

  async function load(){
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data);
    } catch(err){
      console.error(err);
      alert("Failed to load patients");
    } finally { setLoading(false); }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>Patients</h2>
      <Link to="/add-patient"><button>Add Patient</button></Link>
      {loading ? <p>Loading…</p> : (
        <table border="1" cellPadding="8" style={{ marginTop: 12 }}>
          <thead><tr><th>Name</th><th>Age</th><th>Gender</th><th>Phone</th><th>Actions</th></tr></thead>
          <tbody>
            {patients.map(p=>(
              <tr key={p._id}>
                <td>{p.name}</td><td>{p.age}</td><td>{p.gender}</td><td>{p.phone}</td>
                <td>
                  <Link to={`/records/${p._id}`}><button>Records</button></Link>{" "}
                  <Link to={`/appointments?patientId=${p._id}`}><button>Appointments</button></Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
