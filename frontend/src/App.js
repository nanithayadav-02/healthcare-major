import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import PatientsList from "./components/PatientsList";
import AddPatient from "./components/AddPatient";
import AddRecord from "./components/AddRecord";
import Appointments from "./components/Appointments";

function App() {
  return (
    <Router>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h1>Healthcare App</h1>

        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>Patients</Link>
          <Link to="/add" style={{ marginRight: "15px" }}>Add Patient</Link>
          <Link to="/appointments" style={{ marginRight: "15px" }}>Appointments</Link>
        </nav>

        <Routes>
          <Route path="/" element={<PatientsList />} />
          <Route path="/add" element={<AddPatient />} />
          <Route path="/records/:patientId" element={<AddRecord />} />
          <Route path="/appointments" element={<Appointments />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
