export class WelcomePage {
  render() {
    this.root = document.createElement('div')
    this.root.innerHTML = `
      <div class="welcome-container">
        <div class="welcome-content">
          <div class="welcome-logo">
            <img src="./logo.jpeg" alt="City Linkers" class="welcome-logo-img" />
          </div>
          <h1 class="welcome-title">Welcome to City Linkers</h1>
          <p class="welcome-subtitle">Smart Transit at Your Fingertips</p>
          
          <div class="portal-selection">
            <div class="portal-card" id="userPortal">
              <div class="portal-icon">👤</div>
              <h3>User Portal</h3>
              <p>Track buses, buy tickets, and plan your journey</p>
              <div class="portal-arrow">→</div>
            </div>
            
            <div class="portal-card" id="adminPortal">
              <div class="portal-icon">🔐</div>
              <h3>Admin Portal</h3>
              <p>Manage operations and view analytics</p>
              <div class="portal-arrow">→</div>
            </div>
          </div>
          
          <div class="welcome-footer">
            <p>Real-time GPS tracking • Blockchain e-ticketing • Transparent operations</p>
          </div>
        </div>
      </div>
    `
    return this.root
  }

  afterRender() {
    const userPortal = this.root.querySelector('#userPortal')
    const adminPortal = this.root.querySelector('#adminPortal')

    userPortal.addEventListener('click', () => {
      window.location.hash = '#/user-login'
    })

    adminPortal.addEventListener('click', () => {
      window.location.hash = '#/admin-login'
    })
  }
}
