const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET Attendance (All or User specific)
router.get('/', async (req, res) => {
    const { userId, date, startDate, endDate, companyName } = req.query;

    try {
        let query = 'SELECT a.*, u.name, u.job_title FROM attendance a JOIN users u ON a.user_id = u.id WHERE u.company_name = ?';
        const params = [companyName];

        if (userId) {
            query += ' AND a.user_id = ?';
            params.push(userId);
        }
        if (date) {
            query += ' AND a.date = ?';
            params.push(date);
        }
        // If range needed
        if (startDate && endDate) {
            query += ' AND a.date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        const [records] = await db.query(query, params);
        res.json(records);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CHECK IN
router.post('/checkin', async (req, res) => {
    const { userId, date, time, status } = req.body;
    try {
        await db.query(
            'INSERT INTO attendance (user_id, date, check_in, status) VALUES (?, ?, ?, ?)',
            [userId, date, time, status]
        );
        res.status(201).json({ message: 'Checked in' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// CHECK OUT
router.post('/checkout', async (req, res) => {
    const { userId, date, time, workingHours } = req.body;
    try {
        await db.query(
            'UPDATE attendance SET check_out = ?, working_hours = ? WHERE user_id = ? AND date = ?',
            [time, workingHours, userId, date]
        );
        res.json({ message: 'Checked out' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
