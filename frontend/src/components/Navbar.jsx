import { useNavigate } from 'react-router-dom'
import { logout } from '../utils/auth'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <span className="navbar-title">WorkflowX</span>
      </div>

      <div className="navbar-right">
        <span className="navbar-user">Welcome</span>

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