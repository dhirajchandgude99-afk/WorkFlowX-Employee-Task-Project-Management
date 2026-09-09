import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
  getProjects,
  getEmployees,
} from '../services/api'
import './Tasks.css'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [projects, setProjects] = useState([])
  const [employees, setEmployees] = useState([])

  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: '',
    status: '',
    dueDate: '',
    projectId: '',
    employeeId: '',
  })

  // =========================
  // FETCH TASKS
  // =========================

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getTasks()

      setTasks(data || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)

      if (error.status === 401 || error.status === 403) {
        setError('You are not authorized to view tasks.')
      } else {
        setError(error.message || 'Failed to load tasks.')
      }
    } finally {
      setLoading(false)
    }
  }

  // =========================
  // FETCH PROJECTS
  // =========================

  const fetchProjects = async () => {
    try {
      const data = await getProjects()

      setProjects(data || [])
    } catch (error) {
      console.error('Failed to fetch projects:', error)
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
    fetchTasks()
    fetchProjects()
    fetchEmployees()
  }, [])

  // =========================
  // ADD TASK
  // =========================

  const handleAddTask = () => {
    setEditingTask(null)

    setFormData({
      title: '',
      description: '',
      priority: '',
      status: '',
      dueDate: '',
      projectId: '',
      employeeId: '',
    })

    setError('')
    setShowForm(true)
  }

  // =========================
  // EDIT TASK
  // =========================

  const handleEditTask = (task) => {
    setEditingTask(task)

    setFormData({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || '',
      status: task.status || '',
      dueDate: task.dueDate || '',
      projectId: task.projectId
        ? String(task.projectId)
        : '',
      employeeId: task.employeeId
        ? String(task.employeeId)
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
    setEditingTask(null)

    setFormData({
      title: '',
      description: '',
      priority: '',
      status: '',
      dueDate: '',
      projectId: '',
      employeeId: '',
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
  // CREATE / UPDATE TASK
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Frontend validation
    if (!formData.title.trim()) {
      setError('Task title is required.')
      return
    }

    if (!formData.description.trim()) {
      setError('Task description is required.')
      return
    }

    if (!formData.priority) {
      setError('Task priority is required.')
      return
    }

    if (!formData.status) {
      setError('Task status is required.')
      return
    }

    if (!formData.dueDate) {
      setError('Task due date is required.')
      return
    }

    if (!formData.projectId) {
      setError('Project is required.')
      return
    }

    if (!formData.employeeId) {
      setError('Employee is required.')
      return
    }

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      priority: formData.priority,
      status: formData.status,
      dueDate: formData.dueDate,
      projectId: Number(formData.projectId),
      employeeId: Number(formData.employeeId),
    }

    try {
      setFormLoading(true)
      setError('')

      // UPDATE
      if (editingTask) {
        const updatedTask = await updateTask(
          editingTask.id,
          taskData
        )

        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === editingTask.id
              ? updatedTask
              : task
          )
        )
      }

      // CREATE
      else {
        const newTask = await createTask(taskData)

        setTasks((currentTasks) => [
          ...currentTasks,
          newTask,
        ])
      }

      handleCancel()
    } catch (error) {
      console.error('Failed to save task:', error)

      if (error.status === 400) {
        setError(
          error.message || 'Invalid task information.'
        )
      } else if (error.status === 403) {
        setError(
          'You are not authorized to create or update tasks.'
        )
      } else if (error.status === 404) {
        setError(
          'The selected Project or Employee was not found.'
        )
      } else {
        setError(
          error.message || 'Failed to save task.'
        )
      }
    } finally {
      setFormLoading(false)
    }
  }

  // =========================
  // DELETE TASK
  // =========================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) return

    try {
      setError('')

      await deleteTask(id)

      setTasks((currentTasks) =>
        currentTasks.filter((task) => task.id !== id)
      )
    } catch (error) {
      console.error('Failed to delete task:', error)

      if (error.status === 403) {
        setError(
          'You are not authorized to delete this task.'
        )
      } else if (error.status === 404) {
        setError('Task was not found.')
      } else {
        setError(
          error.message || 'Failed to delete task.'
        )
      }
    }
  }

  // =========================
  // SEARCH
  // =========================

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase()

    return (
      task.title
        ?.toLowerCase()
        .includes(search) ||

      task.description
        ?.toLowerCase()
        .includes(search) ||

      task.priority
        ?.toLowerCase()
        .includes(search) ||

      task.status
        ?.toLowerCase()
        .includes(search) ||

      String(task.projectId ?? '')
        .includes(search) ||

      String(task.employeeId ?? '')
        .includes(search)
    )
  })

  // =========================
  // FORMAT PRIORITY
  // =========================

  const getPriorityClass = (priority) => {
    if (!priority) return ''

    const normalizedPriority = priority
      .toLowerCase()
      .replace(/\s+/g, '-')

    return `task-priority ${normalizedPriority}`
  }

  // =========================
  // FORMAT STATUS
  // =========================

  const getStatusClass = (status) => {
    if (!status) return ''

    const normalizedStatus = status
      .toLowerCase()
      .replace(/\s+/g, '-')

    return `task-status ${normalizedStatus}`
  }

  // =========================
  // UI
  // =========================

  return (
    <div className="tasks-page">

      {/* HEADER */}

      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage WorkflowX tasks</p>
        </div>

        <button
          className="add-task-button"
          onClick={handleAddTask}
        >
          + Add Task
        </button>
      </div>

      {/* ERROR */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchTasks}
        />
      )}

      {/* SEARCH */}

      <div className="tasks-toolbar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* FORM */}

      {showForm && (
        <div className="task-form-card">

          <div className="task-form-header">
            <h2>
              {editingTask
                ? 'Edit Task'
                : 'Add Task'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            {/* TITLE */}

            <div className="task-form-group">
              <label htmlFor="task-title">
                Title
              </label>

              <input
                id="task-title"
                name="title"
                type="text"
                placeholder="Enter task title"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* DESCRIPTION */}

            <div className="task-form-group">
              <label htmlFor="task-description">
                Description
              </label>

              <textarea
                id="task-description"
                name="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>

            {/* PRIORITY */}

            <div className="task-form-group">
              <label htmlFor="task-priority">
                Priority
              </label>

              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="">
                  Select Priority
                </option>

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>
              </select>
            </div>

            {/* STATUS */}

            <div className="task-form-group">
              <label htmlFor="task-status">
                Status
              </label>

              <select
                id="task-status"
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
              </select>
            </div>

            {/* DUE DATE */}

            <div className="task-form-group">
              <label htmlFor="task-due-date">
                Due Date
              </label>

              <input
                id="task-due-date"
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            </div>

            {/* PROJECT */}

            <div className="task-form-group">
              <label htmlFor="task-project">
                Project
              </label>

              <select
                id="task-project"
                name="projectId"
                value={formData.projectId}
                onChange={handleChange}
              >
                <option value="">
                  Select Project
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={project.id}
                  >
                    {project.name} (ID: {project.id})
                  </option>
                ))}
              </select>
            </div>

            {/* EMPLOYEE */}

            <div className="task-form-group">
              <label htmlFor="task-employee">
                Employee
              </label>

              <select
                id="task-employee"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleChange}
              >
                <option value="">
                  Select Employee
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

            {/* BUTTONS */}

            <div className="task-form-actions">

              <button
                type="submit"
                className="save-task-button"
                disabled={formLoading}
              >
                {formLoading
                  ? 'Saving...'
                  : editingTask
                    ? 'Update Task'
                    : 'Create Task'}
              </button>

              <button
                type="button"
                className="cancel-task-button"
                onClick={handleCancel}
                disabled={formLoading}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      {/* TASK TABLE */}

      <div className="tasks-card">

        {loading ? (
          <Loading message="Loading tasks..." />
        ) : (
          <div className="table-container">

            <table className="tasks-table">

              <thead>
                <tr>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Project ID</th>
                  <th>Employee ID</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredTasks.length > 0 ? (

                  filteredTasks.map((task) => (

                    <tr key={task.id}>

                      <td className="task-title">
                        {task.title}
                      </td>

                      <td>
                        {task.description}
                      </td>

                      <td>
                        <span
                          className={getPriorityClass(
                            task.priority
                          )}
                        >
                          {task.priority}
                        </span>
                      </td>

                      <td>
                        <span
                          className={getStatusClass(
                            task.status
                          )}
                        >
                          {task.status}
                        </span>
                      </td>

                      <td>
                        {task.dueDate}
                      </td>

                      <td>
                        {task.projectId ?? '-'}
                      </td>

                      <td>
                        {task.employeeId ?? '-'}
                      </td>

                      <td>

                        <div className="task-actions">

                          <button
                            className="edit-task-button"
                            onClick={() =>
                              handleEditTask(task)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-task-button"
                            onClick={() =>
                              handleDelete(task.id)
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
                      colSpan="8"
                      className="empty-tasks"
                    >
                      <EmptyState
                        title={
                          searchTerm
                            ? 'No tasks found'
                            : 'No tasks available'
                        }
                        message={
                          searchTerm
                            ? 'No tasks match your search.'
                            : 'There are currently no tasks.'
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

export default Tasks