// API Configuration
const API_BASE_URL = 'http://localhost:5001/api';
const WS_URL = 'ws://localhost:5001';

// Get auth token from session
const getToken = () => {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}');
  return user.token || null;
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers
    },
    ...options
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Request failed');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// Authentication API
export const authAPI = {
  signup: async (name, identifier, password) => {
    const isEmail = identifier.includes('@');
    return apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        name,
        [isEmail ? 'email' : 'phone']: identifier,
        password
      })
    });
  },

  signin: async (identifier, password) => {
    return apiRequest('/auth/signin', {
      method: 'POST',
      body: JSON.stringify({ identifier, password })
    });
  },

  verify: async () => {
    return apiRequest('/auth/verify');
  }
};

// User API
export const userAPI = {
  getProfile: async () => {
    return apiRequest('/users/profile');
  },

  updateProfile: async (data) => {
    return apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
};

// Bus API
export const busAPI = {
  getAll: async () => {
    return apiRequest('/buses');
  },

  getByRoute: async (routeId) => {
    return apiRequest(`/buses/route/${routeId}`);
  },

  updateLocation: async (busId, location) => {
    return apiRequest(`/buses/${busId}/location`, {
      method: 'PUT',
      body: JSON.stringify(location)
    });
  }
};

// Route API
export const routeAPI = {
  getAll: async () => {
    return apiRequest('/routes');
  },

  getById: async (id) => {
    return apiRequest(`/routes/${id}`);
  },

  getStops: async (id) => {
    return apiRequest(`/routes/${id}/stops`);
  }
};

// Ticket API
export const ticketAPI = {
  purchase: async (ticketData) => {
    return apiRequest('/tickets/purchase', {
      method: 'POST',
      body: JSON.stringify(ticketData)
    });
  },

  getUserTickets: async (userId) => {
    return apiRequest(`/tickets/user/${userId}`);
  },

  verify: async (ticketId) => {
    return apiRequest(`/tickets/${ticketId}/verify`);
  },

  getAll: async () => {
    return apiRequest('/tickets');
  }
};

// Feedback API
export const feedbackAPI = {
  submit: async (feedbackData) => {
    return apiRequest('/feedback', {
      method: 'POST',
      body: JSON.stringify(feedbackData)
    });
  },

  getAll: async () => {
    return apiRequest('/feedback');
  }
};

// Analytics API
export const analyticsAPI = {
  getDashboard: async () => {
    return apiRequest('/analytics/dashboard');
  },

  getRevenue: async () => {
    return apiRequest('/analytics/revenue');
  }
};

// WebSocket connection
let ws = null;

export const connectWebSocket = (onMessage) => {
  if (ws && ws.readyState === WebSocket.OPEN) {
    return ws;
  }

  ws = new WebSocket(WS_URL);

  ws.onopen = () => {
    console.log('✅ WebSocket connected');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (onMessage) onMessage(data);
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  };

  ws.onerror = (error) => {
    console.error('❌ WebSocket error:', error);
  };

  ws.onclose = () => {
    console.log('❌ WebSocket disconnected');
    // Reconnect after 5 seconds
    setTimeout(() => connectWebSocket(onMessage), 5000);
  };

  return ws;
};

export const disconnectWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

export default {
  authAPI,
  userAPI,
  busAPI,
  routeAPI,
  ticketAPI,
  feedbackAPI,
  analyticsAPI,
  connectWebSocket,
  disconnectWebSocket
};
