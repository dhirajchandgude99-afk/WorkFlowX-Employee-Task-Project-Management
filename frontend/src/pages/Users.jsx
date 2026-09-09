import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} from '../services/api'
import './Users.css'

function Users() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    role: 'USER',
  })

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getUsers()

      setUsers(data || [])
    } catch (error) {
      console.error('Failed to fetch users:', error)

      if (error.status === 401 || error.status === 403) {
        setError('You are not authorized to view users.')
      } else {
        setError(error.message || 'Failed to load users.')
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  /*
   * OPEN ADD FORM
   */
  const handleAddUser = () => {
    setEditingUser(null)

    setFormData({
      username: '',
      password: '',
      role: 'USER',
    })

    setError('')
    setShowForm(true)
  }

  /*
   * OPEN EDIT FORM
   */
  const handleEditUser = (user) => {
    setEditingUser(user)

    setFormData({
      username: user.username || '',
      password: '',
      role: user.role || 'USER',
    })

    setError('')
    setShowForm(true)
  }

  /*
   * CLOSE FORM
   */
  const handleCancel = () => {
    setShowForm(false)
    setEditingUser(null)

    setFormData({
      username: '',
      password: '',
      role: 'USER',
    })
  }

  /*
   * HANDLE INPUT
   */
  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((current) => ({
      ...current,
      [name]: value,
    }))
  }

  /*
   * CREATE / UPDATE
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.username.trim()) {
      setError('Username is required.')
      return
    }

    if (!editingUser && !formData.password.trim()) {
      setError('Password is required.')
      return
    }

    if (!formData.role) {
      setError('Role is required.')
      return
    }

    try {
      setFormLoading(true)
      setError('')

      if (editingUser) {
        const updateData = {
          username: formData.username,
          role: formData.role,
        }

        /*
         * Only send password when user entered one.
         */
        if (formData.password.trim()) {
          updateData.password = formData.password
        }

        const updatedUser = await updateUser(
          editingUser.id,
          updateData
        )

        setUsers((currentUsers) =>
          currentUsers.map((user) =>
            user.id === editingUser.id
              ? updatedUser
              : user
          )
        )
      } else {
        const newUser = await createUser(formData)

        setUsers((currentUsers) => [
          ...currentUsers,
          newUser,
        ])
      }

      handleCancel()
    } catch (error) {
      console.error('Failed to save user:', error)

      if (error.status === 400) {
        setError(
          error.message || 'Invalid user information.'
        )
      } else if (error.status === 403) {
        setError(
          'You are not authorized to create or update users.'
        )
      } else {
        setError(
          error.message || 'Failed to save user.'
        )
      }
    } finally {
      setFormLoading(false)
    }
  }

  /*
   * DELETE
   */
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      'Are you sure you want to delete this user?'
    )

    if (!confirmed) {
      return
    }

    try {
      setError('')

      await deleteUser(id)

      setUsers((currentUsers) =>
        currentUsers.filter((user) => user.id !== id)
      )
    } catch (error) {
      console.error('Failed to delete user:', error)

      if (error.status === 403) {
        setError(
          'You are not authorized to delete this user.'
        )
      } else if (error.status === 404) {
        setError('User was not found.')
      } else {
        setError(
          error.message || 'Failed to delete user.'
        )
      }
    }
  }

  /*
   * SEARCH
   */
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase()

    return (
      user.username?.toLowerCase().includes(search) ||
      user.role?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="users-page">

      <div className="users-header">
        <div>
          <h1>Users</h1>
          <p>Manage WorkflowX users</p>
        </div>

        <button
          className="add-user-button"
          onClick={handleAddUser}
        >
          + Add User
        </button>
      </div>

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchUsers}
        />
      )}

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

      {showForm && (
        <div className="user-form-card">

          <div className="user-form-header">
            <h2>
              {editingUser
                ? 'Edit User'
                : 'Add User'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            <div className="user-form-group">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="user-form-group">
              <label htmlFor="password">
                {editingUser
                  ? 'New Password (optional)'
                  : 'Password'}
              </label>

              <input
                id="password"
                name="password"
                type="password"
                placeholder={
                  editingUser
                    ? 'Leave blank to keep current password'
                    : 'Enter password'
                }
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="user-form-group">
              <label htmlFor="role">
                Role
              </label>

              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="USER">
                  USER
                </option>

                <option value="ADMIN">
                  ADMIN
                </option>
              </select>
            </div>

            <div className="user-form-actions">

              <button
                type="submit"
                className="save-user-button"
                disabled={formLoading}
              >
                {formLoading
                  ? 'Saving...'
                  : editingUser
                    ? 'Update User'
                    : 'Create User'}
              </button>

              <button
                type="button"
                className="cancel-user-button"
                onClick={handleCancel}
                disabled={formLoading}
              >
                Cancel
              </button>

            </div>

          </form>
        </div>
      )}

      <div className="users-card">

        {loading ? (
          <Loading message="Loading users..." />
        ) : (
          <div className="table-container">

            <table className="users-table">

              <thead>
                <tr>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {filteredUsers.length > 0 ? (

                  filteredUsers.map((user) => (

                    <tr key={user.id}>

                      <td className="user-name">
                        {user.username}
                      </td>

                      <td>
                        <span className="user-role-badge">
                          {user.role}
                        </span>
                      </td>

                      <td>
                        <div className="user-actions">

                          <button
                            className="edit-user-button"
                            onClick={() =>
                              handleEditUser(user)
                            }
                          >
                            Edit
                          </button>

                          <button
                            className="delete-user-button"
                            onClick={() =>
                              handleDelete(user.id)
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
                      colSpan="3"
                      className="empty-users"
                    >
                      <EmptyState
                        title={
                          searchTerm
                            ? 'No users found'
                            : 'No users available'
                        }
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
        )}

      </div>

    </div>
  )
}

export default Users