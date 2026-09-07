import express from 'express';
import { query } from '../config/database.js';

const router = express.Router();

// Get all routes
router.get('/', async (req, res) => {
  try {
    const result = await query('SELECT * FROM routes WHERE active = true');
    res.json({ routes: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch routes' });
  }
});

// Get route by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM routes WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    res.json({ route: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch route' });
  }
});

// Get stops for a route
router.get('/:id/stops', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await query(
      'SELECT * FROM stops WHERE route_id = $1 ORDER BY sequence_order',
      [id]
    );
    res.json({ stops: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stops' });
  }
});

export default router;
