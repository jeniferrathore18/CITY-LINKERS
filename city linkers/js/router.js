export class Router{
  constructor({ mountId, routes }){
    this.mount = document.getElementById(mountId)
    this.routes = routes
    this.current = null
  }
  init(){
    window.addEventListener('hashchange', () => this.render())
    this.render()
  }
  parse(){
    const hash = location.hash.replace('#','') || '/'
    return hash
  }
  async render(){
    const path = this.parse()
    const user = JSON.parse(sessionStorage.getItem('user') || '{}')
    
    // Protected routes - require authentication
    const protectedUserRoutes = ['/home', '/tracking', '/ticketing']
    const protectedAdminRoutes = ['/dashboard']
    
    // Check if user is trying to access protected routes
    if (protectedUserRoutes.includes(path)) {
      if (!user.role || user.role !== 'user') {
        window.location.hash = '#/user-login'
        return
      }
    }
    
    if (protectedAdminRoutes.includes(path)) {
      if (!user.role || user.role !== 'admin') {
        window.location.hash = '#/admin-login'
        return
      }
    }
    
    const Page = this.routes[path] || this.routes['/']
    if (!Page) return
    // Fade out current content
    this.mount.classList.add('fade-out')
    await new Promise(r=>setTimeout(r, 120))
    this.mount.innerHTML = ''
    const page = new Page()
    const el = await page.render()
    this.mount.appendChild(el)
    if (page.afterRender) page.afterRender()
    // Fade in new content
    this.mount.classList.remove('fade-out')
    this.mount.classList.add('fade-in')
    setTimeout(()=>this.mount.classList.remove('fade-in'), 320)
  }
}
