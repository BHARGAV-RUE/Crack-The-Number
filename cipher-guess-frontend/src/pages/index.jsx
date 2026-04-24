import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '../services/authService'
import './index.css'

export default function Index() {
  const navigate = useNavigate()
  const [modal, setModal]                   = useState(null)
  const [loginData, setLoginData]           = useState({ username: '', password: '' })
  const [signupData, setSignupData]         = useState({ email: '', username: '', password: '' })
  const [loginError, setLoginError]         = useState('')
  const [loginSuccess, setLoginSuccess]     = useState('')
  const [signupError, setSignupError]       = useState('')
  const [signupSuccess, setSignupSuccess]   = useState('')
  const [strength, setStrength]             = useState({ score: 0, label: '', color: '', width: '0%' })
  const [showLoginPass, setShowLoginPass]   = useState(false)
  const [showSignupPass, setShowSignupPass] = useState(false)
  const [loading, setLoading]               = useState(false)

  function checkStrength(password) {
    let score = 0
    if (password.length >= 8)           score++
    if (/[A-Z]/.test(password))         score++
    if (/[0-9]/.test(password))         score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    const levels = {
      0: { label: '',       color: 'transparent', width: '0%'   },
      1: { label: 'WEAK',   color: '#ff4444',     width: '25%'  },
      2: { label: 'FAIR',   color: '#FFA500',     width: '50%'  },
      3: { label: 'GOOD',   color: '#FFD700',     width: '75%'  },
      4: { label: 'STRONG', color: '#00ff88',     width: '100%' },
    }
    setStrength({ score, ...levels[score] })
  }

  // ── Login ──
  async function handleLogin(e) {
    e.preventDefault()
    setLoginError('')
    setLoginSuccess('')

    if (!loginData.username || !loginData.password) {
      setLoginError('Please fill in all fields')
      return
    }

    setLoading(true)
    setLoginSuccess('Logging in...')

    const result = await authService.login(loginData.username, loginData.password)
    setLoading(false)

    if (result.success) {
      setLoginSuccess('Login successful! Redirecting...')
      setTimeout(() => navigate('/dashboard'), 800)
    } else {
      setLoginSuccess('')
      setLoginError(result.message || 'Invalid username or password')
    }
  }

  // ── Register ──
  async function handleRegister(e) {
    e.preventDefault()
    setSignupError('')
    setSignupSuccess('')

    if (!signupData.email || !signupData.username || !signupData.password) {
      setSignupError('Please fill in all fields')
      return
    }
    if (strength.score < 3) {
      setSignupError('Password too weak — use 8+ chars, uppercase and a number')
      return
    }

    setLoading(true)
    setSignupSuccess('Creating your account...')

    const result = await authService.register(
      signupData.username,
      signupData.email,
      signupData.password
    )

    if (result.success) {
      setSignupSuccess('Account created! Logging you in...')

      const loginResult = await authService.login(
        signupData.username,
        signupData.password
      )
      setLoading(false)

      if (loginResult.success) {
        setSignupSuccess('Welcome to CipherGuess! Redirecting...')
        setTimeout(() => navigate('/dashboard'), 800)
      } else {
        setSignupSuccess('Account created! Please login.')
        setTimeout(() => setModal('login'), 1500)
      }
    } else {
      setLoading(false)
      setSignupSuccess('')
      setSignupError(result.message || 'Registration failed. Try again.')
    }
  }

  function closeModal() {
    setModal(null)
    setLoginError('')
    setLoginSuccess('')
    setSignupError('')
    setSignupSuccess('')
    setShowLoginPass(false)
    setShowSignupPass(false)
    setLoading(false)
    setStrength({ score: 0, label: '', color: 'transparent', width: '0%' })
  }

  return (
    <div className="index-page">

      {/* ── Navbar ── */}
      <nav className="nav-bar">
        <span className="text-heading">CiPhErGuEsS</span>
        <div className="nav-buttons">
          <button className="btn-outline" onClick={() => setModal('login')}>LOGIN</button>
          <button className="btn-primary" onClick={() => setModal('signup')}>SIGN UP</button>
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="content">
        <div className="box-1">
          <h2 className="abt-game">About Game</h2>
          <p className="cont-1">
            Crack The Number is a number guessing game where you compete against a randomly
            generated secret number. Choose your difficulty — Easy, Medium, Hard or GOD — each
            raising the number range and the challenge. Guess the number using TOO HIGH and TOO LOW
            hints to crack it in as few attempts as possible. Every game is tracked, so you can
            always challenge your own best score!
          </p>
        </div>
        <div className="box-2">
          <h2 className="rules">Rules</h2>
          <ul>
            <li>A secret number is randomly generated based on your chosen difficulty — Easy (1–10), Medium (1–50), Hard (1–100) and GOD (1–1000).</li>
            <li>After each guess you will receive a hint — TOO HIGH if your guess is above the secret number or TOO LOW if it is below.</li>
            <li>Keep guessing until you crack the exact number — the fewer guesses you take, the better your score.</li>
            <li>Your game history, win rate and best score are tracked on your dashboard so you can always beat your personal record.</li>
          </ul>
        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="footer">
        <div className="footer-left">
          <h4>More Games & Requests</h4>
          <p>We'd love to hear from you!</p>
          <a href="mailto:bhargavkallepally9@gmail.com">bhargavkallepally9@gmail.com</a>
        </div>
        <div className="footer-right">
          <h4>About Developer</h4>
          <p>Developed by <strong style={{ color: 'var(--primary)' }}>Bhargav</strong></p>
          <p>Passionate backend developer building fun and functional web apps.</p>
          <a href="https://www.linkedin.com/in/bhargav-kallepally-816504241/" target="_blank" rel="noreferrer">
            <i className="fab fa-linkedin"></i> LinkedIn
          </a>
          <a href="https://github.com/BHARGAV-RUE" target="_blank" rel="noreferrer">
            <i className="fab fa-github"></i> GitHub
          </a>
        </div>
      </footer>

      {/* ── Modals ── */}
      {modal && (
        <div className="modal-overlay active"
          onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <span className="modal-close" onClick={closeModal}>&times;</span>

            {/* ── LOGIN ── */}
            {modal === 'login' && (
              <>
                <h2 className="modal-title">LOGIN</h2>
                <form onSubmit={handleLogin}>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input className="form-input" type="text"
                      placeholder="Enter your username"
                      value={loginData.username}
                      onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="password-wrapper">
                      <input className="form-input"
                        type={showLoginPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                      <span className="eye-toggle"
                        onClick={() => setShowLoginPass(!showLoginPass)}>
                        <i className={`fas ${showLoginPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </span>
                    </div>
                  </div>

                  {loginError   && <p className="form-msg error">{loginError}</p>}
                  {loginSuccess && <p className="form-msg success">{loginSuccess}</p>}

                  <button className="btn-primary modal-submit" type="submit" disabled={loading}>
                    {loading ? 'PLEASE WAIT...' : 'LOGIN'}
                  </button>
                </form>
                <div className="modal-switch">
                  Don't have an account?{' '}
                  <span onClick={() => { setModal('signup'); setLoginError(''); setLoginSuccess('') }}>
                    Sign Up
                  </span>
                </div>
              </>
            )}

            {/* ── SIGN UP ── */}
            {modal === 'signup' && (
              <>
                <h2 className="modal-title">SIGN UP</h2>
                <form onSubmit={handleRegister}>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" placeholder="joe@example.com"
                      value={signupData.email}
                      onChange={e => setSignupData({ ...signupData, email: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input className="form-input" type="text" placeholder="Joe"
                      value={signupData.username}
                      onChange={e => setSignupData({ ...signupData, username: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <div className="password-wrapper">
                      <input className="form-input"
                        type={showSignupPass ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={e => {
                          setSignupData({ ...signupData, password: e.target.value })
                          checkStrength(e.target.value)
                        }} />
                      <span className="eye-toggle"
                        onClick={() => setShowSignupPass(!showSignupPass)}>
                        <i className={`fas ${showSignupPass ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                      </span>
                    </div>
                    {signupData.password && (
                      <div className="strength-bar-container">
                        <div className="strength-bar-track">
                          <div className="strength-bar-fill"
                            style={{ width: strength.width, backgroundColor: strength.color }} />
                        </div>
                        <span className="strength-label" style={{ color: strength.color }}>
                          {strength.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {signupError   && <p className="form-msg error">{signupError}</p>}
                  {signupSuccess && <p className="form-msg success">{signupSuccess}</p>}

                  <button className="btn-primary modal-submit" type="submit" disabled={loading}>
                    {loading ? 'PLEASE WAIT...' : 'CREATE ACCOUNT'}
                  </button>
                </form>
                <div className="modal-switch">
                  Already have an account?{' '}
                  <span onClick={() => { setModal('login'); setSignupError(''); setSignupSuccess('') }}>
                    Login
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}