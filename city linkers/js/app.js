import { Router } from './router.js'
import { WelcomePage } from './pages/welcome.js'
import { UserLoginPage } from './pages/userLogin.js'
import { AdminLoginPage } from './pages/adminLogin.js'
import { HomePage } from './pages/home.js'
import { TrackingPage } from './pages/tracking.js'
import { TicketingPage } from './pages/ticketing.js'
import { DashboardPage } from './pages/dashboard.js'
import { showToast, toggleMobileNav } from './utils/ui.js'
import { startSimulation } from './data/mock.js'

// Router setup
const routes = {
  '/': WelcomePage,
  '/user-login': UserLoginPage,
  '/admin-login': AdminLoginPage,
  '/home': HomePage,
  '/tracking': TrackingPage,
  '/ticketing': TicketingPage,
  '/dashboard': DashboardPage,
}

const router = new Router({ mountId: 'app', routes })
router.init()

// UI setup
const yearEl = document.getElementById('year'); if (yearEl) yearEl.textContent = new Date().getFullYear()
const hamburger = document.getElementById('hamburger'); if (hamburger) hamburger.addEventListener('click', toggleMobileNav)

// Auth state management
function updateAuthUI() {
  const user = JSON.parse(sessionStorage.getItem('user') || '{}')
  const homeLink = document.getElementById('homeLink')
  const trackingLink = document.getElementById('trackingLink')
  const ticketingLink = document.getElementById('ticketingLink')
  const dashboardLink = document.getElementById('dashboardLink')
  const logoutBtn = document.getElementById('logoutBtn')
  
  if (user.role === 'user') {
    // User portal - show user navigation
    homeLink.style.display = 'block'
    trackingLink.style.display = 'block'
    ticketingLink.style.display = 'block'
    dashboardLink.style.display = 'none'
    logoutBtn.style.display = 'block'
  } else if (user.role === 'admin') {
    // Admin portal - show admin navigation
    homeLink.style.display = 'none'
    trackingLink.style.display = 'none'
    ticketingLink.style.display = 'none'
    dashboardLink.style.display = 'block'
    logoutBtn.style.display = 'block'
  } else {
    // Not logged in - hide all navigation
    homeLink.style.display = 'none'
    trackingLink.style.display = 'none'
    ticketingLink.style.display = 'none'
    dashboardLink.style.display = 'none'
    logoutBtn.style.display = 'none'
  }
}

// Logout functionality
document.getElementById('logoutBtn').addEventListener('click', () => {
  sessionStorage.removeItem('user')
  updateAuthUI()
  window.location.hash = '#/'
  showToast('Logged out successfully')
})

// Update auth UI on page load and hash change
updateAuthUI()
window.addEventListener('hashchange', updateAuthUI)

// Mock data simulation
startSimulation()

// Welcome toast
setTimeout(() => showToast('Welcome! Live bus simulation is running.'), 600)
