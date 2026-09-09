import { useEffect, useState } from 'react'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getUsers,
  getEmployees,
  getProjects,
  getTasks,
} from '../services/api'
import './Dashboard.css'

function Dashboard() {
  const [users, setUsers] = useState([])
  const [employees, setEmployees] = useState([])
  const [projects, setProjects] = useState([])
  const [tasks, setTasks] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // =========================
  // FETCH DASHBOARD DATA
  // =========================

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      setError('')

      const [
        usersData,
        employeesData,
        projectsData,
        tasksData,
      ] = await Promise.all([
        getUsers(),
        getEmployees(),
        getProjects(),
        getTasks(),
      ])

      setUsers(usersData || [])
      setEmployees(employeesData || [])
      setProjects(projectsData || [])
      setTasks(tasksData || [])
    } catch (error) {
      console.error(
        'Failed to fetch dashboard data:',
        error
      )

      if (error.status === 401 || error.status === 403) {
        setError(
          'You are not authorized to view dashboard statistics.'
        )
      } else {
        setError(
          error.message ||
          'Failed to load dashboard statistics.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // =========================
  // TASK COUNTS
  // =========================

  const todoTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === 'TODO'
  ).length

  const inProgressTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === 'IN_PROGRESS'
  ).length

  const completedTasks = tasks.filter(
    (task) =>
      task.status?.toUpperCase() === 'COMPLETED'
  ).length

  // =========================
  // PROJECT COUNTS
  // =========================

  const activeProjects = projects.filter(
    (project) =>
      project.status?.toUpperCase() === 'ACTIVE'
  ).length

  const inProgressProjects = projects.filter(
    (project) =>
      project.status
        ?.toUpperCase()
        .replace(/\s+/g, '_') === 'IN_PROGRESS'
  ).length

  const completedProjects = projects.filter(
    (project) =>
      project.status?.toUpperCase() === 'COMPLETED'
  ).length

  // =========================
  // RENDER
  // =========================

  return (
    <div className="dashboard-page">

      {/* HEADER */}

      <div className="dashboard-header">

        <div>
          <h1>Dashboard</h1>

          <p>
            WorkflowX overview and statistics
          </p>
        </div>

        <button
          className="refresh-dashboard-button"
          onClick={fetchDashboardData}
          disabled={loading}
        >
          {loading ? 'Refreshing...' : '↻ Refresh'}
        </button>

      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchDashboardData}
        />
      )}

      {/* LOADING */}

      {loading ? (
        <Loading message="Loading dashboard..." />
      ) : (
        <>
          {/* =========================
              STAT CARDS
          ========================= */}

          <div className="dashboard-stat-grid">

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                👥
              </div>

              <div>
                <h3>Total Users</h3>
                <p>{users.length}</p>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                👨‍💼
              </div>

              <div>
                <h3>Total Employees</h3>
                <p>{employees.length}</p>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                📁
              </div>

              <div>
                <h3>Total Projects</h3>
                <p>{projects.length}</p>
              </div>
            </div>

            <div className="dashboard-stat-card">
              <div className="dashboard-stat-icon">
                📋
              </div>

              <div>
                <h3>Total Tasks</h3>
                <p>{tasks.length}</p>
              </div>
            </div>

          </div>

          {/* =========================
              TASK SUMMARY
          ========================= */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">
              <h2>Task Overview</h2>
            </div>

            <div className="dashboard-summary-grid">

              <div className="dashboard-summary-card todo-summary">
                <span>TODO</span>
                <strong>{todoTasks}</strong>
              </div>

              <div className="dashboard-summary-card progress-summary">
                <span>IN PROGRESS</span>
                <strong>
                  {inProgressTasks}
                </strong>
              </div>

              <div className="dashboard-summary-card completed-summary">
                <span>COMPLETED</span>
                <strong>
                  {completedTasks}
                </strong>
              </div>

            </div>

          </div>

          {/* =========================
              PROJECT SUMMARY
          ========================= */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">
              <h2>Project Overview</h2>
            </div>

            <div className="dashboard-summary-grid">

              <div className="dashboard-summary-card active-summary">
                <span>ACTIVE</span>
                <strong>
                  {activeProjects}
                </strong>
              </div>

              <div className="dashboard-summary-card progress-summary">
                <span>IN PROGRESS</span>
                <strong>
                  {inProgressProjects}
                </strong>
              </div>

              <div className="dashboard-summary-card completed-summary">
                <span>COMPLETED</span>
                <strong>
                  {completedProjects}
                </strong>
              </div>

            </div>

          </div>

          {/* =========================
              QUICK SUMMARY
          ========================= */}

          <div className="dashboard-section">

            <div className="dashboard-section-header">
              <h2>System Summary</h2>
            </div>

            <div className="dashboard-summary-list">

              <div className="dashboard-summary-row">
                <span>Users</span>
                <strong>{users.length}</strong>
              </div>

              <div className="dashboard-summary-row">
                <span>Employees</span>
                <strong>
                  {employees.length}
                </strong>
              </div>

              <div className="dashboard-summary-row">
                <span>Projects</span>
                <strong>
                  {projects.length}
                </strong>
              </div>

              <div className="dashboard-summary-row">
                <span>Tasks</span>
                <strong>{tasks.length}</strong>
              </div>

            </div>

          </div>

        </>
      )}

    </div>
  )
}

export default Dashboard