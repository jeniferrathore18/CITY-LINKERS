import express from 'express';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get dashboard analytics (admin)
router.get('/dashboard', authenticate, isAdmin, async (req, res) => {
  try {
    // Total users
    const usersResult = await query('SELECT COUNT(*) as count FROM users WHERE role = $1', ['user']);
    
    // Total tickets
    const ticketsResult = await query('SELECT COUNT(*) as count FROM tickets');
    
    // Total revenue
    const revenueResult = await query('SELECT SUM(fare) as total FROM tickets');
    
    // Active buses
    const busesResult = await query('SELECT COUNT(*) as count FROM buses WHERE status = $1', ['active']);
    
    // Recent tickets
    const recentTickets = await query(
      `SELECT t.*, u.name as user_name, r.name as route_name
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       JOIN routes r ON t.route_id = r.id
       ORDER BY t.created_at DESC
       LIMIT 10`
    );

    // Feedback stats
    const feedbackStats = await query(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_feedback
       FROM feedback`
    );

    res.json({
      stats: {
        totalUsers: parseInt(usersResult.rows[0].count),
        totalTickets: parseInt(ticketsResult.rows[0].count),
        totalRevenue: parseFloat(revenueResult.rows[0].total || 0),
        activeBuses: parseInt(busesResult.rows[0].count),
        avgRating: parseFloat(feedbackStats.rows[0].avg_rating || 0).toFixed(1),
        totalFeedback: parseInt(feedbackStats.rows[0].total_feedback)
      },
      recentTickets: recentTickets.rows
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

// Get revenue data (admin)
router.get('/revenue', authenticate, isAdmin, async (req, res) => {
  try {
    const result = await query(
      `SELECT DATE(created_at) as date, SUM(fare) as revenue, COUNT(*) as tickets
       FROM tickets
       WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date DESC`
    );

    res.json({ revenue: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue data' });
  }
});

export default router;
