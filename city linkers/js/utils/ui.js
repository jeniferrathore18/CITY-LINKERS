export function showToast(message, timeout=2600){
  const c = document.getElementById('toast-container')
  const el = document.createElement('div')
  el.className = 'toast'
  el.textContent = message
  c.appendChild(el)
  setTimeout(() => { el.style.opacity = '0'; el.style.transform = 'translateY(6px)'; }, timeout-400)
  setTimeout(() => c.removeChild(el), timeout)
}

export function skeleton(height=120){
  const div = document.createElement('div')
  div.className = 'skeleton'
  div.style.height = height+'px'
  return div
}

export function toggleMobileNav(){
  const nav = document.getElementById('nav')
  const btn = document.getElementById('hamburger')
  const open = nav.style.display === 'block'
  nav.style.display = open ? 'none' : 'block'
  if (btn) btn.setAttribute('aria-expanded', (!open).toString())
}
