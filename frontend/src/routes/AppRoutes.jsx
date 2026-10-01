import { BrowserRouter, Routes, Route } from 'react-router-dom'

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import Users from '../pages/Users'
import Employees from '../pages/Employees'
import Projects from '../pages/Projects'
import Tasks from '../pages/Tasks'
import Signup from '../pages/Signup'
import ProtectedRoute from './ProtectedRoute'
import RoleProtectedRoute from './RoleProtectedRoute'
import MainLayout from '../layouts/MainLayout'

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<h1>WorkflowX Home</h1>}
        />

        <Route
          path="/login"
          element={<Login />}
        />
          <Route
            path="/signup"
            element={<Signup />}
           />

        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            <Route element={<RoleProtectedRoute role="ADMIN" />}>
              <Route
                path="/users"
                element={<Users />}
              />
            </Route>

            <Route
              path="/employees"
              element={<Employees />}
            />

            <Route
              path="/projects"
              element={<Projects />}
            />

            <Route
              path="/tasks"
              element={<Tasks />}
            />

          </Route>
        </Route>

      </Routes>
    </BrowserRouter>
  )
}

export default AppRoutes