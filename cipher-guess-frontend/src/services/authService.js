const BASE_URL = import.meta.env.VITE_API_URL || ''

const authService = {
  async register(username, email, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      })
      const message = await res.text()
      return { success: message === 'Registered Successfully!', message }
    } catch {
      return { success: false, message: 'Server error. Try again.' }
    }
  },

  async login(username, password) {
    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const token = await res.text()
      if (res.ok && token && !token.includes(' ')) {
        localStorage.setItem('token', token)
        localStorage.setItem('username', username)
        return { success: true }
      }
      return { success: false, message: token }
    } catch {
      return { success: false, message: 'Server error. Try again.' }
    }
  },

  async logout() {
    const token = localStorage.getItem('token')
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token }
      })
    }
    localStorage.removeItem('token')
    localStorage.removeItem('username')
  },

  getToken()    { return localStorage.getItem('token') },
  getUsername() { return localStorage.getItem('username') },
  isLoggedIn()  { return !!localStorage.getItem('token') }
}

export default authService