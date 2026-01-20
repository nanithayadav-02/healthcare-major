// routes/records.js
const express = require("express");
const multer = require("multer");
const path = require("path");
const Record = require("../models/record");
const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");

const router = express.Router();

// simple local storage; for production use S3 or similar
const upload = multer({ dest: "uploads/records/", limits: { fileSize: 10 * 1024 * 1024 } });

// POST /api/records - upload record (patient or doctor)
router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const { patientId, type, notes } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "File required" });

    // ensure uploader has permission: doctor or patient (patientId must match)
    if (req.user.role === "patient" && String(req.user._id) !== String(patientId))
      return res.status(403).json({ error: "Cannot upload record for another patient" });

    const record = await Record.create({
      patientId,
      uploadedBy: req.user._id,
      type,
      fileUrl: path.join(file.destination, file.filename),
      fileName: file.originalname,
      notes
    });

    res.json(record);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/records?patientId=...
router.get("/", auth, async (req, res) => {
  try {
    const { patientId } = req.query;
    // if user is patient, limit to their records
    const filter = {};
    if (req.user.role === "patient") filter.patientId = req.user._id;
    else if (patientId) filter.patientId = patientId;

    const records = await Record.find(filter).sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
