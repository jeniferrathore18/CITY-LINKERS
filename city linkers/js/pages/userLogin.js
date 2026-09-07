import { showToast } from '../utils/ui.js'
import { authAPI } from '../services/api.js'

// Fallback mock data if backend is not available
const users = {
  'john@example.com': { name: 'John Doe', role: 'user', password: 'password123' },
  'jane@example.com': { name: 'Jane Smith', role: 'user', password: 'password123' },
  '+919876543211': { name: 'John Doe', role: 'user', password: 'password123' },
  '+919876543212': { name: 'Jane Smith', role: 'user', password: 'password123' },
}

const USE_BACKEND = true; // Backend enabled - will fallback to mock if unavailable

export class UserLoginPage {
  render() {
    this.root = document.createElement('div')
    this.root.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-back">
            <a href="#/" class="back-link">← Back to Portal Selection</a>
          </div>
          
          <div class="login-header">
            <div class="login-icon">👤</div>
            <h1 id="formTitle">Sign In to User Portal</h1>
            <p id="formSubtitle">Enter your credentials to continue</p>
          </div>
          
          <div id="signInForm" class="login-step">
            <div class="field">
              <label for="identifier">Email or Phone Number</label>
              <input id="identifier" class="input" type="text" placeholder="john@example.com or +91 98765 43211" />
            </div>
            <div class="field">
              <label for="password">Password</label>
              <input id="password" class="input" type="password" placeholder="Enter your password" />
            </div>
            <button class="btn primary btn-full" id="signInBtn">Sign In</button>
            <div class="form-divider">
              <span>Don't have an account?</span>
            </div>
            <button class="btn ghost btn-full" id="showSignUp">Sign Up</button>
          </div>

          <div id="signUpForm" class="login-step" style="display:none">
            <div class="field">
              <label for="signupName">Full Name</label>
              <input id="signupName" class="input" type="text" placeholder="John Doe" />
            </div>
            <div class="field">
              <label for="signupIdentifier">Email or Phone Number</label>
              <input id="signupIdentifier" class="input" type="text" placeholder="john@example.com or +91 98765 43211" />
            </div>
            <div class="field">
              <label for="signupPassword">Password</label>
              <input id="signupPassword" class="input" type="password" placeholder="Create a password" />
            </div>
            <button class="btn primary btn-full" id="signUpBtn">Sign Up</button>
            <div class="form-divider">
              <span>Already have an account?</span>
            </div>
            <button class="btn ghost btn-full" id="showSignIn">Sign In</button>
          </div>

          <div class="login-footer">
            <p>Demo: john@example.com / password123</p>
          </div>
        </div>
      </div>
    `
    return this.root
  }

  afterRender() {
    const signInForm = this.root.querySelector('#signInForm')
    const signUpForm = this.root.querySelector('#signUpForm')
    const formTitle = this.root.querySelector('#formTitle')
    const formSubtitle = this.root.querySelector('#formSubtitle')
    
    // Sign In elements
    const identifierInput = this.root.querySelector('#identifier')
    const passwordInput = this.root.querySelector('#password')
    const signInBtn = this.root.querySelector('#signInBtn')
    
    // Sign Up elements
    const signupNameInput = this.root.querySelector('#signupName')
    const signupIdentifierInput = this.root.querySelector('#signupIdentifier')
    const signupPasswordInput = this.root.querySelector('#signupPassword')
    const signUpBtn = this.root.querySelector('#signUpBtn')
    
    // Toggle buttons
    const showSignUpBtn = this.root.querySelector('#showSignUp')
    const showSignInBtn = this.root.querySelector('#showSignIn')

    // Toggle to Sign Up form
    showSignUpBtn.addEventListener('click', () => {
      signInForm.style.display = 'none'
      signUpForm.style.display = 'block'
      formTitle.textContent = 'Sign Up for User Portal'
      formSubtitle.textContent = 'Create your account to get started'
    })

    // Toggle to Sign In form
    showSignInBtn.addEventListener('click', () => {
      signUpForm.style.display = 'none'
      signInForm.style.display = 'block'
      formTitle.textContent = 'Sign In to User Portal'
      formSubtitle.textContent = 'Enter your credentials to continue'
    })

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
            window.location.hash = '#/home'
            return
          } catch (backendError) {
            console.warn('Backend unavailable, using mock data:', backendError.message)
            showToast('Using offline mode')
          }
        }
        
        // Fallback to mock data
        const user = users[identifier]
        if (!user) {
          throw new Error('User not found')
        }
        if (user.password !== password) {
          throw new Error('Incorrect password')
        }
        
        sessionStorage.setItem('user', JSON.stringify({ 
          name: user.name,
          role: user.role,
          identifier: identifier
        }))
        
        showToast(`Welcome ${user.name}!`)
        window.location.hash = '#/home'
      } catch (error) {
        showToast(error.message || 'Login failed')
        signInBtn.disabled = false
        signInBtn.textContent = 'Sign In'
      }
    })

    // Sign Up
    signUpBtn.addEventListener('click', async () => {
      const name = signupNameInput.value.trim()
      const identifier = signupIdentifierInput.value.trim()
      const password = signupPasswordInput.value.trim()

      if (!name || !identifier || !password) {
        showToast('Please fill in all fields')
        return
      }

      signUpBtn.disabled = true
      signUpBtn.textContent = 'Creating account...'

      try {
        if (USE_BACKEND) {
          try {
            // Try backend API first
            const response = await authAPI.signup(name, identifier, password)
            sessionStorage.setItem('user', JSON.stringify({ 
              ...response.user,
              token: response.token
            }))
            showToast(`Account created! Welcome ${response.user.name}!`)
            window.location.hash = '#/home'
            return
          } catch (backendError) {
            console.warn('Backend unavailable, using mock data:', backendError.message)
            showToast('Using offline mode')
          }
        }
        
        // Fallback to mock data
        if (users[identifier]) {
          throw new Error('User already exists. Please sign in.')
        }
        
        users[identifier] = { name, role: 'user', password }
        
        sessionStorage.setItem('user', JSON.stringify({ 
          name: name,
          role: 'user',
          identifier: identifier
        }))
        
        showToast(`Account created! Welcome ${name}!`)
        window.location.hash = '#/home'
      } catch (error) {
        showToast(error.message || 'Signup failed')
        signUpBtn.disabled = false
        signUpBtn.textContent = 'Sign Up'
      }
    })

    // Enter key support
    passwordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') signInBtn.click()
    })
    
    signupPasswordInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') signUpBtn.click()
    })
  }
}
