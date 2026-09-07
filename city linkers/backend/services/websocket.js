import { WebSocketServer } from 'ws';

let wss;

export const initWebSocket = (server) => {
  wss = new WebSocketServer({ server });

  wss.on('connection', (ws) => {
    console.log('✅ WebSocket client connected');

    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message);
        console.log('Received:', data);

        // Handle different message types
        switch (data.type) {
          case 'subscribe':
            ws.subscribed = data.channel;
            break;
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });

    ws.on('close', () => {
      console.log('❌ WebSocket client disconnected');
    });

    // Send initial connection message
    ws.send(JSON.stringify({ 
      type: 'connected', 
      message: 'Connected to City Linkers WebSocket' 
    }));
  });

  console.log('✅ WebSocket server initialized');
};

// Broadcast bus location update
export const broadcastBusLocation = (busData) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) { // OPEN
      client.send(JSON.stringify({
        type: 'bus-location-update',
        data: busData
      }));
    }
  });
};

// Broadcast ticket minted
export const broadcastTicketMinted = (ticketData) => {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({
        type: 'ticket-minted',
        data: ticketData
      }));
    }
  });
};

export default { initWebSocket, broadcastBusLocation, broadcastTicketMinted };
