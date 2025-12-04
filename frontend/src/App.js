import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PatientsList from "./components/PatientsList";
import AddPatient from "./components/AddPatient";
import AddRecord from "./components/AddRecord";
import Appointments from "./components/Appointments";

export default function App(){
  return (
    <BrowserRouter>
      <div style={{ padding: 12 }}>
        <h1>Healthcare App (MVP)</h1>
        <nav>
          <Link to="/">Patients</Link>{" | "}
          <Link to="/appointments">Appointments</Link>{" | "}
          <Link to="/add-patient">Add Patient</Link>
        </nav>
        <hr/>
        <Routes>
          <Route path="/" element={<PatientsList />} />
          <Route path="/add-patient" element={<AddPatient />} />
          <Route path="/records/:patientId" element={<AddRecord />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
