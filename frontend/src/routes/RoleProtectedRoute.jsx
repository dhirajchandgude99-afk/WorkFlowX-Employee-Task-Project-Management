import { Navigate, Outlet } from 'react-router-dom'
import { hasRole } from '../utils/auth'

function RoleProtectedRoute({ role }) {
  if (!hasRole(role)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

export default RoleProtectedRoute