import express from 'express';
import { query } from '../config/database.js';
import { authenticate, optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Submit feedback
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { rating, feedback_text, email } = req.body;
    const userId = req.user?.userId || null;

    if (!rating || !feedback_text) {
      return res.status(400).json({ error: 'Rating and feedback text required' });
    }

    const result = await query(
      `INSERT INTO feedback (user_id, rating, feedback_text, email)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [userId, rating, feedback_text, email]
    );

    res.status(201).json({ 
      message: 'Feedback submitted successfully',
      feedback: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Get all feedback (admin)
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await query(
      `SELECT f.*, u.name as user_name 
       FROM feedback f
       LEFT JOIN users u ON f.user_id = u.id
       ORDER BY f.created_at DESC`
    );

    res.json({ feedback: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

export default router;
