const express = require('express');
const router = express.Router();
const db = require('../config/db');

// REGISTER
router.post('/register', async (req, res) => {
    const { name, email, password, companyName, phone, jobTitle, department, role, joinedDate } = req.body;

    if (!companyName || !email || !password || !name) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Generate proper Login ID: PRE + 00N
        // 1. Get count of users in this company
        const [rows] = await db.query('SELECT COUNT(*) as count FROM users WHERE company_name = ?', [companyName]);
        const count = rows[0].count;

        // Sanitize prefix
        let prefix = companyName.replace(/[^a-zA-Z]/g, '').substring(0, 4).toUpperCase();
        if (prefix.length < 2) prefix = 'EMP'; // Fallback

        const nextNum = count + 1;
        const loginId = `${prefix}${String(nextNum).padStart(3, '0')}`; // e.g., TEST001

        const userRole = role || 'admin';
        // Default joined_date if missing
        const dateJoined = joinedDate || new Date();

        const [result] = await db.query(
            `INSERT INTO users (login_id, password, name, email, role, company_name, phone, job_title, department, joined_date) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [loginId, password, name, email, userRole, companyName, phone, jobTitle, department, dateJoined]
        );

        res.status(201).json({ message: 'User created', userId: result.insertId, loginId });
    } catch (error) {
        console.error('Register Error:', error);
        // Check for duplicate entry
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email or Login ID already exists' });
        }
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// LOGIN
router.post('/login', async (req, res) => {
    const { identifier, password } = req.body; // identifier can be email or loginId

    try {
        const [users] = await db.query(
            `SELECT * FROM users WHERE (email = ? OR login_id = ?) AND password = ?`,
            [identifier, identifier, password]
        );

        if (users.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        // Remove password from response
        delete user.password;

        res.json({ message: 'Login successful', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
