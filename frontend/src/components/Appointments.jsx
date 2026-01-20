import React, { useEffect, useState } from "react";
import { createAppointment, getAppointments } from "../api/api";
import { useSearchParams } from "react-router-dom";

export default function Appointments() {
  const [searchParams] = useSearchParams();
  const patientId = searchParams.get("patientId");

  const [date, setDate] = useState("");
  const [reason, setReason] = useState("");
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      alert("You must be logged in as a patient to view appointments.");
      setLoading(false);
      return;
    }
    load();
  }, [patientId]);

  async function load() {
    try {
      const data = await getAppointments(patientId);
      setList(data || []);
    } catch (err) {
      console.error("getAppointments error:", err);
      alert("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();

    if (!token) {
      alert("You must be logged in as a patient to schedule an appointment.");
      return;
    }

    if (!date) {
      alert("Select date & time");
      return;
    }

    try {
      await createAppointment({
        date,
        notes: reason,
      });
      setDate("");
      setReason("");
      await load();
      alert("Appointment scheduled successfully");
    } catch (err) {
      console.error("createAppointment error:", err);
      alert("Failed to schedule appointment");
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div style={{ padding: 12 }}>
      <h2>
        Appointments {patientId ? `(Patient ${patientId.slice(-6)})` : ""}
      </h2>

      <form onSubmit={submit}>
        <div>
          <label>Date & Time</label>
          <br />
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          <label>Reason</label>
          <br />
          <input
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        <button type="submit" style={{ marginTop: 8 }}>
          Schedule
        </button>
      </form>

      <h3 style={{ marginTop: 16 }}>Upcoming</h3>

      {list.length === 0 ? (
        <p>No appointments</p>
      ) : (
        <ul>
          {list.map((a) => (
            <li key={a._id}>
              {new Date(a.date).toLocaleString()} — {a.notes} (
              {a.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
