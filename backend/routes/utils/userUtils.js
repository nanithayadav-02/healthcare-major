const express = require('express');
const User = require('../../models/user');
const bcrypt = require('bcryptjs');

const router = express.Router();

// VIEW USER
router.post('/view-user', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      message: 'User found',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        age: user.profile?.age,
        gender: user.profile?.gender,
        bloodGroup: user.profile?.bloodGroup,
        createdAt: user.createdAt,
        passwordPreview: user.password ? String(user.password).slice(0,10) + '...' : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// RESET PASSWORD
router.post('/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) return res.status(400).json({ error: 'email and newPassword required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const hashed = await bcrypt.hash(newPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE USER
router.post('/delete-user', async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'email required' });

    const result = await User.deleteOne({ email });
    if (result.deletedCount === 0) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
