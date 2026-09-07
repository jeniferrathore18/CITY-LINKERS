// Mock data + simulation for routes, stops, buses, blockchain logs, revenue
export const routes = [
  { id: 'R1', name: 'Blue Line', color: '#30a0ff' },
  { id: 'R2', name: 'Green Loop', color: '#27d3a6' },
  { id: 'R3', name: 'City Core', color: '#ffd166' },
]

export const stops = {
  R1: [
    { id: 'S1', name:'Central Station', lat:28.6139, lng:77.2090 },
    { id: 'S2', name:'Tech Park', lat:28.6280, lng:77.2190 },
    { id: 'S3', name:'Museum', lat:28.6200, lng:77.2000 },
  ],
  R2: [
    { id: 'S4', name:'North Hub', lat:28.6400, lng:77.2100 },
    { id: 'S5', name:'Riverfront', lat:28.6350, lng:77.1900 },
    { id: 'S6', name:'Market', lat:28.6200, lng:77.1800 },
  ],
  R3: [
    { id: 'S7', name:'Old City', lat:28.6000, lng:77.2200 },
    { id: 'S8', name:'New Avenue', lat:28.5950, lng:77.2050 },
    { id: 'S9', name:'Garden', lat:28.5900, lng:77.1900 },
  ],
}

export let buses = [
  { id:'B1', label:'Bus 101', routeId:'R1', lat:28.6139, lng:77.2090, speed:30, dir:1 },
  { id:'B2', label:'Bus 202', routeId:'R2', lat:28.6350, lng:77.1900, speed:28, dir:1 },
  { id:'B3', label:'Bus 303', routeId:'R3', lat:28.5950, lng:77.2050, speed:25, dir:-1 },
]

export const ticketHistory = []

export const revenue = {
  daily: Array.from({length:7}, (_,i)=>({ day:['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i], amount: Math.round(500+Math.random()*900) })),
  monthly: Array.from({length:12}, (_,i)=>({ m:i+1, amount: Math.round(12000+Math.random()*10000) })),
}

export const tripLogs = []

// Simple pseudo-hash for demo only
function pseudoHash(input){
  let h=0; for (let i=0;i<input.length;i++){ h=(h<<5)-h+input.charCodeAt(i); h|=0 }
  return '0x'+(h>>>0).toString(16).padStart(8,'0')+Math.floor(Math.random()*1e8).toString(16)
}

export function mintTicketOnChain(ticket){
  const hash = pseudoHash(JSON.stringify(ticket)+Date.now())
  return { txId: hash, timestamp: Date.now() }
}

export function logTripOnChain({ busId, routeId, startTime, endTime, distanceKm }){
  const data = { busId, routeId, startTime, endTime, distanceKm }
  const hash = pseudoHash(JSON.stringify(data))
  const rec = { ...data, hash }
  tripLogs.push(rec)
  return rec
}

export function startSimulation(){
  // Move buses slightly every 1.2s
  setInterval(()=>{
    buses = buses.map(b=>{
      const dLat = (Math.random()-0.5) * 0.003 * b.dir
      const dLng = (Math.random()-0.5) * 0.003 * b.dir
      let lat = b.lat + dLat
      let lng = b.lng + dLng
      const speed = Math.max(10, Math.min(40, b.speed + (Math.random()-0.5)*4))
      // Switch direction occasionally
      const dir = Math.random() < 0.05 ? -b.dir : b.dir
      return { ...b, lat, lng, speed, dir }
    })
    document.dispatchEvent(new CustomEvent('buses:update', { detail: buses }))
  }, 1200)
}
