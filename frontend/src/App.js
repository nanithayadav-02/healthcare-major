import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

// Components
import Header from "./components/Header";
import TopNav from "./components/TopNav";

import PatientsList from "./components/PatientsList";
import AddPatient from "./components/AddPatient";
import Records from "./components/Records";
import AddRecord from "./components/AddRecord";
import Appointments from "./components/Appointments";

export default function App() {
  return (
    <Router>
      {/* Always visible MEDISYNC header */}
      <Header />

      {/* Navigation bar */}
      <TopNav />

      {/* Main content */}
      <main className="container" style={{ marginTop: "20px" }}>
        <Routes>
          <Route path="/" element={<PatientsList />} />
          <Route path="/add" element={<AddPatient />} />
          <Route path="/records/:patientId" element={<Records />} />
          <Route path="/add-record/:patientId" element={<AddRecord />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </main>
    </Router>
  );
}
