import React, { useState } from "react";
import { createPatient } from "../api/api";
import { useNavigate } from "react-router-dom";

export default function AddPatient(){
  const [form, setForm] = useState({ name:"", age:"", gender:"female", phone:"" });
  const navigate = useNavigate();

  function onChange(e){ const { name, value } = e.target; setForm(f=>({...f,[name]:value})); }

  async function onSubmit(e){
    e.preventDefault();
    if(!form.name || !form.age) return alert("Name and age required");
    try {
      await createPatient({ name: form.name, age: Number(form.age), gender: form.gender, phone: form.phone });
      alert("Patient created");
      navigate("/");
    } catch(err){ console.error(err); alert("Failed to create patient"); }
  }

  return (
    <div style={{ padding: 12 }}>
      <h2>Add Patient</h2>
      <form onSubmit={onSubmit}>
        <div><label>Name</label><br/><input name="name" value={form.name} onChange={onChange} /></div>
        <div><label>Age</label><br/><input name="age" type="number" value={form.age} onChange={onChange} /></div>
        <div><label>Gender</label><br/>
          <select name="gender" value={form.gender} onChange={onChange}>
            <option value="female">Female</option><option value="male">Male</option><option value="other">Other</option>
          </select>
        </div>
        <div><label>Phone</label><br/><input name="phone" value={form.phone} onChange={onChange} /></div>
        <button type="submit" style={{ marginTop: 8 }}>Create</button>
      </form>
    </div>
  );
}
