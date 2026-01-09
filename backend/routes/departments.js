/**
 * Departments Routes
 */

const express = require('express');
const { query } = require('../config/db');

const router = express.Router();

// Demo departments data
const demoDepartments = [
    { id: 1, name: "Cardiology", description: "Heart and cardiovascular care", icon: "heartbeat" },
    { id: 2, name: "Neurology", description: "Brain and nervous system care", icon: "brain" },
    { id: 3, name: "Oncology", description: "Cancer treatment and care", icon: "ribbon" },
    { id: 4, name: "Orthopedics", description: "Bone and joint care", icon: "bone" },
    { id: 5, name: "Pulmonology", description: "Lung and respiratory care", icon: "lungs" },
    { id: 6, name: "Gastroenterology", description: "Digestive system care", icon: "stomach" },
    { id: 7, name: "General Medicine", description: "Primary healthcare", icon: "stethoscope" }
];

/**
 * GET /api/departments
 * Get all departments
 */
router.get('/', async (req, res, next) => {
    try {
        try {
            const result = await query('SELECT * FROM departments ORDER BY name');
            res.json({ success: true, data: result.rows });
        } catch (dbError) {
            res.json({ success: true, data: demoDepartments, demo: true });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/departments/:id
 * Get department by ID
 */
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        try {
            const result = await query('SELECT * FROM departments WHERE id = $1', [id]);
            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Department not found' });
            }
            res.json({ success: true, data: result.rows[0] });
        } catch (dbError) {
            const dept = demoDepartments.find(d => d.id === parseInt(id));
            if (!dept) {
                return res.status(404).json({ success: false, message: 'Department not found' });
            }
            res.json({ success: true, data: dept, demo: true });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
