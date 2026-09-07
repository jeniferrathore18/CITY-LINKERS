export class HomePage{
  render(){
    const root = document.createElement('div')
    root.innerHTML = `
      <section class="hero-modern">
        <div class="hero-content">
          <h1 class="hero-title">Smart Transit at Your Fingertips</h1>
          <p class="hero-subtitle">Experience real-time GPS bus tracking with blockchain-secured e-ticketing. Plan your journey, track buses live, and travel with confidence.</p>
          <div class="actions">
            <a class="btn cta primary" href="#/tracking">Track Your Bus</a>
            <a class="btn cta pink" href="#/ticketing">Buy Ticket</a>
          </div>
        </div>
        <div class="hero-stats">
          <div class="stat-card">
            <div class="stat-icon">🚍</div>
            <div class="stat-value">3</div>
            <div class="stat-label">Active Routes</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📍</div>
            <div class="stat-value">3</div>
            <div class="stat-label">Live Buses</div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">⚡</div>
            <div class="stat-value">28 km/h</div>
            <div class="stat-label">Avg Speed</div>
          </div>
        </div>
      </section>

      <section class="features-section">
        <h2 class="section-heading">Why Choose City Linkers?</h2>
        <div class="feature-grid">
          <div class="feature-card">
            <div class="feature-icon">🗺️</div>
            <h3 class="feature-title">Real‑time Tracking</h3>
            <p class="feature-desc">Live maps with routes, stops, ETAs, and occupancy. Never miss your bus again.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">🔐</div>
            <h3 class="feature-title">Secure E‑Ticketing</h3>
            <p class="feature-desc">Tickets recorded with immutable blockchain references for complete transparency.</p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">📈</div>
            <h3 class="feature-title">Transparent Operations</h3>
            <p class="feature-desc">Dashboards, analytics, and tamper‑evident trip logs for authorities.</p>
          </div>
        </div>
      </section>
    `
    return root
  }
}
