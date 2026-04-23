import authService from './authService'

const gameService = {
  async startGame(difficulty) {
    const res = await fetch(`/game/start?difficulty=${difficulty}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    return { success: res.ok, message: await res.text() }
  },

  async submitGuess(guess) {
    const res = await fetch(`/game/guess?guess=${guess}`, {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    return { success: res.ok, message: await res.text() }
  },

  async forfeit() {
    const res = await fetch('/game/forfeit', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    return { success: res.ok, message: await res.text() }
  },

  async getStats() {
    const res = await fetch('/game/stats', {
      headers: { 'Authorization': 'Bearer ' + authService.getToken() }
    })
    if (!res.ok) return null
    return await res.json()
  }
}

export default gameService