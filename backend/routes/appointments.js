const express = require('express');
const Appointment = require('../models/Appointment');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const router = express.Router();

/**
 * GET /
 * - If ?patientId=... provided -> return appointments for that patient (no auth required)
 * - Else if authenticated -> return appointments for current user (doctor => doctorId, patient => patientId)
 * - Else -> 400
 */
router.get('/', async (req, res) => {
  try {
    const { patientId } = req.query;

    if (patientId) {
      const items = await Appointment.find({ patientId }).sort({ date: -1 }).populate('patientId doctorId', 'name email profile');
      return res.json(items || []);
    }

    // fallback to authenticated user's view (same as /me)
    // try auth; if not authenticated, return helpful error
    if (!req.headers || !req.headers.authorization) {
      return res.status(400).json({ error: 'Provide ?patientId=... or authenticate to view your appointments' });
    }

    // try to authenticate; auth middleware normally attaches req.user, but we call it here:
    auth(req, res, async () => {
      try {
        const filter = req.user.role === 'doctor' ? { doctorId: req.user._id } :
                       req.user.role === 'patient' ? { patientId: req.user._id } : {};
        const appts = await Appointment.find(filter).sort({ date: -1 }).populate('patientId doctorId', 'name email profile');
        res.json(appts);
      } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch appointments', details: err.message });
      }
    });

  } catch (err) {
    console.error('GET /api/appointments error:', err);
    res.status(500).json({ error: 'Server error', details: err.message });
  }
});

// Create / book appointment (patient)
router.post('/', auth, async (req, res) => {
  try {
    const { doctorId, date, slot, notes } = req.body;
    if (req.user.role !== 'patient') return res.status(403).json({ error: 'Only patients can book' });

    const appt = await Appointment.create({
      patientId: req.user._id,
      doctorId,
      date: date ? new Date(date) : undefined,
      slot,
      notes
    });

    res.status(201).json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get authenticated user's appointments (keeps existing route)
router.get('/me', auth, async (req, res) => {
  try {
    const filter = req.user.role === 'doctor' ? { doctorId: req.user._id } :
                   req.user.role === 'patient' ? { patientId: req.user._id } : {};
    const appts = await Appointment.find(filter).sort({ date: -1 }).populate('patientId doctorId', 'name email profile');
    res.json(appts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Doctor approve/reject appointment
router.patch('/:id/approve', auth, requireRole('doctor'), async (req, res) => {
  try {
    const { action } = req.body; // 'approve' or 'reject'
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });
    if (String(appt.doctorId) !== String(req.user._id)) return res.status(403).json({ error: 'Not your appointment' });

    appt.status = action === 'approve' ? 'approved' : 'rejected';
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Patient or doctor cancel
router.patch('/:id/cancel', auth, async (req, res) => {
  try {
    const appt = await Appointment.findById(req.params.id);
    if (!appt) return res.status(404).json({ error: 'Appointment not found' });

    if (String(appt.patientId) !== String(req.user._id) && String(appt.doctorId) !== String(req.user._id))
      return res.status(403).json({ error: 'Not allowed' });

    appt.status = 'cancelled';
    await appt.save();
    res.json(appt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
