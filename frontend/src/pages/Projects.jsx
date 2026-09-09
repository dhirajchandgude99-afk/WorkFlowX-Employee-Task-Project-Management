import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getEmployees,
} from '../services/api'
import './Projects.css'

function Projects() {
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    endDate: '',
    status: '',
    managerId: '',
  })

  // =========================
  // FETCH PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getProjects()

      setProjects(data || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)

      if (error.status === 401 || error.status === 403) {
        setError('You are not authorized to view projects.')
      } else {
        setError(error.message || 'Failed to load projects.')
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FETCH EMPLOYEES
  // =========================

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees()

      setEmployees(data || [])
    } catch (error) {
      console.error('Failed to fetch employees:', error)
    }
  }

  useEffect(() => {
    fetchProjects()
    fetchEmployees()
  }, [])

  // =========================
  // ADD PROJECT
  // =========================

  const handleAddProject = () => {
    setEditingProject(null)

    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: '',
      managerId: '',
    })

    setError('')
    setShowForm(true)
  }

  // =========================
  // EDIT PROJECT
  // =========================

  const handleEditProject = (project) => {
    setEditingProject(project)

    setFormData({
      name: project.name || '',
      description: project.description || '',
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      status: project.status || '',
      managerId: project.managerId
        ? String(project.managerId)
        : '',
    })

    setError('')
    setShowForm(true)
  }

  // =========================
  // CANCEL
  // =========================

  const handleCancel = () => {
    setShowForm(false)
    setEditingProject(null)

    setFormData({
      name: '',
      description: '',
      startDate: '',
      endDate: '',
      status: '',
      managerId: '',
    })
  }

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // =========================
  // CREATE / UPDATE PROJECT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Frontend validation
    if (!formData.name.trim()) {
      setError('Project name is required.')
      return
    }

    if (!formData.description.trim()) {
      setError('Project description is required.')
      return
    }

    if (!formData.startDate) {
      setError('Start date is required.')
      return
    }

    if (!formData.endDate) {
      setError('End date is required.')
      return
    }

    if (formData.endDate < formData.startDate) {
      setError('End date cannot be before start date.')
      return
    }

    if (!formData.status.trim()) {
      setError('Project status is required.')
      return
    }

    if (!formData.managerId) {
      setError('Project manager is required.')
      return
    }

    const projectData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      startDate: formData.startDate,
      endDate: formData.endDate,
      status: formData.status.trim(),
      managerId: Number(formData.managerId),
    }

    try {
      setFormLoading(true)
      setError('')

      // UPDATE
      if (editingProject) {
        const updatedProject = await updateProject(
          editingProject.id,
          projectData
        )

        setProjects((currentProjects) =>
          currentProjects.map((project) =>
            project.id === editingProject.id
              ? updatedProject
              : project
          )
        )
      }

      // CREATE
      else {
        const newProject = await createProject(projectData)

        setProjects((currentProjects) => [
          ...currentProjects,
          newProject,
        ])
      }

      handleCancel()
    } catch (error) {
      console.error('Failed to save project:', error)

      if (error.status === 400) {
        setError(
          error.message || 'Invalid project information.'
        )
      } else if (error.status === 403) {
        setError(
          'You are not authorized to create or update projects.'
        )
      } else if (error.status === 404) {
        setError(
          'The selected manager employee was not found.'
        )
      } else {
        setError(
          error.message || 'Failed to save project.'
        )
      }
    } finally {
      setFormLoading(false)
    }
  }

  // =========================
  // DELETE PROJECT
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    )

    if (!confirmed) return

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
          'Project cannot be deleted because tasks are assigned to this project.'
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

  // =========================
  // SEARCH
  // =========================

  const filteredProjects = projects.filter((project) => {
    const search = searchTerm.toLowerCase()

    return (
      project.name
        ?.toLowerCase()
        .includes(search) ||

      project.description
        ?.toLowerCase()
        .includes(search) ||

      project.status
        ?.toLowerCase()
        .includes(search) ||

      String(project.managerId ?? '')
        .includes(search)
    )
  })

  // =========================
  // STATUS CLASS
  // =========================

  const getStatusClass = (status) => {
    if (!status) return ''

    const normalizedStatus = status
      .toLowerCase()
      .replace(/\s+/g, '-')

    return `project-status ${normalizedStatus}`
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="projects-page">

      {/* HEADER */}

      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage WorkflowX projects</p>
        </div>

        <button
          className="add-project-button"
          onClick={handleAddProject}
        >
          + Add Project
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchProjects}
        />
      )}

      {/* SEARCH */}

      <div className="projects-toolbar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* FORM */}

      {showForm && (
        <div className="project-form-card">

          <div className="project-form-header">
            <h2>
              {editingProject
                ? 'Edit Project'
                : 'Add Project'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}

            <div className="project-form-group">
              <label htmlFor="project-name">
                Project Name
              </label>

              <input
                id="project-name"
                name="name"
                type="text"
                placeholder="Enter project name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION */}

            <div className="project-form-group">
              <label htmlFor="project-description">
                Description
              </label>

              <textarea
                id="project-description"
                name="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* START DATE */}

            <div className="project-form-group">
              <label htmlFor="project-start-date">
                Start Date
              </label>

              <input
                id="project-start-date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
              />
            </div>

            {/* END DATE */}

            <div className="project-form-group">
              <label htmlFor="project-end-date">
                End Date
              </label>

              <input
                id="project-end-date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
              />
            </div>

            {/* STATUS */}

            <div className="project-form-group">
              <label htmlFor="project-status">
                Status
              </label>

              <select
                id="project-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="">
                  Select Status
                </option>

                <option value="TODO">
                  TODO
                </option>

                <option value="IN_PROGRESS">
                  IN_PROGRESS
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

                <option value="ON_HOLD">
                  ON_HOLD
                </option>

                <option value="ACTIVE">
                  ACTIVE
                </option>
              </select>
            </div>

            {/* MANAGER */}

            <div className="project-form-group">
              <label htmlFor="project-manager">
                Project Manager
              </label>

              <select
                id="project-manager"
                name="managerId"
                value={formData.managerId}
                onChange={handleChange}
              >
                <option value="">
                  Select Manager
                </option>

                {employees.map((employee) => (
                  <option
                    key={employee.id}
                    value={employee.id}
                  >
                    {employee.name} (ID: {employee.id})
                  </option>
                ))}
              </select>
            </div>

            {/* FORM BUTTONS */}

            <div className="project-form-actions">

              <button
                type="submit"
                className="save-project-button"
                disabled={formLoading}
              >
                {formLoading
                  ? 'Saving...'
                  : editingProject
                    ? 'Update Project'
                    : 'Create Project'}
              </button>

              <button
                type="button"
                className="cancel-project-button"
                onClick={handleCancel}
                disabled={formLoading}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* PROJECT TABLE */}

      <div className="projects-card">

        {loading ? (
          <Loading message="Loading projects..." />
        ) : (
          <div className="table-container">

            <table className="projects-table">

              <thead>
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Status</th>
                  <th>Manager ID</th>
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
                        {project.description}
                      </td>

                      <td>
                        {project.startDate}
                      </td>

                      <td>
                        {project.endDate}
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            project.status
                          )}
                        >
                          {project.status}
                        </span>
                      </td>

                      <td>
                        {project.managerId ?? '-'}
                      </td>

                      <td>

                        <div className="project-actions">

                          <button
                            className="edit-project-button"
                            onClick={() =>
                              handleEditProject(project)
                            }
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

                    <td
                      colSpan="7"
                      className="empty-projects"
                    >
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