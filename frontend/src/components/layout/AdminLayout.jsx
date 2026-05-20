import { useEffect, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ADMIN_ROUTE } from '../../config'
import { loadAdminSummary } from '../../utils/adminApi'
import AdminSidebar from './AdminSidebar'
import './AdminLayout.css'

function readStoredAdminToken() {
  return localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken') || ''
}

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [authToken, setAuthToken] = useState(() => readStoredAdminToken())
  const [tokenInput, setTokenInput] = useState('')
  const [gate, setGate] = useState(authToken ? 'checking' : 'lock')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (authToken) {
      setGate('checking')
      loadAdminSummary(authToken).then(() => {
        setGate('ready')
      }).catch((error) => {
        localStorage.removeItem('adminToken')
        sessionStorage.removeItem('adminToken')
        setAuthToken('')
        setGate('lock')
        setMessage(error.message)
      })
    } else {
      setGate('lock')
    }
  }, [authToken])

  useEffect(() => {
    if (gate === 'ready') {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }
  }, [location.pathname, gate])

  async function unlock(event) {
    event.preventDefault()
    const candidateToken = tokenInput.trim()

    if (candidateToken.length !== 6) {
      setMessage('Admin password must be exactly 6 characters.')
      return
    }

    localStorage.setItem('adminToken', candidateToken)
    sessionStorage.setItem('adminToken', candidateToken)
    setAuthToken(candidateToken)
    setMessage('')
  }

  function logout() {
    localStorage.removeItem('adminToken')
    sessionStorage.removeItem('adminToken')
    setAuthToken('')
    setTokenInput('')
    setGate('lock')
    setMessage('You have been logged out.')
    navigate(ADMIN_ROUTE)
  }

  if (gate === 'checking') {
    return (
      <section className="card-panel private-gate inline-loader" aria-live="polite">
        <span className="loading-spinner" aria-hidden="true" />
        <p>Checking admin access...</p>
      </section>
    )
  }

  if (gate !== 'ready') {
    return (
      <section className="card-panel private-gate">
        <h1>Private admin portal</h1>
        <p>This URL is intentionally not linked from the public site.</p>
        <form onSubmit={unlock} className="stack">
          <input className="field" value={tokenInput} onChange={(event) => setTokenInput(event.target.value)} placeholder="Admin password" maxLength={6} required />
          <button className="button primary" type="submit" disabled={tokenInput.trim().length !== 6}>Unlock</button>
        </form>
        {message ? <div className="error-text">{message}</div> : null}
      </section>
    )
  }

  return (
    <section className="admin-shell">
      <div className="admin-layout">
        <AdminSidebar currentPath={location.pathname} onLogout={logout} />

        <div className="admin-content">
          <header className="admin-page-header">
            <span className="admin-page-kicker">PROPIC ADMIN</span>
            <h1>Dashboard</h1>
          </header>

          <Outlet context={{ token: authToken }} />
        </div>
      </div>
    </section>
  )
}

export default AdminLayout