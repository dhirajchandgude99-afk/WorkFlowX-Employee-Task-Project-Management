import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Login.css'
import { loginUser } from '../services/api'
import { getToken, saveToken } from '../utils/auth'
import Loading from '../components/Loading'

function Login() {
  const navigate = useNavigate()

  useEffect(() => {
    if (getToken()) {
      navigate('/dashboard', { replace: true })
    }
  }, [navigate])

  const [showPassword, setShowPassword] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    if (!password.trim()) {
      setError('Password is required')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await loginUser(username, password)

      if (response.status === 200) {
        saveToken(response.data.token)
        navigate('/dashboard')
      }
    } catch (error) {
      console.error('Login failed:', error)

      if (error.status === 401 || error.status === 403) {
        setError('Invalid username or password')
      } else if (error.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError('Unable to connect to server')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>WorkflowX</h1>
        <p>Employee Task & Project Management System</p>

        {error && (
          <p className="login-error">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">
              Username
            </label>

            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              value={username}
              disabled={loading}
              onChange={(e) => {
                setUsername(e.target.value)
                setError('')
              }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
            </label>

            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                placeholder="Enter password"
                value={password}
                disabled={loading}
                onChange={(e) => {
                  setPassword(e.target.value)
                  setError('')
                }}
              />

              <button
                type="button"
                className="password-toggle"
                disabled={loading}
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {loading && (
          <Loading message="Authenticating..." />
        )}
      </div>
    </div>
  )
}

export default Login