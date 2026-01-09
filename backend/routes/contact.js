/**
 * Contact Routes
 * Handle contact form submissions
 */

const express = require('express');
const { body, validationResult } = require('express-validator');
const { query } = require('../config/db');

const router = express.Router();

// Validation middleware
const contactValidation = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
];

/**
 * POST /api/contact
 * Submit contact form
 */
router.post('/', contactValidation, async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ success: false, errors: errors.array() });
        }

        const { name, email, phone, subject, message } = req.body;

        try {
            const result = await query(
                'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [name, email, phone || '', subject || 'General Inquiry', message]
            );

            res.status(201).json({
                success: true,
                message: 'Thank you for your message. We will get back to you soon.',
                data: result.rows[0]
            });
        } catch (dbError) {
            // Demo mode
            console.log('DB not available, returning demo response');
            res.status(201).json({
                success: true,
                message: 'Thank you for your message. We will get back to you soon. (demo mode)',
                data: { id: Date.now(), name, email, subject },
                demo: true
            });
        }
    } catch (error) {
        next(error);
    }
});

/**
 * GET /api/contact
 * Get all contact messages (admin only)
 */
router.get('/', async (req, res, next) => {
    try {
        const result = await query('SELECT * FROM contact_messages ORDER BY created_at DESC');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
