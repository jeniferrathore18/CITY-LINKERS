import { routes, stops, buses as busState } from '../data/mock.js'
import { initMap, updateBusMarkers, fitToBuses, getRouteInsights } from '../utils/map.js'
import { showToast } from '../utils/ui.js'
import { config } from '../config.js'

// Gemini API is configured and available for route insights

export class TrackingPage{
  async render(){
    this.root = document.createElement('div')
    this.root.innerHTML = `
      <div class="grid cols-2">
        <div class="card">
          <div class="section-title">Live Map</div>
          <div id="map" class="map"></div>
        </div>
        <div class="grid" style="gap:16px">
          <div class="card">
            <div class="section-title">Plan your journey</div>
            <div class="form-grid">
              <div class="field suggestions">
                <label for="from">From</label>
                <div class="inline-input">
                  <input id="from" class="input" type="text" placeholder="Current Location or enter starting point..." />
                  <button id="useCurrent" class="btn ghost right-btn" title="Use Current Location">📍 Use Current</button>
                </div>
                <div id="fromSug" class="suggestions-list" style="display:none"></div>
              </div>
              <div class="field suggestions">
                <label for="to">To</label>
                <input id="to" class="input" type="text" placeholder="Enter destination location..." />
                <div id="toSug" class="suggestions-list" style="display:none"></div>
              </div>
              <div class="form-grid two">
                <div class="field">
                  <label for="depart">Departure Time</label>
                  <input id="depart" class="input" type="datetime-local" />
                </div>
                <div class="field">
                  <label for="travelers">Number of Travelers</label>
                  <select id="travelers" class="input">
                    <option value="1" selected>1 traveler</option>
                    <option value="2">2 travelers</option>
                    <option value="3">3 travelers</option>
                    <option value="4">4 travelers</option>
                    <option value="5">5+ travelers</option>
                  </select>
                </div>
              </div>
              <div class="form-grid two">
                <div class="field">
                  <label for="nearestStops">Nearest Bus Stops</label>
                  <select id="nearestStops" class="input">
                    <option value="">Finding nearby stops...</option>
                  </select>
                </div>
                <div class="field" style="display:flex; align-items:flex-end">
                  <button id="refreshStops" class="btn ghost" style="width:100%" title="Refresh nearby stops">🔄 Refresh Stops</button>
                </div>
              </div>
              <div>
                <button id="plan" class="btn primary">Plan Trip</button>
              </div>
            </div>
          </div>
          <div class="dark-card" id="bus-info">
            <h3>Choose the bus</h3>
            <div class="ride-list" id="ride-list"></div>
            <div class="sticky-action">
              <button class="btn primary" id="chooseRide">Choose <span id="rideName">Ride</span></button>
            </div>
          </div>
        </div>
      </div>
    `
    return this.root
  }
  afterRender(){
    this.map = initMap('map')

    // State for journey planner
    const fromEl = this.root.querySelector('#from')
    const toEl = this.root.querySelector('#to')
    const fromSug = this.root.querySelector('#fromSug')
    const toSug = this.root.querySelector('#toSug')
    const planBtn = this.root.querySelector('#plan')
    const useCurrentBtn = this.root.querySelector('#useCurrent')
    const departEl = this.root.querySelector('#depart')
    const travelersEl = this.root.querySelector('#travelers')
    const nearestStopsEl = this.root.querySelector('#nearestStops')
    const refreshStopsBtn = this.root.querySelector('#refreshStops')

    let fromCoords = null
    let toCoords = null
    let userLocation = null

    // Haversine distance calculation
    const haversineKm = (lat1, lon1, lat2, lon2) => {
      const R = 6371
      const dLat = (lat2 - lat1) * Math.PI / 180
      const dLon = (lon2 - lon1) * Math.PI / 180
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
      return R * c
    }

    // Find and display nearest stops
    const updateNearestStops = (lat, lng) => {
      const allStops = Object.values(stops).flat()
      const stopsWithDistance = allStops.map(s => ({
        ...s,
        distance: haversineKm(lat, lng, s.lat, s.lng)
      })).sort((a, b) => a.distance - b.distance).slice(0, 10)

      if (stopsWithDistance.length === 0) {
        nearestStopsEl.innerHTML = '<option value="">No stops found nearby</option>'
        return
      }

      nearestStopsEl.innerHTML = stopsWithDistance.map(s => {
        const dist = s.distance < 1 ? `${Math.round(s.distance * 1000)}m` : `${s.distance.toFixed(1)}km`
        return `<option value="${s.id}">${s.name} (${dist}) - ${s.id}</option>`
      }).join('')
    }

    // Refresh stops based on current location
    const refreshNearestStops = () => {
      if (!navigator.geolocation) {
        showToast('Geolocation not supported')
        return
      }
      nearestStopsEl.innerHTML = '<option value="">Loading...</option>'
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          updateNearestStops(userLocation.lat, userLocation.lng)
          showToast('Nearby stops updated')
        },
        () => {
          nearestStopsEl.innerHTML = '<option value="">Unable to get location</option>'
          showToast('Location access denied')
        }
      )
    }

    refreshStopsBtn.addEventListener('click', refreshNearestStops)
    
    // Auto-load nearest stops on page load
    setTimeout(refreshNearestStops, 500)

    const refresh = ()=>{
      let buses = [...busState]
      updateBusMarkers(buses)
      fitToBuses(buses)
      // Buildride list summary
      const items = buses.map((b,i)=>{
        const price = 200 + i*50
        return `<div class="ride-card" data-id="${b.id}">
          <div class="ride-left">
            <div class="ride-icon">🚌</div>
            <div>
              <div class="ride-name">${b.label}</div>
              <div class="ride-meta">Live • ${b.speed.toFixed(0)} km/h</div>
            </div>
          </div>
          <div class="ride-right">
            <div class="ride-price">₹${price}</div>
          </div>
        </div>`
      }).join('') || '<div class="ride-meta">No buses found.</div>'
      const listEl = this.root.querySelector('#ride-list')
      listEl.innerHTML = items
      listEl.querySelectorAll('.ride-card').forEach(card=>{
        card.addEventListener('click', ()=>{
          listEl.querySelectorAll('.ride-card').forEach(c=>c.classList.remove('active'))
          card.classList.add('active')
          this.root.querySelector('#rideName').textContent = card.querySelector('.ride-name').textContent
        })
      })
    }

    // Autocomplete helper using Nominatim
    const geocode = async (q)=>{
      if (!q || q.length < 3) return []
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=6`
      const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
      if (!res.ok) return []
      const data = await res.json()
      return data.map(d=>({ label: d.display_name, lat: parseFloat(d.lat), lon: parseFloat(d.lon) }))
    }

    const wireAutocomplete = (inputEl, sugEl, setCoords)=>{
      let t
      inputEl.addEventListener('input', ()=>{
        clearTimeout(t)
        const q = inputEl.value.trim()
        if (q.length < 3){ sugEl.style.display='none'; sugEl.innerHTML=''; return }
        t = setTimeout(async()=>{
          const items = await geocode(q)
          if (!items.length){ sugEl.style.display='none'; sugEl.innerHTML=''; return }
          sugEl.innerHTML = items.map(it=>`<div class="suggestion-item"><div class="suggestion-main">${it.label.split(',')[0]}</div><div class="suggestion-sub">${it.label.replace(it.label.split(',')[0]+',','')}</div></div>`).join('')
          sugEl.style.display='block'
          Array.from(sugEl.children).forEach((row,idx)=>{
            row.addEventListener('click',()=>{
              const it = items[idx]
              inputEl.value = it.label
              setCoords({ lat: it.lat, lng: it.lon })
              sugEl.style.display='none'
            })
          })
        }, 300)
      })
      document.addEventListener('click',(e)=>{ if (!sugEl.contains(e.target) && e.target!==inputEl) sugEl.style.display='none' })
    }

    wireAutocomplete(fromEl, fromSug, (c)=>{ fromCoords = c })
    wireAutocomplete(toEl, toSug, (c)=>{ toCoords = c })

    // Use Current Location button
    useCurrentBtn.addEventListener('click', () => {
      if (!navigator.geolocation) {
        showToast('Geolocation not supported by your browser')
        return
      }
      
      useCurrentBtn.disabled = true
      useCurrentBtn.textContent = '📍 Getting location...'
      
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          userLocation = { lat: pos.coords.latitude, lng: pos.coords.longitude }
          fromCoords = userLocation
          
          // Reverse geocode to get address
          fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${userLocation.lat}&lon=${userLocation.lng}`)
            .then(res => res.json())
            .then(data => {
              fromEl.value = data.display_name || 'Current Location'
              showToast('Current location set')
              
              // Update nearest stops
              updateNearestStops(userLocation.lat, userLocation.lng)
              
              // Add marker on map
              if (this.currentLocationMarker) {
                this.currentLocationMarker.remove()
              }
              this.currentLocationMarker = L.marker([userLocation.lat, userLocation.lng], {
                icon: L.divIcon({
                  className: 'current-location-marker',
                  html: '<div style="background:#4F46E5;width:16px;height:16px;border-radius:50%;border:3px solid white;box-shadow:0 0 10px rgba(79,70,229,0.5)"></div>',
                  iconSize: [22, 22]
                })
              }).bindPopup('📍 Your Location').addTo(this.map)
              
              // Center map on user location
              this.map.setView([userLocation.lat, userLocation.lng], 14)
            })
            .catch(() => {
              fromEl.value = `Current Location (${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)})`
              showToast('Location set')
            })
            .finally(() => {
              useCurrentBtn.disabled = false
              useCurrentBtn.textContent = '📍 Use Current'
            })
        },
        (error) => {
          let message = 'Unable to get location'
          switch(error.code) {
            case error.PERMISSION_DENIED:
              message = 'Location access denied. Please enable location permissions.'
              break
            case error.POSITION_UNAVAILABLE:
              message = 'Location information unavailable'
              break
            case error.TIMEOUT:
              message = 'Location request timed out'
              break
          }
          showToast(message)
          useCurrentBtn.disabled = false
          useCurrentBtn.textContent = '📍 Use Current'
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      )
    })

    // Plan trip: show markers for from/to and fit bounds
    let planLayer
    planBtn.addEventListener('click', ()=>{
      if (!fromCoords || !toCoords){ showToast('Please set both From and To'); return }
      if (planLayer){ planLayer.remove() }
      planLayer = L.layerGroup().addTo(this.map)
      const a = L.marker([fromCoords.lat, fromCoords.lng], { title: 'From' }).bindPopup('From').addTo(planLayer)
      const b = L.marker([toCoords.lat, toCoords.lng], { title: 'To' }).bindPopup('To').addTo(planLayer)
      const bounds = L.latLngBounds([a.getLatLng(), b.getLatLng()])
      this.map.fitBounds(bounds.pad(0.25))
      showToast('Trip planned (mock)')
    })

    // Bus updates from simulation
    document.addEventListener('buses:update', refresh)

    // Initial render
    refresh()
  }
}
