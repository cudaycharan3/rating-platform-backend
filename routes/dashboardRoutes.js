const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/auth');
const authorizeRoles = require('../middleware/role');

// ✅ Protect this route: only allow 'admin' role
router.get('/admin-data', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome Admin 👑' });
});

// ✅ Allow both 'admin' and 'user'
router.get('/', verifyToken, authorizeRoles('admin', 'user'), (req, res) => {
  res.json({ message: `Welcome ${req.user.role} 🙌` });
});

module.exports = router;
