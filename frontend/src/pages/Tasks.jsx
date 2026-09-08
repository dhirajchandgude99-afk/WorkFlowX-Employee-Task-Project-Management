import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getTasks,
  deleteTask,
} from '../services/api'
import './Tasks.css'

function Tasks() {
  const [tasks, setTasks] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchTasks = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getTasks()

      setTasks(data || [])
    } catch (error) {
      console.error('Failed to fetch tasks:', error)

      if (error.status === 401 || error.status === 403) {
        setError(
          'You are not authorized to view tasks.'
        )
      } else {
        setError(
          error.message || 'Failed to load tasks.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [])

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this task?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteTask(id)

      setTasks((currentTasks) =>
        currentTasks.filter(
          (task) => task.id !== id
        )
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

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase()

    return (
      task.title?.toLowerCase().includes(search) ||
      task.description?.toLowerCase().includes(search) ||
      task.priority?.toLowerCase().includes(search) ||
      task.status?.toLowerCase().includes(search) ||
      String(task.employeeId ?? '').includes(search) ||
      String(task.projectId ?? '').includes(search)
    )
  })

  const formatPriority = (priority) => {
    if (!priority) {
      return '-'
    }

    return priority
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  const formatStatus = (status) => {
    if (!status) {
      return '-'
    }

    return status
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      )
  }

  const getPriorityClass = (priority) => {
    const normalizedPriority =
      priority?.toLowerCase()

    return `priority-${normalizedPriority || 'default'}`
  }

  const getStatusClass = (status) => {
    const normalizedStatus =
      status?.toLowerCase()

    if (
      normalizedStatus === 'completed'
    ) {
      return 'task-status-completed'
    }

    if (
      normalizedStatus === 'in_progress' ||
      normalizedStatus === 'in progress'
    ) {
      return 'task-status-in-progress'
    }

    return 'task-status-pending'
  }

  return (
    <div className="tasks-page">

      {/* Header */}

      <div className="tasks-header">

        <div>
          <h1>Tasks</h1>
          <p>Manage WorkflowX tasks</p>
        </div>

        <button
          className="add-task-button"
          onClick={() => {
            alert(
              'Add Task functionality will be added later.'
            )
          }}
        >
          + Add Task
        </button>

      </div>

      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchTasks}
        />
      )}

      {/* Search */}

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

      {/* Task Table */}

      <div className="tasks-card">

        {loading ? (
          <Loading message="Loading tasks..." />
        ) : (
          <div className="table-container">

            <table className="tasks-table">

              <thead>

                <tr>
                  <th>Task Name</th>
                  <th>Assigned Employee ID</th>
                  <th>Project ID</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due Date</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredTasks.length > 0 ? (
                  filteredTasks.map((task) => (
                    <tr key={task.id}>

                      <td className="task-name">
                        {task.title}
                      </td>

                      <td>
                        {task.employeeId ?? '-'}
                      </td>

                      <td>
                        {task.projectId ?? '-'}
                      </td>

                      <td>

                        <span
                          className={`priority-badge ${getPriorityClass(
                            task.priority
                          )}`}
                        >
                          {formatPriority(
                            task.priority
                          )}
                        </span>

                      </td>

                      <td>

                        <span
                          className={`task-status ${getStatusClass(
                            task.status
                          )}`}
                        >
                          {formatStatus(
                            task.status
                          )}
                        </span>

                      </td>

                      <td>
                        {task.dueDate || '-'}
                      </td>

                      <td>

                        <div className="task-actions">

                          <button
                            className="edit-task-button"
                            onClick={() => {
                              alert(
                                'Edit Task functionality will be added later.'
                              )
                            }}
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

                    <td colSpan="7">

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