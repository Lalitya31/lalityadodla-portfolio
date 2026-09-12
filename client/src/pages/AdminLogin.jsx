import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDocumentTitle } from './useDocumentTitle.js'

function AdminLogin() {
  useDocumentTitle('Admin Login - Portfolio CMS')

  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      if (!response.ok) {
        throw new Error('Invalid username or password')
      }

      const data = await response.json()

      if (!data.token) {
        throw new Error('Login failed')
      }

      localStorage.setItem('adminToken', data.token)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.panel}>
        <h1 style={styles.title}>Portfolio CMS</h1>
        <p style={styles.subtitle}>Admin login</p>

        {error ? <p style={styles.error}>{error}</p> : null}

        <label style={styles.label}>
          Username
          <input
            style={styles.input}
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            autoComplete="username"
            required
          />
        </label>

        <label style={styles.label}>
          Password
          <input
            style={styles.input}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
            required
          />
        </label>

        <button style={styles.button} type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    background: '#020617',
    color: '#e5e7eb',
  },
  panel: {
    width: '100%',
    maxWidth: '420px',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    padding: '2rem',
    border: '1px solid rgba(96, 165, 250, 0.18)',
    borderRadius: '8px',
    background: 'rgba(6, 18, 36, 0.85)',
    boxShadow: '0 12px 40px rgba(2, 6, 23, 0.6)',
  },
  title: {
    margin: 0,
    fontSize: '2rem',
  },
  subtitle: {
    margin: 0,
    color: '#93c5fd',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.4rem',
    color: '#d1d5db',
  },
  input: {
    padding: '0.75rem',
    borderRadius: '6px',
    border: '1px solid rgba(148, 163, 184, 0.35)',
    background: '#0f172a',
    color: '#f8fafc',
    font: 'inherit',
  },
  button: {
    padding: '0.8rem 1rem',
    borderRadius: '6px',
    border: '1px solid rgba(96, 165, 250, 0.3)',
    background: '#2563eb',
    color: '#fff',
    font: 'inherit',
    fontWeight: 700,
    cursor: 'pointer',
  },
  error: {
    margin: 0,
    padding: '0.75rem',
    borderRadius: '6px',
    color: '#fecaca',
    background: 'rgba(127, 29, 29, 0.35)',
  },
}

export default AdminLogin
