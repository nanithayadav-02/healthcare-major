import React, { useState, useEffect } from "react";
import { createRecord, getRecords } from "../api/api";
import { useNavigate, useParams } from "react-router-dom";

export default function AddRecord(){
  const { patientId } = useParams();
  const [note, setNote] = useState("");
  const [vitals, setVitals] = useState({ bp:"", pulse:"", temp:"" });
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  useEffect(()=> { if(patientId) load(); }, [patientId]);

  async function load(){
    try { const data = await getRecords(patientId); setRecords(data); } catch(err){ console.error(err); }
  }

  async function submit(e){
    e.preventDefault();
    try {
      await createRecord({ patientId, note, vitals });
      alert("Record added");
      load();
      navigate(`/records/${patientId}`);
    } catch(err){ console.error(err); alert("Failed to add record"); }
  }

  function onVitalChange(e){ const { name, value } = e.target; setVitals(v=>({...v,[name]:value})); }

  return (
    <div style={{ padding: 12 }}>
      <h2>Records (patient: {patientId ? patientId.slice(-6) : "N/A"})</h2>
      <form onSubmit={submit}>
        <div><label>Note</label><br/><textarea value={note} onChange={e=>setNote(e.target.value)} /></div>
        <div><label>BP</label><br/><input name="bp" value={vitals.bp} onChange={onVitalChange} /></div>
        <div><label>Pulse</label><br/><input name="pulse" value={vitals.pulse} onChange={onVitalChange} /></div>
        <div><label>Temp</label><br/><input name="temp" value={vitals.temp} onChange={onVitalChange} /></div>
        <button type="submit" style={{ marginTop: 8 }}>Save Record</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Previous</h3>
      <ul>
        {records.map(r=>(
          <li key={r._id}>{new Date(r.createdAt).toLocaleString()} — {r.note} — {r.vitals?.bp || ""}</li>
        ))}
      </ul>
    </div>
  );
}
