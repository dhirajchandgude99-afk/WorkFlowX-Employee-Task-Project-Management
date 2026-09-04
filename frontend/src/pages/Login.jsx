import { useState } from 'react'
import './Login.css'
import { loginUser } from '../services/api'

function Login() {
const [showPassword, setShowPassword] = useState(false)
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')
const [error, setError] = useState('')

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

    try {
     const response = await loginUser(username, password)
     console.log('Login response:', response)
    } 
    catch (error) {
      console.error('Login failed:', error)
      setError('Unable to connect to server')
    }
  }

  return ( <div className="login-page"> 
  <div className="login-card"> 
   <h1>WorkflowX</h1> <p>Employee Task & Project Management System</p>
     {error && <p className="login-error">{error}</p>}
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
         type="text"
         id="username"
         name="username"
         placeholder="Enter username"
         value={username}
         onChange={(e) => {
         setUsername(e.target.value)
         setError('')
        }}
      />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>

        <div className="password-input">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            name="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
          />

          <button
            type="button"
            className="password-toggle"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>

      <button type="submit">Login</button>
    </form>
  </div>
</div>


)
}

export default Login
