import { useNavigate } from 'react-router-dom'
import {
  getRole,
  getUsername,
  logout,
} from '../utils/auth'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  const username = getUsername()
  const role = getRole()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-title">
          WorkflowX
        </span>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">
          {username || 'User'}
        </span>

        {role && (
          <span className="navbar-role">
            {role}
          </span>
        )}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default Navbar