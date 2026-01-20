// backend/models/record.js
const mongoose = require("mongoose");

const RecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  type: String, // "prescription" | "lab" | "report"
  fileUrl: String,
  fileName: String,
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Record", RecordSchema);
