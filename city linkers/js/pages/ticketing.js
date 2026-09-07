import { routes, stops, ticketHistory, mintTicketOnChain } from '../data/mock.js'
import { showToast } from '../utils/ui.js'

export class TicketingPage{
  render(){
    this.root = document.createElement('div')
    this.root.innerHTML = `
      <div class="grid cols-2">
        <div class="card ticket-form-card">
          <div class="section-title">Buy e-Ticket</div>
          <div class="ticket-form">
            <div class="field">
              <label for="route">Route</label>
              <select id="route" class="input ticket-input-compact"></select>
            </div>
            <div class="field">
              <label for="from">Boarding</label>
              <select id="from" class="input ticket-input-compact"></select>
            </div>
            <div class="field">
              <label for="to">Destination</label>
              <select id="to" class="input ticket-input-compact"></select>
            </div>
            <div class="field">
              <label for="count">Passengers</label>
              <input class="input ticket-input-compact" type="number" id="count" min="1" max="10" value="1" />
            </div>
            <div class="fare-display-compact">
              <label>Total Fare</label>
              <div id="fare" class="fare-amount-compact">₹0</div>
            </div>
            <button class="btn primary btn-purchase-compact" id="purchase">Buy Ticket</button>
          </div>
        </div>
        <div class="card">
          <div class="section-title">Your Ticket</div>
          <div id="ticket">
            <div class="muted">No ticket yet. Purchase to see QR and blockchain details.</div>
          </div>
        </div>
      </div>

      <div class="grid cols-2" style="margin-top:16px">
        <div class="card">
          <div class="section-title">Transaction History</div>
          <table class="table" id="history">
            <thead><tr><th>Date</th><th>Route</th><th>From→To</th><th>Passengers</th><th>Fare</th><th>Status</th></tr></thead>
            <tbody></tbody>
          </table>
        </div>
        <div class="card feedback-card">
          <div class="section-title">Share Your Feedback</div>
          <div class="feedback-form">
            <div class="field">
              <label for="rating">Rate Your Experience</label>
              <div class="star-rating" id="starRating">
                <span class="star" data-rating="1">★</span>
                <span class="star" data-rating="2">★</span>
                <span class="star" data-rating="3">★</span>
                <span class="star" data-rating="4">★</span>
                <span class="star" data-rating="5">★</span>
              </div>
            </div>
            <div class="field">
              <label for="feedbackText">Your Feedback</label>
              <textarea id="feedbackText" class="input feedback-textarea" placeholder="Tell us about your experience with our app and services..." rows="4"></textarea>
            </div>
            <div class="field">
              <label for="feedbackEmail">Email</label>
              <input id="feedbackEmail" class="input ticket-input-compact" type="email" placeholder="your@email.com" />
            </div>
            <button class="btn primary btn-purchase-compact" id="submitFeedback">Submit Feedback</button>
          </div>
        </div>
      </div>
    `
    return this.root
  }
  afterRender(){
    const routeSel = this.root.querySelector('#route')
    const fromSel = this.root.querySelector('#from')
    const toSel = this.root.querySelector('#to')
    const fareEl = this.root.querySelector('#fare')

    routeSel.innerHTML = `<option value="">Select route</option>` + routes.map(r=>`<option value="${r.id}">${r.id} • ${r.name}</option>`).join('')

    const updateStops = ()=>{
      const rid = routeSel.value
      const s = rid ? (stops[rid] || []) : []
      fromSel.innerHTML = s.map(x=>`<option value="${x.id}">${x.name}</option>`).join('')
      toSel.innerHTML = s.map(x=>`<option value="${x.id}">${x.name}</option>`).join('')
      updateFare()
    }

    const updateFare = ()=>{
      const count = parseInt(this.root.querySelector('#count').value||'1',10)
      const rid = routeSel.value
      const base = rid ? 20 : 0
      const perStop = 5
      const idx = (sel)=>Array.from(sel.options).findIndex(o=>o.selected)
      const d = Math.abs(idx(toSel)-idx(fromSel))
      const fare = Math.max(0, base + d*perStop) * count
      fareEl.textContent = `₹${fare}`
      return fare
    }

    routeSel.addEventListener('change', updateStops)
    fromSel.addEventListener('change', updateFare)
    toSel.addEventListener('change', updateFare)
    this.root.querySelector('#count').addEventListener('input', updateFare)

    updateStops()

    const historyTbody = this.root.querySelector('#history tbody')
    const renderHistory = ()=>{
      historyTbody.innerHTML = ticketHistory.map(t=>`
        <tr>
          <td>${new Date(t.time).toLocaleString()}</td>
          <td>${t.routeId}</td>
          <td>${t.fromName} → ${t.toName}</td>
          <td>${t.count}</td>
          <td>₹${t.fare}</td>
          <td>✔ Verified</td>
        </tr>
      `).join('')
    }

    // Feedback functionality
    const starRating = this.root.querySelector('#starRating')
    const stars = starRating.querySelectorAll('.star')
    let selectedRating = 0

    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.getAttribute('data-rating'))
        stars.forEach((s, idx) => {
          if (idx < selectedRating) {
            s.classList.add('active')
          } else {
            s.classList.remove('active')
          }
        })
      })
      star.addEventListener('mouseenter', () => {
        const rating = parseInt(star.getAttribute('data-rating'))
        stars.forEach((s, idx) => {
          if (idx < rating) {
            s.classList.add('hover')
          } else {
            s.classList.remove('hover')
          }
        })
      })
    })

    starRating.addEventListener('mouseleave', () => {
      stars.forEach(s => s.classList.remove('hover'))
    })

    this.root.querySelector('#submitFeedback').addEventListener('click', () => {
      const feedbackText = this.root.querySelector('#feedbackText').value.trim()
      const feedbackEmail = this.root.querySelector('#feedbackEmail').value.trim()
      
      if (selectedRating === 0) {
        showToast('Please select a rating')
        return
      }
      if (!feedbackText) {
        showToast('Please enter your feedback')
        return
      }

      // Mock feedback submission
      console.log('Feedback submitted:', { rating: selectedRating, text: feedbackText, email: feedbackEmail })
      showToast('Thank you for your feedback!')
      
      // Reset form
      this.root.querySelector('#feedbackText').value = ''
      this.root.querySelector('#feedbackEmail').value = ''
      selectedRating = 0
      stars.forEach(s => s.classList.remove('active'))
    })

    const ticketEl = this.root.querySelector('#ticket')
    this.root.querySelector('#purchase').addEventListener('click', ()=>{
      const rid = routeSel.value
      if (!rid){ showToast('Select a route'); return }
      const s = stops[rid]
      const fIdx = fromSel.selectedIndex
      const tIdx = toSel.selectedIndex
      if (fIdx===-1 || tIdx===-1){ showToast('Select stops'); return }
      const count = parseInt(this.root.querySelector('#count').value||'1',10)
      const fare = updateFare()
      const ticket = {
        routeId: rid,
        from: s[fIdx].id,
        to: s[tIdx].id,
        fromName: s[fIdx].name,
        toName: s[tIdx].name,
        count,
        fare,
        time: Date.now(),
      }
      const chain = mintTicketOnChain(ticket)
      ticket.txId = chain.txId
      ticketHistory.unshift(ticket)

      // Render ticket panel
      ticketEl.innerHTML = `
        <div class="grid cols-2">
          <div>
            <div><b>Route</b>: ${ticket.routeId}</div>
            <div><b>From</b>: ${ticket.fromName}</div>
            <div><b>To</b>: ${ticket.toName}</div>
            <div><b>Passengers</b>: ${ticket.count}</div>
            <div><b>Fare</b>: ₹${ticket.fare}</div>
            <div><b>Tx</b>: <a href="#">${ticket.txId}</a></div>
            <div style="margin-top:8px"><span class="btn secondary" style="display:inline-block">Verified on Blockchain</span></div>
          </div>
          <div id="qrcode" style="display:flex; align-items:center; justify-content:center"></div>
        </div>
      `
      // QR generation
      new QRCode(ticketEl.querySelector('#qrcode'), { text: JSON.stringify({ tx: ticket.txId, r: ticket.routeId, t: ticket.time }), width: 140, height: 140 })

      renderHistory()
      showToast('Ticket purchased')
    })

    renderHistory()
  }
}
