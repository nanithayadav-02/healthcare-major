// routes/doctors.js
const express = require("express");
const User = require("../models/user");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const multer = require("multer");
const path = require("path");
const router = express.Router();

// simple local storage for MVP
const upload = multer({
  dest: "uploads/doctor-licenses/",
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// GET /api/doctors?specialization=cardio
router.get("/", async (req, res) => {
  try {
    const filter = { role: "doctor" };
    if (req.query.specialization) filter["doctorProfile.specialization"] = req.query.specialization;
    const doctors = await User.find(filter).select("-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET single doctor
router.get("/:id", async (req, res) => {
  try {
    const d = await User.findById(req.params.id).select("-password");
    if (!d || d.role !== "doctor") return res.status(404).json({ error: "Doctor not found" });
    res.json(d);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/doctors/verify - doctor uploads license (must be authenticated doctor)
router.post("/verify", auth, upload.single("license"), async (req, res) => {
  try {
    if (!req.user || req.user.role !== "doctor") return res.status(403).json({ error: "Only doctors can upload verification" });
    const file = req.file;
    if (!file) return res.status(400).json({ error: "License file required" });

    const user = await User.findById(req.user._id);
    user.doctorProfile = user.doctorProfile || {};
    user.doctorProfile.licenseUrl = path.join(file.destination, file.filename);
    user.doctorProfile.verified = false; // admin needs to approve
    await user.save();
    res.json({ message: "License uploaded. Await admin verification." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
