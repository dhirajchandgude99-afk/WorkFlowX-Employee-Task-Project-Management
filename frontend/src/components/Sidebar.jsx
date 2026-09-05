import { NavLink } from 'react-router-dom'
import './Sidebar.css'

function Sidebar() {
  return (
    <aside className="sidebar">

      <div className="sidebar-menu">

        <NavLink
          to="/dashboard"
          className="sidebar-link"
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/users"
          className="sidebar-link"
        >
          Users
        </NavLink>

        <NavLink
          to="/employees"
          className="sidebar-link"
        >
          Employees
        </NavLink>

        <NavLink
          to="/projects"
          className="sidebar-link"
        >
          Projects
        </NavLink>

        <NavLink
          to="/tasks"
          className="sidebar-link"
        >
          Tasks
        </NavLink>

      </div>

    </aside>
  )
}

export default Sidebar