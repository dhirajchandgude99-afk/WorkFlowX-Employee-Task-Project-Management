import { useState } from 'react'
import './Login.css'

function Login() {
const [showPassword, setShowPassword] = useState(false)
const [username, setUsername] = useState('')
const [password, setPassword] = useState('')

const handleSubmit = (e) => {
  e.preventDefault()

  console.log('Username:', username)
  console.log('Password:', password)
}
return ( <div className="login-page"> <div className="login-card"> <h1>WorkflowX</h1> <p>Employee Task & Project Management System</p>

    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
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
