import { useEffect, useState } from 'react'
import './Projects.css'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getProjects,
  deleteProject,
} from '../services/api'

function Projects() {
  const [projects, setProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProjects()

      setProjects(data || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)

      if (error.status === 401 || error.status === 403) {
        setError(
          'You are not authorized to view projects.'
        )
      } else {
        setError(
          error.message || 'Failed to load projects.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProjects()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteProject(id)

      setProjects((currentProjects) =>
        currentProjects.filter(
          (project) => project.id !== id
        )
      )
    } catch (error) {
      console.error('Failed to delete project:', error)

      if (error.status === 403) {
        setError(
          'Project cannot be deleted because this project is being used by existing tasks.'
        )
      } else if (error.status === 404) {
        setError('Project was not found.')
      } else {
        setError(
          error.message || 'Failed to delete project.'
        )
      }
    }
  }

  const filteredProjects = projects.filter((project) => {
    const search = searchTerm.toLowerCase()

    return (
      project.name?.toLowerCase().includes(search) ||
      project.description?.toLowerCase().includes(search) ||
      project.status?.toLowerCase().includes(search) ||
      String(project.managerId ?? '').includes(search)
    )
  })

  const getStatusClass = (status) => {
    const normalizedStatus = status?.toLowerCase()

    if (normalizedStatus === 'completed') {
      return 'status-completed'
    }

    if (
      normalizedStatus === 'in progress' ||
      normalizedStatus === 'in_progress'
    ) {
      return 'status-in-progress'
    }

    return 'status-pending'
  }

  return (
    <div className="projects-page">

      {/* Header */}

      <div className="projects-header">

        <div>
          <h1>Projects</h1>
          <p>Manage WorkflowX projects</p>
        </div>

        <button
          className="add-project-button"
          onClick={() => {
            alert(
              'Add Project functionality will be added later.'
            )
          }}
        >
          + Add Project
        </button>

      </div>

      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchProjects}
        />
      )}

      {/* Search */}

      <div className="projects-toolbar">

        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      {/* Project Table */}

      <div className="projects-card">

        {loading ? (
          <Loading message="Loading projects..." />
        ) : (
          <div className="table-container">

            <table className="projects-table">

              <thead>

                <tr>
                  <th>Project Name</th>
                  <th>Project Manager ID</th>
                  <th>Status</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project) => (
                    <tr key={project.id}>

                      <td className="project-name">
                        {project.name}
                      </td>

                      <td>
                        {project.managerId ?? '-'}
                      </td>

                      <td>

                        <span
                          className={`project-status ${getStatusClass(
                            project.status
                          )}`}
                        >
                          {project.status || '-'}
                        </span>

                      </td>

                      <td>
                        {project.startDate || '-'}
                      </td>

                      <td>
                        {project.endDate || '-'}
                      </td>

                      <td>

                        <div className="project-actions">

                          <button
                            className="edit-project-button"
                            onClick={() => {
                              alert(
                                'Edit Project functionality will be added later.'
                              )
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-project-button"
                            onClick={() =>
                              handleDelete(project.id)
                            }
                          >
                            Delete
                          </button>

                        </div>

                      </td>

                    </tr>
                  ))
                ) : (
                  <tr>

                    <td colSpan="6">

                      <EmptyState
                        title={
                          searchTerm
                            ? 'No projects found'
                            : 'No projects available'
                        }
                        message={
                          searchTerm
                            ? 'No projects match your search.'
                            : 'There are currently no projects.'
                        }
                      />

                    </td>

                  </tr>
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>

    </div>
  )
}

export default Projects