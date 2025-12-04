import React, { useEffect, useState } from "react";
import { createAppointment, getAppointments } from "../api/api";
import { useSearchParams } from "react-router-dom";

export default function Appointments(){
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId") || "";
  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [list, setList] = useState([]);

  useEffect(()=>{ load(); }, [patientId]);

  async function load(){
    try {
      const data = await getAppointments(patientId);
      setList(data);
    } catch(err){ console.error(err); alert("Failed to load"); }
  }

  async function submit(e){
    e.preventDefault();
    if(!date) return alert("Select date");
    try {
      await createAppointment({ patientId, date, reason });
      setDate(""); setReason("");
      await load();
      alert("Appointment scheduled");
    } catch(err){ console.error(err); alert("Failed to schedule"); }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>Appointments {patientId ? `(Patient ${patientId.slice(-6)})` : ""}</h2>
      <form onSubmit={submit}>
        <div><label>Date & Time</label><br/>
          <input type="datetime-local" value={date} onChange={e=>setDate(e.target.value)} />
        </div>
        <div><label>Reason</label><br/><input value={reason} onChange={e=>setReason(e.target.value)} /></div>
        <button type="submit" style={{ marginTop: 8 }}>Schedule</button>
      </form>

      <h3 style={{ marginTop: 16 }}>Upcoming</h3>
      <ul>
        {list.map(a=>(
          <li key={a._id}>{new Date(a.date).toLocaleString()} — {a.reason} [status: {a.status}]</li>
        ))}
      </ul>
    </div>
  );
}
