import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  getRole,
  getUsername,
  logout,
} from '../utils/auth'
import './Navbar.css'

function Navbar() {
  const navigate = useNavigate()
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  const username = getUsername()
  const role = getRole()

  const handleLogout = () => {
    logout()
    navigate('/login', { replace: true })
  }

  const handleCancelLogout = () => {
    setShowLogoutModal(false)
  }

  return (
    <>
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
            onClick={() => setShowLogoutModal(true)}
          >
            Logout
          </button>
        </div>
      </nav>

      {showLogoutModal && (
        <div
          className="logout-modal-overlay"
          onClick={handleCancelLogout}
        >
          <div
            className="logout-modal"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="logout-modal-icon">
              ?
            </div>

            <h2>Confirm Logout</h2>

            <p>
              Are you sure you want to logout?
            </p>

            <div className="logout-modal-actions">
              <button
                className="logout-cancel-button"
                onClick={handleCancelLogout}
              >
                Cancel
              </button>

              <button
                className="logout-confirm-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar