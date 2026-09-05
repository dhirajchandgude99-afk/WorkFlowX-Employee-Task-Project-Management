import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ProtectedRoute from './ProtectedRoute'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public Routes */}

        <Route path="/" element={<h1>WorkflowX Home</h1>} />

        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/users"
            element={<h1>Users</h1>}
          />

          <Route
            path="/employees"
            element={<h1>Employees</h1>}
          />

          <Route
            path="/projects"
            element={<h1>Projects</h1>}
          />

          <Route
            path="/tasks"
            element={<h1>Tasks</h1>}
          />

        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes