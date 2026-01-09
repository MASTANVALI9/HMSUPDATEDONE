/**
 * Doctors Routes
 * CRUD operations for doctors
 */

const express = require('express');
const { query } = require('../config/db');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

const router = express.Router();

// Demo doctors data (fallback when DB not available)
const demoDoctors = [
    { id: 1, name: "Dr. Sarah Johnson", department: "Cardiology", specialization: "Interventional Cardiologist", experience_years: 15, photo_url: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300&h=300&fit=crop", availability: "available", availability_text: "Available Today" },
    { id: 2, name: "Dr. Michael Chen", department: "Neurology", specialization: "Neurologist & Stroke Specialist", experience_years: 12, photo_url: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=300&h=300&fit=crop", availability: "available", availability_text: "Available Today" },
    { id: 3, name: "Dr. Emily Rodriguez", department: "Oncology", specialization: "Medical Oncologist", experience_years: 18, photo_url: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=300&h=300&fit=crop", availability: "available", availability_text: "Available Tomorrow" },
    { id: 4, name: "Dr. James Wilson", department: "Orthopedics", specialization: "Orthopedic Surgeon", experience_years: 20, photo_url: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&h=300&fit=crop", availability: "busy", availability_text: "Next Available: Monday" },
    { id: 5, name: "Dr. Amanda Foster", department: "Pulmonology", specialization: "Pulmonologist", experience_years: 10, photo_url: "https://images.unsplash.com/photo-1651008376811-b90baee60c1f?w=300&h=300&fit=crop", availability: "available", availability_text: "Available Today" },
    { id: 6, name: "Dr. Robert Kumar", department: "Gastroenterology", specialization: "Gastroenterologist", experience_years: 14, photo_url: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300&h=300&fit=crop", availability: "available", availability_text: "Available Today" },
    { id: 7, name: "Dr. Lisa Thompson", department: "General Medicine", specialization: "Internal Medicine Specialist", experience_years: 8, photo_url: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?w=300&h=300&fit=crop", availability: "available", availability_text: "Available Today" },
    { id: 8, name: "Dr. David Park", department: "Cardiology", specialization: "Cardiac Electrophysiologist", experience_years: 16, photo_url: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=300&h=300&fit=crop", availability: "busy", availability_text: "Next Available: Wednesday" }
];

/**
 * GET /api/doctors
 * Get all doctors, optionally filtered by department
 */
router.get('/', async (req, res, next) => {
    try {
        const { department } = req.query;

        try {
            let sql = 'SELECT d.*, dep.name as department FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id WHERE d.is_active = true';
            const params = [];

            if (department && department !== 'all') {
                sql += ' AND LOWER(dep.name) = LOWER($1)';
                params.push(department);
            }

            sql += ' ORDER BY d.name';
            const result = await query(sql, params);
            res.json({ success: true, data: result.rows });
        } catch (dbError) {
            // Fallback to demo data
            let doctors = demoDoctors;
            if (department && department !== 'all') {
                doctors = demoDoctors.filter(d => d.department.toLowerCase() === department.toLowerCase());
            }
            res.json({ success: true, data: doctors, demo: true });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/doctors/:id
 * Get doctor by ID
 */
router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        try {
            const result = await query(
                'SELECT d.*, dep.name as department FROM doctors d LEFT JOIN departments dep ON d.department_id = dep.id WHERE d.id = $1',
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Doctor not found' });
            }
            res.json({ success: true, data: result.rows[0] });
        } catch (dbError) {
            const doctor = demoDoctors.find(d => d.id === parseInt(id));
            if (!doctor) {
                return res.status(404).json({ success: false, message: 'Doctor not found' });
            }
            res.json({ success: true, data: doctor, demo: true });
        }
    } catch (error) {
        next(error);
    }
});

module.exports = router;
