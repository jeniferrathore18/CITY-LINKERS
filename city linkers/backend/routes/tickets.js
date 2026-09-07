import express from 'express';
import { query } from '../config/database.js';
import { mintTicketOnChain, verifyTicketOnChain } from '../config/blockchain.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// Purchase ticket
router.post('/purchase', authenticate, async (req, res) => {
  try {
    const { routeId, fromStopId, toStopId, passengers } = req.body;
    const userId = req.user.userId;

    // Validate input
    if (!routeId || !fromStopId || !toStopId || !passengers) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get route details
    const routeResult = await query(
      'SELECT fare_base, fare_per_stop FROM routes WHERE id = $1',
      [routeId]
    );

    if (routeResult.rows.length === 0) {
      return res.status(404).json({ error: 'Route not found' });
    }

    const route = routeResult.rows[0];

    // Get stop sequences
    const fromStop = await query(
      'SELECT sequence_order FROM stops WHERE id = $1',
      [fromStopId]
    );
    const toStop = await query(
      'SELECT sequence_order FROM stops WHERE id = $1',
      [toStopId]
    );

    if (fromStop.rows.length === 0 || toStop.rows.length === 0) {
      return res.status(404).json({ error: 'Stops not found' });
    }

    // Calculate fare
    const stopDistance = Math.abs(toStop.rows[0].sequence_order - fromStop.rows[0].sequence_order);
    const fare = (parseFloat(route.fare_base) + (stopDistance * parseFloat(route.fare_per_stop))) * passengers;

    // Generate ticket ID
    const ticketId = `TKT-${Date.now()}-${userId}`;

    // Create ticket data for blockchain
    const ticketData = {
      ticketId,
      userId,
      routeId,
      fromStopId,
      toStopId,
      passengers,
      fare,
      timestamp: Date.now()
    };

    // Mint on blockchain
    const blockchainResult = await mintTicketOnChain(ticketId, ticketData);

    // Save to database
    const result = await query(
      `INSERT INTO tickets (ticket_id, user_id, route_id, from_stop_id, to_stop_id, passengers, fare, blockchain_tx_hash, blockchain_token_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        ticketId,
        userId,
        routeId,
        fromStopId,
        toStopId,
        passengers,
        fare,
        blockchainResult.transactionHash || null,
        blockchainResult.tokenId || null,
        'active'
      ]
    );

    res.status(201).json({
      message: 'Ticket purchased successfully',
      ticket: result.rows[0],
      blockchain: blockchainResult
    });
  } catch (error) {
    console.error('Ticket purchase error:', error);
    res.status(500).json({ error: 'Failed to purchase ticket' });
  }
});

// Get user tickets
router.get('/user/:userId', authenticate, async (req, res) => {
  try {
    const { userId } = req.params;

    // Check authorization
    if (req.user.userId !== parseInt(userId) && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const result = await query(
      `SELECT t.*, r.name as route_name, 
              fs.name as from_stop_name, ts.name as to_stop_name
       FROM tickets t
       JOIN routes r ON t.route_id = r.id
       JOIN stops fs ON t.from_stop_id = fs.id
       JOIN stops ts ON t.to_stop_id = ts.id
       WHERE t.user_id = $1
       ORDER BY t.created_at DESC`,
      [userId]
    );

    res.json({ tickets: result.rows });
  } catch (error) {
    console.error('Get tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

// Verify ticket on blockchain
router.get('/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;

    // Get ticket from database
    const result = await query(
      'SELECT blockchain_token_id FROM tickets WHERE id = $1',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket not found' });
    }

    const tokenId = result.rows[0].blockchain_token_id;

    if (!tokenId) {
      return res.status(400).json({ error: 'Ticket not on blockchain' });
    }

    // Verify on blockchain
    const verification = await verifyTicketOnChain(tokenId);

    res.json({ verification });
  } catch (error) {
    console.error('Ticket verification error:', error);
    res.status(500).json({ error: 'Failed to verify ticket' });
  }
});

// Get all tickets (admin)
router.get('/', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const result = await query(
      `SELECT t.*, u.name as user_name, r.name as route_name
       FROM tickets t
       JOIN users u ON t.user_id = u.id
       JOIN routes r ON t.route_id = r.id
       ORDER BY t.created_at DESC
       LIMIT 100`
    );

    res.json({ tickets: result.rows });
  } catch (error) {
    console.error('Get all tickets error:', error);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
});

export default router;
