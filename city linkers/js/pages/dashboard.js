import { routes, buses, revenue, tripLogs, logTripOnChain } from '../data/mock.js'
import { initMap, updateBusMarkers, fitToBuses } from '../utils/map.js'
import { analyticsAPI, ticketAPI, feedbackAPI } from '../services/api.js'
import { showToast } from '../utils/ui.js'

export class DashboardPage{
  render(){
    const root = document.createElement('div')
    root.innerHTML = `
      <div class="dashboard-header">
        <h1 class="dashboard-title">Admin Dashboard</h1>
        <button class="btn primary" id="refreshData">🔄 Refresh Data</button>
      </div>

      <div class="grid cols-4" style="margin-top:16px">
        <div class="card kpi">
          <div class="stat-icon">👥</div>
          <div class="value" id="totalUsers">-</div>
          <div class="label">Total Users</div>
        </div>
        <div class="card kpi">
          <div class="stat-icon">🎫</div>
          <div class="value" id="totalTickets">-</div>
          <div class="label">Tickets Sold</div>
        </div>
        <div class="card kpi">
          <div class="stat-icon">💰</div>
          <div class="value" id="totalRevenue">-</div>
          <div class="label">Total Revenue</div>
        </div>
        <div class="card kpi">
          <div class="stat-icon">⭐</div>
          <div class="value" id="avgRating">-</div>
          <div class="label">Avg Rating</div>
        </div>
      </div>

      <div class="grid cols-2" style="margin-top:16px">
        <div class="card">
          <div class="section-title">📊 Revenue Trend (30 Days)</div>
          <canvas id="revChart" height="140"></canvas>
        </div>
        <div class="card">
          <div class="section-title">🚍 Fleet Status</div>
          <div id="fleetMap" class="map" style="height:200px"></div>
        </div>
      </div>

      <div class="card" style="margin-top:16px">
        <div class="section-title">
          🎫 All Tickets Booked (Real-Time)
          <span class="badge" id="ticketCount">0</span>
        </div>
        <div style="margin-bottom:12px">
          <button class="btn ghost" id="exportTickets">📥 Export CSV</button>
          <button class="btn ghost" id="filterToday">📅 Today</button>
          <button class="btn ghost" id="filterAll">📋 All</button>
        </div>
        <div id="ticketsContainer" style="max-height:400px; overflow:auto">
          <div class="loading-spinner">Loading tickets...</div>
        </div>
      </div>

      <div class="grid cols-2" style="margin-top:16px">
        <div class="card">
          <div class="section-title">💬 Recent Feedback</div>
          <div id="feedbackContainer" style="max-height:300px; overflow:auto">
            <div class="loading-spinner">Loading feedback...</div>
          </div>
        </div>
        <div class="card">
          <div class="section-title">📈 Quick Stats</div>
          <div id="quickStats">
            <div class="loading-spinner">Loading stats...</div>
          </div>
        </div>
      </div>
    `
    this.root = root
    return root
  }
  async afterRender(){
    let allTickets = []
    let allFeedback = []
    
    // Load dashboard data
    const loadDashboardData = async () => {
      try {
        // Try to get data from backend
        const dashboardData = await analyticsAPI.getDashboard()
        
        // Update KPIs
        this.root.querySelector('#totalUsers').textContent = dashboardData.stats.totalUsers
        this.root.querySelector('#totalTickets').textContent = dashboardData.stats.totalTickets
        this.root.querySelector('#totalRevenue').textContent = `₹${dashboardData.stats.totalRevenue.toFixed(2)}`
        this.root.querySelector('#avgRating').textContent = dashboardData.stats.avgRating
        
        // Load all tickets
        const ticketsData = await ticketAPI.getAll()
        allTickets = ticketsData.tickets || []
        renderTickets(allTickets)
        
        // Load feedback
        const feedbackData = await feedbackAPI.getAll()
        allFeedback = feedbackData.feedback || []
        renderFeedback(allFeedback)
        
        // Load revenue chart
        const revenueData = await analyticsAPI.getRevenue()
        renderRevenueChart(revenueData.revenue || [])
        
        showToast('Dashboard data loaded')
      } catch (error) {
        console.warn('Backend unavailable, using mock data:', error)
        showToast('Using offline mode')
        loadMockData()
      }
    }
    
    // Fallback mock data
    const loadMockData = () => {
      this.root.querySelector('#totalUsers').textContent = '3'
      this.root.querySelector('#totalTickets').textContent = '0'
      this.root.querySelector('#totalRevenue').textContent = '₹0.00'
      this.root.querySelector('#avgRating').textContent = '0.0'
      
      allTickets = []
      renderTickets([])
      renderFeedback([])
      
      // Mock revenue chart
      const ctx = this.root.querySelector('#revChart')
      new Chart(ctx, { 
        type: 'line', 
        data: { 
          labels: revenue.daily.map(x=>x.day), 
          datasets:[{ 
            label:'Revenue (₹)', 
            data: revenue.daily.map(x=>x.amount), 
            borderColor:'#4F46E5', 
            backgroundColor:'rgba(79,70,229,0.1)', 
            tension:.4, 
            fill:true 
          }]
        }, 
        options:{ 
          responsive: true,
          plugins:{legend:{display:true}}, 
          scales:{ 
            x:{ ticks:{color:'#6B7280'}}, 
            y:{ ticks:{color:'#6B7280'}}
          }
        } 
      })
    }
    
    // Render tickets table
    const renderTickets = (tickets) => {
      const container = this.root.querySelector('#ticketsContainer')
      this.root.querySelector('#ticketCount').textContent = tickets.length
      
      if (tickets.length === 0) {
        container.innerHTML = '<div class="empty-state">📭 No tickets booked yet</div>'
        return
      }
      
      container.innerHTML = `
        <table class="table tickets-table">
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>User</th>
              <th>Route</th>
              <th>From → To</th>
              <th>Passengers</th>
              <th>Fare</th>
              <th>Status</th>
              <th>Date</th>
              <th>Blockchain</th>
            </tr>
          </thead>
          <tbody>
            ${tickets.map(ticket => `
              <tr class="ticket-row ${ticket.status === 'active' ? 'active-ticket' : ''}">
                <td><code>${ticket.ticket_id || ticket.id}</code></td>
                <td>${ticket.user_name || 'User #' + ticket.user_id}</td>
                <td><span class="route-badge">${ticket.route_name || ticket.route_id}</span></td>
                <td>${ticket.from_stop_name || 'Stop ' + ticket.from_stop_id} → ${ticket.to_stop_name || 'Stop ' + ticket.to_stop_id}</td>
                <td>${ticket.passengers}</td>
                <td><strong>₹${parseFloat(ticket.fare).toFixed(2)}</strong></td>
                <td><span class="status-badge ${ticket.status}">${ticket.status}</span></td>
                <td>${new Date(ticket.created_at).toLocaleString()}</td>
                <td>
                  ${ticket.blockchain_tx_hash ? 
                    `<span class="blockchain-badge" title="${ticket.blockchain_tx_hash}">✓ Verified</span>` : 
                    '<span class="blockchain-badge pending">Pending</span>'}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `
    }
    
    // Render feedback
    const renderFeedback = (feedback) => {
      const container = this.root.querySelector('#feedbackContainer')
      
      if (feedback.length === 0) {
        container.innerHTML = '<div class="empty-state">💬 No feedback yet</div>'
        return
      }
      
      container.innerHTML = feedback.slice(0, 10).map(fb => `
        <div class="feedback-item">
          <div class="feedback-header">
            <div class="feedback-rating">${'⭐'.repeat(fb.rating)}</div>
            <div class="feedback-date">${new Date(fb.created_at).toLocaleDateString()}</div>
          </div>
          <div class="feedback-text">${fb.feedback_text}</div>
          <div class="feedback-user">${fb.user_name || 'Anonymous'} ${fb.email ? `(${fb.email})` : ''}</div>
        </div>
      `).join('')
    }
    
    // Render revenue chart
    const renderRevenueChart = (revenueData) => {
      const ctx = this.root.querySelector('#revChart')
      
      if (revenueData.length === 0) {
        // Use mock data
        revenueData = revenue.daily
      }
      
      new Chart(ctx, { 
        type: 'line', 
        data: { 
          labels: revenueData.map(x => x.date || x.day), 
          datasets:[{ 
            label:'Revenue (₹)', 
            data: revenueData.map(x => x.revenue || x.amount), 
            borderColor:'#4F46E5', 
            backgroundColor:'rgba(79,70,229,0.1)', 
            tension:.4, 
            fill:true 
          }]
        }, 
        options:{ 
          responsive: true,
          plugins:{legend:{display:true}}, 
          scales:{ 
            x:{ ticks:{color:'#6B7280'}}, 
            y:{ ticks:{color:'#6B7280'}}
          }
        } 
      })
    }
    
    // Filter tickets
    const filterTickets = (filter) => {
      let filtered = allTickets
      if (filter === 'today') {
        const today = new Date().toDateString()
        filtered = allTickets.filter(t => new Date(t.created_at).toDateString() === today)
      }
      renderTickets(filtered)
    }
    
    // Export tickets CSV
    const exportTicketsCSV = () => {
      if (allTickets.length === 0) {
        showToast('No tickets to export')
        return
      }
      
      const header = ['Ticket ID', 'User', 'Route', 'From', 'To', 'Passengers', 'Fare', 'Status', 'Date', 'Blockchain TX']
      const rows = allTickets.map(t => [
        t.ticket_id || t.id,
        t.user_name || 'User #' + t.user_id,
        t.route_name || t.route_id,
        t.from_stop_name || t.from_stop_id,
        t.to_stop_name || t.to_stop_id,
        t.passengers,
        t.fare,
        t.status,
        new Date(t.created_at).toISOString(),
        t.blockchain_tx_hash || 'N/A'
      ])
      
      const csv = [header, ...rows].map(r => r.map(v => `"${String(v).replaceAll('"', '""')}"`).join(',')).join('\n')
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tickets_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showToast('Tickets exported successfully')
    }
    
    // Event listeners
    this.root.querySelector('#refreshData').addEventListener('click', loadDashboardData)
    this.root.querySelector('#exportTickets').addEventListener('click', exportTicketsCSV)
    this.root.querySelector('#filterToday').addEventListener('click', () => filterTickets('today'))
    this.root.querySelector('#filterAll').addEventListener('click', () => filterTickets('all'))
    
    // Fleet map
    this.map = initMap('fleetMap')
    const renderMap = () => { 
      updateBusMarkers(buses)
      fitToBuses(buses) 
    }
    renderMap()
    document.addEventListener('buses:update', renderMap)
    
    // Initial load
    await loadDashboardData()
    
    // Auto-refresh every 30 seconds
    this.refreshInterval = setInterval(loadDashboardData, 30000)
  }
  
  cleanup() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval)
    }
  }
}
