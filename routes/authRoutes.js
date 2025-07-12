const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // ✅ correct SQLite connection

// ✅ REGISTER
router.post('/register', (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(name, email, hashedPassword, role || 'user');

    res.status(201).json({
      message: 'User registered successfully',
      user: { id: result.lastInsertRowid, name, email, role }
    });
  } catch (err) {
    console.error("❌ Registration error:", err.message);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// ✅ LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  try {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    const user = stmt.get(email);

    if (!user) return res.status(401).json({ error: 'Invalid email or password' });

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid email or password' });

    const token = jwt.sign(
      { id: user.id, role: user.role },
      'mysecretkey', // replace with process.env.JWT_SECRET in .env later
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token, role: user.role });
  } catch (err) {
    console.error("❌ Login error:", err.message);
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
