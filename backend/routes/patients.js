const express = require("express");
const router = express.Router();
const Patient = require("../models/Patient");

// POST /api/patients
router.post("/", async (req, res) => {
  try {
    const { name, age, gender, phone } = req.body;
    if (!name || !age) return res.status(400).json({ error: "Name & age required" });
    const patient = new Patient({ name, age, gender, phone });
    await patient.save();
    res.status(201).json(patient);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// GET /api/patients
router.get("/", async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });
    res.json(patients);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
