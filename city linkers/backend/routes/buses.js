import express from 'express';
import { query } from '../config/database.js';
import { authenticate, isAdmin } from '../middleware/auth.js';

const router = express.Router();

// Get all buses
router.get('/', async (req, res) => {
  try {
    const result = await query(
      `SELECT b.*, r.name as route_name 
       FROM buses b 
       LEFT JOIN routes r ON b.route_id = r.id 
       WHERE b.status = 'active'`
    );
    res.json({ buses: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Get buses by route
router.get('/route/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const result = await query(
      'SELECT * FROM buses WHERE route_id = $1 AND status = $2',
      [routeId, 'active']
    );
    res.json({ buses: result.rows });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch buses' });
  }
});

// Update bus location (admin/system)
router.put('/:id/location', authenticate, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, speed, current_occupancy } = req.body;

    const result = await query(
      `UPDATE buses 
       SET latitude = $1, longitude = $2, speed = $3, current_occupancy = $4, last_updated = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING *`,
      [latitude, longitude, speed, current_occupancy, id]
    );

    res.json({ bus: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bus location' });
  }
});

export default router;
