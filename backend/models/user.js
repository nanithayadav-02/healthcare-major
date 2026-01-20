// models/user.js
const mongoose = require("mongoose");

const DoctorProfileSchema = new mongoose.Schema({
  specialization: String,
  licenseUrl: String,      // file url (S3 or local)
  experienceYears: Number,
  verified: { type: Boolean, default: false },
  timings: [
    {
      day: String,
      from: String,
      to: String
    }
  ]
}, { _id: false });

const ProfileSchema = new mongoose.Schema({
  age: Number,
  gender: String,
  bloodGroup: String,
  phone: String,
  address: String,
  medicalHistory: String
}, { _id: false });

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  profile: ProfileSchema,
  doctorProfile: DoctorProfileSchema,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);
