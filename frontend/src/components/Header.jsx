import React from "react";
import "./Header.css";

export default function Header() {
  return (
    <header className="medisync-header" role="banner" aria-label="MEDISYNC header">
      <div className="medisync-hero">
        <div className="logo-badge" aria-hidden>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="logo-svg">
            <defs>
              <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#ffd6e0" />
                <stop offset="1" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="24" height="24" rx="6" fill="url(#g1)"></rect>
            <text x="50%" y="62%" textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight="700" fontSize="11" fill="#071331">M</text>
          </svg>
        </div>

        <div className="brand-text">
          <h1 className="brand-title">MEDISYNC</h1>
          <p className="brand-tag">Connected care — simple, safe, synced.</p>
        </div>
      </div>
    </header>
  );
}
