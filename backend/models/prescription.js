// models/prescription.js
const mongoose = require("mongoose");

const PrescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  meds: [
    {
      name: String,
      dose: String,
      instructions: String
    }
  ],
  notes: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Prescription", PrescriptionSchema);
