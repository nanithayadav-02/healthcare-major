// middleware/auth.js
const jwt = require("jsonwebtoken");
const User = require("../models/user");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return res.status(401).json({ error: "Unauthorized" });

  const token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    // attach user info to req (minimal)
    req.user = { _id: payload._id, role: payload.role, name: payload.name };
    // optionally fetch full user if needed:
    // req.fullUser = await User.findById(payload._id).select('-password');
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
