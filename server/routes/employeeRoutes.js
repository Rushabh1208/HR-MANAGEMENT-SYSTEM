const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET ALL EMPLOYEES (For a company)
router.get('/', async (req, res) => {
    const { companyName } = req.query;
    try {
        const [users] = await db.query('SELECT * FROM users WHERE company_name = ?', [companyName]);
        // Sanitize
        users.forEach(u => delete u.password);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching employees' });
    }
});

// GET USER BY ID
router.get('/:id', async (req, res) => {
    try {
        const [users] = await db.query('SELECT * FROM users WHERE id = ? OR login_id = ?', [req.params.id, req.params.id]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = users[0];
        delete user.password;

        // Parse JSON fields if any (skills could be stored as JSON string in DB, or comma separated)
        // For this implementation we treat skills as string in DB, split on frontend if needed, 
        // OR we can parse here if we stored as JSON.
        // Let's assume frontend sends/receives 'skills' as a string or array? 
        // Schema said TEXT. Let's send raw.

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile' });
    }
});

// UPDATE USER PROFILE
router.put('/:id', async (req, res) => {
    const {
        name, phone, jobTitle, department,
        about, skills, dob, nationality, address, gender, maritalStatus,
        bankName, accountNumber, ifsc, pan,
        monthlyWage, basicPercent, hraPercent, standardAllowance, pfRate, profTax
    } = req.body;

    try {
        // We can do a dynamic update or a massive one.
        // Be careful: Map frontend camelCase to backend snake_case
        await db.query(`
            UPDATE users SET 
                name=?, phone=?, job_title=?, department=?, 
                about=?, skills=?, dob=?, nationality=?, address=?, gender=?, marital_status=?,
                bank_name=?, account_number=?, ifsc=?, pan=?,
                monthly_wage=?, basic_percent=?, hra_percent=?, standard_allowance=?, pf_rate=?, prof_tax=?
            WHERE id = ?
        `, [
            name, phone, jobTitle, department,
            about, JSON.stringify(skills), dob, nationality, address, gender, maritalStatus,
            bankName, accountNumber, ifsc, pan,
            monthlyWage, basicPercent, hraPercent, standardAllowance, pfRate, profTax,
            req.params.id
        ]);

        const [updated] = await db.query('SELECT * FROM users WHERE id = ?', [req.params.id]);
        delete updated[0].password;
        res.json(updated[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating profile' });
    }
});

module.exports = router;
