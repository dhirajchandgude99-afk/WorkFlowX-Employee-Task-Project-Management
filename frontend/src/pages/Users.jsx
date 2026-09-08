import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getUsers,
  deleteUser,
} from '../services/api'
import './Users.css'

function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadUsers = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getUsers()

      setUsers(data || [])
    } catch (error) {
      console.error('Failed to load users:', error)

      if (error.status === 401) {
        setError('Your session has expired. Please login again.')
      } else if (error.status === 403) {
        setError(
          'You do not have permission to view users.'
        )
      } else if (error.status >= 500) {
        setError(
          'Server error. Please try again later.'
        )
      } else {
        setError(
          'Unable to load users. Please try again.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadUsers()
  }, [])

  const handleDelete = async (id, username) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete user "${username}"?`
    )

    if (!confirmed) {
      return
    }

    try {
      await deleteUser(id)

      setUsers((currentUsers) =>
        currentUsers.filter(
          (user) => user.id !== id
        )
      )
    } catch (error) {
      console.error('Failed to delete user:', error)

      if (error.status === 403) {
        alert(
          'You do not have permission to delete this user.'
        )
      } else if (error.status === 404) {
        alert('User was not found.')
        loadUsers()
      } else {
        alert(
          'Unable to delete user. Please try again.'
        )
      }
    }
  }

  const filteredUsers = users.filter((user) => {
    const username =
      user.username?.toLowerCase() || ''

    const role =
      user.role?.toLowerCase() || ''

    return (
      username.includes(
        searchTerm.toLowerCase()
      ) ||
      role.includes(
        searchTerm.toLowerCase()
      )
    )
  })

  return (
    <div className="users-page">

      {/* Header */}

      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>Manage WorkflowX users</p>
        </div>

        <button className="add-user-button">
          + Add User
        </button>
      </div>

      {/* Search */}

      <div className="users-toolbar">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>

      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={loadUsers}
        />
      )}

      {/* Loading */}

      {loading ? (
        <Loading message="Loading users..." />
      ) : error ? null : (
        /* Users Table */
        <div className="users-card">

          <div className="table-container">

            <table className="users-table">

              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>

                      <td className="username-cell">
                        {user.username}
                      </td>

                      <td>
                        <span
                          className={`role-badge role-${
                            user.role?.toLowerCase()
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <span className="status-badge">
                          Active
                        </span>
                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            className="edit-button"
                            onClick={() =>
                              alert(
                                'Edit functionality will be implemented soon.'
                              )
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-button"
                            onClick={() =>
                              handleDelete(
                                user.id,
                                user.username
                              )
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
                    <td colSpan="4">
                      <EmptyState
                        title="No users found"
                        message={
                          searchTerm
                            ? 'No users match your search.'
                            : 'There are currently no users.'
                        }
                      />
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </div>
      )}

    </div>
  )
}

export default Users