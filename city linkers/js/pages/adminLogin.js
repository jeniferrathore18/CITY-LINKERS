import { showToast } from '../utils/ui.js'
import { authAPI } from '../services/api.js'

// Mock admin database - supports both email and phone
const admins = {
  'admin@citylinkers.com': { name: 'Admin User', role: 'admin', password: 'admin123' },
  '+919876543210': { name: 'Admin User', role: 'admin', password: 'admin123' },
}

const USE_BACKEND = true; // Backend enabled - will fallback to mock if unavailable

export class AdminLoginPage {
  render() {
    this.root = document.createElement('div')
    this.root.innerHTML = `
      <div class="login-container">
        <div class="login-card admin-card">
          <div class="login-back">
            <a href="#/" class="back-link">← Back to Portal Selection</a>
          </div>
          
          <div class="login-header">
            <div class="login-icon admin-icon">🔐</div>
            <h1>Admin Portal Sign In</h1>
            <p>Authorized personnel only</p>
          </div>
          
          <div id="signInForm" class="login-step">
            <div class="field">
              <label for="identifier">Admin Email or Phone Number</label>
              <input id="identifier" class="input" type="text" placeholder="admin@citylinkers.com or +91 98765 43210" />
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" class="input" type="password" placeholder="Enter admin password" />
            </div>
            <button class="btn primary btn-full admin-btn" id="signInBtn">Sign In</button>
          </div>

          <div class="login-footer">
            <p>Demo: admin@citylinkers.com / admin123</p>
          </div>
        </div>
      </div>
    `
    return this.root
  }

  afterRender() {
    const identifierInput = this.root.querySelector('#identifier')
    const passwordInput = this.root.querySelector('#password')
    const signInBtn = this.root.querySelector('#signInBtn')

    // Sign In
    signInBtn.addEventListener('click', async () => {
      const identifier = identifierInput.value.trim()
      const password = passwordInput.value.trim()

      if (!identifier || !password) {
        showToast('Please enter both email/phone and password')
        return
      }

      signInBtn.disabled = true
      signInBtn.textContent = 'Signing in...'

      try {
        if (USE_BACKEND) {
          try {
            // Try backend API first
            const response = await authAPI.signin(identifier, password)
            sessionStorage.setItem('user', JSON.stringify({ 
              ...response.user,
              token: response.token
            }))
            showToast(`Welcome ${response.user.name}!`)
            window.location.hash = '#/dashboard'
            return
          } catch (backendError) {
            console.warn('Backend unavailable, using mock data:', backendError.message)
            showToast('Using offline mode')
          }
        }
        
        // Fallback to mock data
        const admin = admins[identifier]
        if (!admin) {
          throw new Error('Unauthorized. Admin access only.')
        }

        if (admin.password !== password) {
          throw new Error('Incorrect password')
        }

        sessionStorage.setItem('user', JSON.stringify({ 
          name: admin.name,
          role: admin.role,
          identifier: identifier
        }))
        showToast(`Welcome ${admin.name}!`)
        window.location.hash = '#/dashboard'
      } catch (error) {
        showToast(error.message)
        signInBtn.disabled = false
        signInBtn.textContent = 'Sign In'
      }
    })

    // Enter key support
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') signInBtn.click()
    })
  }
}
