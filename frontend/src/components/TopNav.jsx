// src/components/TopNav.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "./TopNav.css";

export default function TopNav() {
  return (
    <nav className="topnav" role="navigation" aria-label="Primary">
      <div className="container topnav-inner">
        <div className="nav-links">
          <NavLink to="/" className={({isActive}) => isActive ? "active" : ""}>Patients</NavLink>
          <NavLink to="/add" className={({isActive}) => isActive ? "active" : ""}>Add Patient</NavLink>
          <NavLink to="/appointments" className={({isActive}) => isActive ? "active" : ""}>Appointments</NavLink>
        </div>
        <div className="nav-actions" aria-hidden>
          {/* placeholder for right-side actions */}
        </div>
      </div>
    </nav>
  );
}

