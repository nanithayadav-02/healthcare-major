const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const requireRole = require('../middleware/requireRole');
const router = express.Router();

// GET /api/admin/users - list users (admin only)
router.get('/users', auth, requireRole('admin'), async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/admin/users/:id - get single user
router.get('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const u = await User.findById(req.params.id).select('-password');
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /api/admin/users/:id - update user (e.g., verify doctor)
router.put('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    const updates = req.body;
    // sanitize: allow only certain fields (basic)
    const allowed = ['role', 'name', 'profile', 'doctorProfile'];
    const updateObj = {};
    Object.keys(updates).forEach(k => {
      if (allowed.includes(k) || k.startsWith('doctorProfile.') || k.startsWith('profile.')) updateObj[k] = updates[k];
    });

    const u = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!u) return res.status(404).json({ error: 'User not found' });
    res.json(u);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', auth, requireRole('admin'), async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
