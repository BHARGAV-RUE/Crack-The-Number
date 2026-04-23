import authService from './authService'

const BASE_URL = import.meta.env.VITE_API_URL || ''

const gameService = {
  async startGame(difficulty) {
    const res = await fetch(`${BASE_URL}/game/start?difficulty=${difficulty}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    return { success: res.ok, message: await res.text() }
  },

  async submitGuess(guess) {
    const res = await fetch(`${BASE_URL}/game/guess?guess=${guess}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    return { success: res.ok, message: await res.text() }
  },

  async forfeit() {
    const res = await fetch(`${BASE_URL}/game/forfeit`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    return { success: res.ok, message: await res.text() }
  },

  async getStats() {
    const res = await fetch(`${BASE_URL}/game/stats`, {
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    if (!res.ok) return null
    return await res.json()
  }
}

export default gameService