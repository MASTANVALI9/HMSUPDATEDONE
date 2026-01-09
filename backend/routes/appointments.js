/**
 * Appointments Routes
 * CRUD operations for appointments
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation middleware
const appointmentValidation = [
    body('patientName').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('phone').trim().notEmpty().withMessage('Phone is required'),
    body('doctorId').notEmpty().withMessage('Doctor is required'),
    body('date').isDate().withMessage('Valid date is required'),
    body('time').notEmpty().withMessage('Time is required')
];

/**
 * POST /api/appointments
 * Create a new appointment
 */
router.post('/', appointmentValidation, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { patientName, email, phone, departmentId, doctorId, date, time, notes } = req.body;

        try {
            // First, check if user exists or create guest record
            let userId = null;
            const existingUser = await query('SELECT id FROM users WHERE email = $1', [email]);

            if (existingUser.rows.length > 0) {
                userId = existingUser.rows[0].id;
            }

            // Create appointment
            const result = await query(
                `INSERT INTO appointments (patient_id, patient_name, patient_email, patient_phone, doctor_id, appointment_date, appointment_time, notes, status)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending')
         RETURNING *`,
                [userId, patientName, email, phone, doctorId, date, time, notes || '']
            );

            res.status(201).json({
                success: true,
                message: 'Appointment booked successfully',
                data: result.rows[0]
            });
        } catch (dbError) {
            // Demo mode - just return success
            console.log('DB not available, returning demo response');
            res.status(201).json({
                success: true,
                message: 'Appointment booked successfully (demo mode)',
                data: {
                    id: Date.now(),
                    patientName,
                    email,
                    doctorId,
                    date,
                    time,
                    status: 'pending'
                },
                demo: true
            });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/appointments
 * Get appointments (for authenticated users)
 */
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        let sql, params;

        if (req.user.role === 'admin' || req.user.role === 'doctor') {
            sql = `SELECT a.*, d.name as doctor_name 
             FROM appointments a 
             LEFT JOIN doctors d ON a.doctor_id = d.id 
             ORDER BY a.appointment_date DESC, a.appointment_time DESC`;
            params = [];
        } else {
            sql = `SELECT a.*, d.name as doctor_name 
             FROM appointments a 
             LEFT JOIN doctors d ON a.doctor_id = d.id 
             WHERE a.patient_id = $1 OR a.patient_email = $2
             ORDER BY a.appointment_date DESC, a.appointment_time DESC`;
            params = [req.user.id, req.user.email];
        }

        const result = await query(sql, params);
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/appointments/:id
 * Get appointment by ID
 */
router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await query(
            `SELECT a.*, d.name as doctor_name, dep.name as department_name
       FROM appointments a
       LEFT JOIN doctors d ON a.doctor_id = d.id
       LEFT JOIN departments dep ON d.department_id = dep.id
       WHERE a.id = $1`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

/**
 * PATCH /api/appointments/:id/status
 * Update appointment status
 */
router.patch('/:id/status', authenticateToken, async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status' });
        }

        const result = await query(
            'UPDATE appointments SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
            [status, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: 'Appointment not found' });
        }

        res.json({ success: true, message: 'Status updated', data: result.rows[0] });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
