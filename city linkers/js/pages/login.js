import { showToast } from '../utils/ui.js'

// Mock user database
const users = {
  admin: { phone: '+919876543210', role: 'admin', name: 'Admin User' },
  user: { phone: '+919876543211', role: 'user', name: 'Regular User' }
}

// Store OTP temporarily (in production, this would be server-side)
let otpStore = {}

export class LoginPage {
  render() {
    this.root = document.createElement('div')
    this.root.innerHTML = `
      <div class="login-container">
        <div class="login-card">
          <div class="login-header">
            <h1>Welcome to City Linkers</h1>
            <p>Sign in to access your account</p>
          </div>
          
          <div id="phoneStep" class="login-step">
            <div class="field">
              <label for="phone">Phone Number</label>
              <input id="phone" class="input" type="tel" placeholder="+91 98765 43210" />
            </div>
            <button class="btn primary btn-full" id="sendOtp">Send OTP</button>
          </div>

          <div id="otpStep" class="login-step" style="display:none">
            <div class="field">
              <label for="otp">Enter OTP</label>
              <input id="otp" class="input otp-input" type="text" maxlength="6" placeholder="000000" />
              <div class="otp-info">OTP sent to <span id="phoneDisplay"></span></div>
            </div>
            <button class="btn primary btn-full" id="verifyOtp">Verify OTP</button>
            <button class="btn ghost btn-full" id="resendOtp" style="margin-top:12px">Resend OTP</button>
          </div>

          <div class="login-footer">
            <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
          </div>
        </div>
      </div>
    `
    return this.root
  }

  afterRender() {
    const phoneStep = this.root.querySelector('#phoneStep')
    const otpStep = this.root.querySelector('#otpStep')
    const phoneInput = this.root.querySelector('#phone')
    const otpInput = this.root.querySelector('#otp')
    const phoneDisplay = this.root.querySelector('#phoneDisplay')
    const sendOtpBtn = this.root.querySelector('#sendOtp')
    const verifyOtpBtn = this.root.querySelector('#verifyOtp')
    const resendOtpBtn = this.root.querySelector('#resendOtp')

    let currentPhone = ''

    // Send OTP
    sendOtpBtn.addEventListener('click', () => {
      const phone = phoneInput.value.trim()
      if (!phone || phone.length < 10) {
        showToast('Please enter a valid phone number')
        return
      }

      // Generate 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      otpStore[phone] = { otp, timestamp: Date.now() }
      currentPhone = phone

      // In production, send SMS via API (Twilio, AWS SNS, etc.)
      console.log(`📱 SMS sent to ${phone}: Your OTP is ${otp}`)
      showToast(`OTP sent to ${phone}`)

      // Show OTP step
      phoneStep.style.display = 'none'
      otpStep.style.display = 'block'
      phoneDisplay.textContent = phone
      otpInput.focus()
    })

    // Verify OTP
    verifyOtpBtn.addEventListener('click', () => {
      const enteredOtp = otpInput.value.trim()
      if (!enteredOtp || enteredOtp.length !== 6) {
        showToast('Please enter a 6-digit OTP')
        return
      }

      const stored = otpStore[currentPhone]
      if (!stored) {
        showToast('OTP expired. Please request a new one')
        return
      }

      // Check if OTP is expired (5 minutes)
      if (Date.now() - stored.timestamp > 5 * 60 * 1000) {
        showToast('OTP expired. Please request a new one')
        delete otpStore[currentPhone]
        return
      }

      // Verify OTP
      if (enteredOtp === stored.otp) {
        // Find user by phone
        const user = Object.values(users).find(u => u.phone === currentPhone)
        
        if (user) {
          // Store session
          sessionStorage.setItem('user', JSON.stringify(user))
          showToast(`Welcome ${user.name}!`)
          
          // Redirect based on role
          if (user.role === 'admin') {
            window.location.hash = '#/dashboard'
          } else {
            window.location.hash = '#/'
          }
        } else {
          showToast('User not found')
        }
        
        delete otpStore[currentPhone]
      } else {
        showToast('Invalid OTP. Please try again')
      }
    })

    // Resend OTP
    resendOtpBtn.addEventListener('click', () => {
      const otp = Math.floor(100000 + Math.random() * 900000).toString()
      otpStore[currentPhone] = { otp, timestamp: Date.now() }
      console.log(`📱 SMS resent to ${currentPhone}: Your OTP is ${otp}`)
      showToast('OTP resent successfully')
    })

    // Auto-focus and format phone input
    phoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '')
      if (value.length > 12) value = value.slice(0, 12)
      e.target.value = value
    })

    // Auto-submit on 6 digits
    otpInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '')
      e.target.value = value
      if (value.length === 6) {
        verifyOtpBtn.click()
      }
    })
  }
}
