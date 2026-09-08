import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getEmployees,
  deleteEmployee,
} from '../services/api'
import './Employees.css'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getEmployees()

      setEmployees(data || [])
    } catch (error) {
      console.error('Failed to fetch employees:', error)

      if (error.status === 401 || error.status === 403) {
        setError('You are not authorized to view employees.')
      } else {
        setError(
          error.message || 'Failed to load employees.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])

  const handleDelete = async (id) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this employee?'
  )

  if (!confirmed) {
    return
  }

  try {
    setError('')

    await deleteEmployee(id)

    setEmployees((currentEmployees) =>
      currentEmployees.filter(
        (employee) => employee.id !== id
      )
    )
  } catch (error) {
    console.error('Failed to delete employee:', error)

    if (error.status === 403) {
      setError(
        'Employee cannot be deleted because this employee is assigned to existing projects or tasks.'
      )
    } else if (error.status === 404) {
      setError('Employee was not found.')
    } else {
      setError(
        error.message || 'Failed to delete employee.'
      )
      }
    }
  }

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase()

    return (
      employee.name?.toLowerCase().includes(search) ||
      employee.email?.toLowerCase().includes(search) ||
      employee.department?.toLowerCase().includes(search) ||
      employee.designation?.toLowerCase().includes(search)
    )
  })

  return (
    <div className="employees-page">

      {/* Header */}

      <div className="employees-header">

        <div>
          <h1>Employees</h1>
          <p>Manage WorkflowX employees</p>
        </div>

        <button
          className="add-employee-button"
          onClick={() => {
            alert('Add Employee functionality will be added later.')
          }}
        >
          + Add Employee
        </button>

      </div>

      {/* Error */}

      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchEmployees}
        />
      )}

      {/* Search */}

      <div className="employees-toolbar">

        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

      </div>

      {/* Employee Table */}

      <div className="employees-card">

        {loading ? (
          <Loading message="Loading employees..." />
        ) : (
          <div className="table-container">

            <table className="employees-table">

              <thead>

                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>User ID</th>
                  <th>Actions</th>
                </tr>

              </thead>

              <tbody>

                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map((employee) => (
                    <tr key={employee.id}>

                      <td className="employee-name">
                        {employee.name}
                      </td>

                      <td>
                        {employee.email}
                      </td>

                      <td>
                        <span className="department-badge">
                          {employee.department}
                        </span>
                      </td>

                      <td>
                        {employee.designation}
                      </td>

                      <td>
                        {employee.userId ?? '-'}
                      </td>

                      <td>

                        <div className="employee-actions">

                          <button
                            className="edit-employee-button"
                            onClick={() => {
                              alert(
                                'Edit Employee functionality will be added later.'
                              )
                            }}
                          >
                            Edit
                          </button>

                          <button
                            className="delete-employee-button"
                            onClick={() =>
                              handleDelete(employee.id)
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
                      colSpan="6"
                      className="empty-employees"
                    >
                      <EmptyState
                        title={
                          searchTerm
                            ? 'No employees found'
                            : 'No employees available'
                        }
                        message={
                          searchTerm
                            ? 'No employees match your search.'
                            : 'There are currently no employees.'
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

export default Employees