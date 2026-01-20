require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const patientRoutes = require("./routes/patients");
const recordRoutes = require("./routes/records");
const appointmentRoutes = require("./routes/appointments");
const authRoutes = require("./routes/auth/authRoutes");
const doctorsRoutes = require("./routes/doctors");
const appointmentsRoutes = require("./routes/appointments");
const recordsRoutes = require("./routes/records");
const adminRoutes = require("./routes/admin");

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error("❌ MONGO_URI not set in .env");
} else {
  mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });

}

app.get("/", (req, res) => res.send("Healthcare backend is running 🚀"));

app.use("/api/auth", authRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/doctors", doctorsRoutes);
app.use("/api/appointments", appointmentsRoutes);
app.use("/api/records", recordsRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';
app.listen(PORT, HOST, () => {
  console.log(`🚀 Backend running on http://${HOST}:${PORT}`);
});
