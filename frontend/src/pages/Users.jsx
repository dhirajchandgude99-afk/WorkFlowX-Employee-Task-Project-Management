import { useState } from 'react'
import './Users.css'

function Users() {
  const [searchTerm, setSearchTerm] = useState('')

  const users = [
    {
      id: 1,
      username: 'admin9',
      role: 'ADMIN',
      status: 'Active',
    },
    {
      id: 2,
      username: 'user1',
      role: 'USER',
      status: 'Active',
    },
    {
      id: 3,
      username: 'user2',
      role: 'USER',
      status: 'Active',
    },
    {
      id: 4,
      username: 'manager1',
      role: 'USER',
      status: 'Active',
    },
  ]

  const filteredUsers = users.filter((user) =>
    user.username
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  )

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
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Users Table */}

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
                        className={`role-badge role-${user.role.toLowerCase()}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <span className="status-badge">
                        {user.status}
                      </span>
                    </td>

                    <td>

                      <div className="action-buttons">

                        <button className="edit-button">
                          Edit
                        </button>

                        <button className="delete-button">
                          Delete
                        </button>

                      </div>

                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="4"
                    className="empty-users"
                  >
                    No users found
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  )
}

export default Users