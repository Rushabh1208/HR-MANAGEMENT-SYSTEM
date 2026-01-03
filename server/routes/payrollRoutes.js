const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET PAYSLIPS
router.get('/', async (req, res) => {
    const { userId, companyName } = req.query;
    try {
        // Get Pay slips
        // Join with users to check company
        let query = 'SELECT p.*, u.name, u.job_title, u.department, u.monthly_wage FROM payroll p JOIN users u ON p.user_id = u.id WHERE u.company_name = ?';
        const params = [companyName];

        if (userId) {
            query += ' AND p.user_id = ?';
            params.push(userId);
        }

        const [slips] = await db.query(query, params);
        res.json(slips);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GENERATE PAYSLIP (Admin action)
router.post('/generate', async (req, res) => {
    const { userId, month, year, salaryDetails } = req.body;
    // salaryDetails is the full JSON object calculated on frontend or backend.
    // Ideally backend, but taking shortcuts for migration fidelity to frontend logic.
    // For now we persist the calculated values.

    try {
        const { basic, hra, standard, performanceBonus, lta, fixed, pf, profTax, net } = salaryDetails;
        const allowances = standard + performanceBonus + lta + fixed;
        const deductions = pf + profTax;

        await db.query(
            `INSERT INTO payroll (user_id, month, year, basic_salary, hra, allowances, deductions, net_salary, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'Released')`,
            [userId, month, year, basic, hra, allowances, deductions, net]
        );

        res.status(201).json({ message: 'Payslip generated' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
