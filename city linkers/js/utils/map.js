import { config, queryGemini } from '../config.js'

let map;
let markers = new Map();
let routeLayer = null;
let stopsLayer = null;

// Gemini-enhanced route suggestions
export async function getRouteInsights(from, to) {
  const prompt = `As a transit expert, suggest the best bus route from ${from} to ${to}. Keep response under 50 words.`
  return await queryGemini(prompt)
}

export function initMap(targetId, center=[28.6139,77.2090], zoom=12){
  map = L.map(targetId, { zoomControl: false })
  
  // Base layers - Street and Satellite views
  const streetLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 20,
    attribution: '&copy; OpenStreetMap, &copy; CARTO'
  })
  
  const satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: '&copy; Esri, Maxar, Earthstar Geographics'
  })
  
  // Add default street layer
  streetLayer.addTo(map)
  
  // Layer control for switching between views
  const baseMaps = {
    "Street": streetLayer,
    "Satellite": satelliteLayer
  }
  
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map)
  
  map.setView(center, zoom)
  // Modern controls
  L.control.zoom({ position: 'bottomright' }).addTo(map)
  L.control.scale({ metric: true, imperial: false, position: 'bottomleft' }).addTo(map)
  return map
}

export function updateBusMarkers(buses){
  if (!map) return
  buses.forEach(b => {
    const key = b.id
    const latlng = [b.lat, b.lng]
    if (!markers.has(key)){
      const m = L.marker(latlng, { title: `${b.label} • ${b.routeId}` })
      m.addTo(map).bindPopup(`<b>${b.label}</b><br/>Route ${b.routeId}<br/>Speed ${b.speed} km/h`)
      markers.set(key, m)
    } else {
      markers.get(key).setLatLng(latlng)
    }
  })
}

export function fitToBuses(buses){
  if (!map || !buses.length) return
  const bounds = L.latLngBounds(buses.map(b => [b.lat, b.lng]))
  map.fitBounds(bounds.pad(0.2))
}

// Draw a route polyline given ordered stop coordinates
export function drawRouteFromStops(stops, color='#30a0ff'){
  if (!map || !stops || !stops.length) return
  clearRouteOverlay()
  const latlngs = stops.map(s => [s.lat, s.lng])
  routeLayer = L.polyline(latlngs, { color, weight: 4, opacity: 0.9 })
  routeLayer.addTo(map)
  try{ map.fitBounds(routeLayer.getBounds().pad(0.2)) }catch(e){}
}

export function clearRouteOverlay(){
  if (routeLayer){ map.removeLayer(routeLayer); routeLayer = null }
}

// Stop markers
export function setStopMarkers(stopsArr, color='#ffd166'){
  if (!map) return
  clearStopMarkers()
  stopsLayer = L.layerGroup()
  stopsArr.forEach(s => {
    const c = L.circleMarker([s.lat, s.lng], { radius:6, color: color, fillColor: color, fillOpacity: 0.9 })
      .bindTooltip(s.name, { direction:'top', offset:[0,-6] })
    c.addTo(stopsLayer)
  })
  stopsLayer.addTo(map)
}

export function clearStopMarkers(){
  if (stopsLayer){ map.removeLayer(stopsLayer); stopsLayer = null }
}
