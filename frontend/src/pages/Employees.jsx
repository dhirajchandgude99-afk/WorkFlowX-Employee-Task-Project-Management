import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  getUsers,
} from '../services/api'
import './Employees.css'

function Employees() {
  const [employees, setEmployees] = useState([])
  const [users, setUsers] = useState([])

  const [searchTerm, setSearchTerm] = useState('')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [showForm, setShowForm] = useState(false)
  const [editingEmployee, setEditingEmployee] = useState(null)

  const [formLoading, setFormLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    userId: '',
  })

  /*
   * FETCH EMPLOYEES
   */
  const fetchEmployees = async () => {
    try {
      setLoading(true)
      setError('')

      const data = await getEmployees()

      setEmployees(data || [])
    } catch (error) {
      console.error(
        'Failed to fetch employees:',
        error
      )

      if (
        error.status === 401 ||
        error.status === 403
      ) {
        setError(
          'You are not authorized to view employees.'
        )
      } else {
        setError(
          error.message ||
            'Failed to load employees.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  /*
   * FETCH USERS
   *
   * Needed because Employee requires userId.
   */
  const fetchUsers = async () => {
    try {
      const data = await getUsers()

      setUsers(data || [])
    } catch (error) {
      console.error(
        'Failed to fetch users:',
        error
      )

      /*
       * Do not stop the employee page from loading
       * if users cannot be loaded.
       */
    }
  }

  useEffect(() => {
    fetchEmployees()
    fetchUsers()
  }, [])

  /*
   * OPEN ADD FORM
   */
  const handleAddEmployee = () => {
    setEditingEmployee(null)

    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      userId: '',
    })

    setError('')
    setShowForm(true)
  }

  /*
   * OPEN EDIT FORM
   */
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee)

    setFormData({
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      designation: employee.designation || '',
      userId: employee.userId
        ? String(employee.userId)
        : '',
    })

    setError('')
    setShowForm(true)
  }

  /*
   * CLOSE FORM
   */
  const handleCancel = () => {
    setShowForm(false)
    setEditingEmployee(null)

    setFormData({
      name: '',
      email: '',
      phone: '',
      department: '',
      designation: '',
      userId: '',
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
   * CREATE / UPDATE EMPLOYEE
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      setError('Employee name is required.')
      return
    }

    if (!formData.email.trim()) {
      setError('Email is required.')
      return
    }

    if (!formData.department.trim()) {
      setError('Department is required.')
      return
    }

    if (!formData.designation.trim()) {
      setError('Designation is required.')
      return
    }

    if (!formData.userId) {
      setError('User ID is required.')
      return
    }

    const employeeData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      department: formData.department.trim(),
      designation: formData.designation.trim(),
      userId: Number(formData.userId),
    }

    try {
      setFormLoading(true)
      setError('')

      if (editingEmployee) {
        const updatedEmployee =
          await updateEmployee(
            editingEmployee.id,
            employeeData
          )

        setEmployees((currentEmployees) =>
          currentEmployees.map((employee) =>
            employee.id === editingEmployee.id
              ? updatedEmployee
              : employee
          )
        )
      } else {
        const newEmployee =
          await createEmployee(employeeData)

        setEmployees((currentEmployees) => [
          ...currentEmployees,
          newEmployee,
        ])
      }

      handleCancel()
    } catch (error) {
      console.error(
        'Failed to save employee:',
        error
      )

      if (error.status === 400) {
        setError(
          error.message ||
            'Invalid employee information.'
        )
      } else if (error.status === 403) {
        setError(
          'You are not authorized to create or update employees.'
        )
      } else if (error.status === 404) {
        setError(
          'The selected User ID was not found.'
        )
      } else {
        setError(
          error.message ||
            'Failed to save employee.'
        )
      }
    } finally {
      setFormLoading(false)
    }
  }

  /*
   * DELETE EMPLOYEE
   */
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
      console.error(
        'Failed to delete employee:',
        error
      )

      if (error.status === 403) {
        setError(
          'Employee cannot be deleted because this employee is assigned to existing projects or tasks.'
        )
      } else if (error.status === 404) {
        setError('Employee was not found.')
      } else {
        setError(
          error.message ||
            'Failed to delete employee.'
        )
      }
    }
  }

  /*
   * SEARCH
   */
  const filteredEmployees = employees.filter(
    (employee) => {
      const search = searchTerm.toLowerCase()

      return (
        employee.name
          ?.toLowerCase()
          .includes(search) ||
        employee.email
          ?.toLowerCase()
          .includes(search) ||
        employee.phone
          ?.toLowerCase()
          .includes(search) ||
        employee.department
          ?.toLowerCase()
          .includes(search) ||
        employee.designation
          ?.toLowerCase()
          .includes(search) ||
        String(
          employee.userId ?? ''
        ).includes(search)
      )
    }
  )

  return (
    <div className="employees-page">

      {/* HEADER */}
      <div className="employees-header">

        <div>
          <h1>Employees</h1>
          <p>
            Manage WorkflowX employees
          </p>
        </div>

        <button
          className="add-employee-button"
          onClick={handleAddEmployee}
        >
          + Add Employee
        </button>

      </div>

      {/* ERROR */}
      {error && (
        <ErrorMessage
          message={error}
          onRetry={fetchEmployees}
        />
      )}

      {/* SEARCH */}
      <div className="employees-toolbar">

        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) =>
            setSearchTerm(e.target.value)
          }
        />

      </div>

      {/* ADD / EDIT FORM */}
      {showForm && (
        <div className="employee-form-card">

          <div className="employee-form-header">
            <h2>
              {editingEmployee
                ? 'Edit Employee'
                : 'Add Employee'}
            </h2>
          </div>

          <form onSubmit={handleSubmit}>

            {/* NAME */}
            <div className="employee-form-group">

              <label htmlFor="employee-name">
                Name
              </label>

              <input
                id="employee-name"
                name="name"
                type="text"
                placeholder="Enter employee name"
                value={formData.name}
                onChange={handleChange}
              />

            </div>

            {/* EMAIL */}
            <div className="employee-form-group">

              <label htmlFor="employee-email">
                Email
              </label>

              <input
                id="employee-email"
                name="email"
                type="email"
                placeholder="Enter employee email"
                value={formData.email}
                onChange={handleChange}
              />

            </div>

            {/* PHONE */}
            <div className="employee-form-group">

              <label htmlFor="employee-phone">
                Phone
              </label>

              <input
                id="employee-phone"
                name="phone"
                type="text"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
              />

            </div>

            {/* DEPARTMENT */}
            <div className="employee-form-group">

              <label htmlFor="employee-department">
                Department
              </label>

              <input
                id="employee-department"
                name="department"
                type="text"
                placeholder="Enter department"
                value={formData.department}
                onChange={handleChange}
              />

            </div>

            {/* DESIGNATION */}
            <div className="employee-form-group">

              <label htmlFor="employee-designation">
                Designation
              </label>

              <input
                id="employee-designation"
                name="designation"
                type="text"
                placeholder="Enter designation"
                value={formData.designation}
                onChange={handleChange}
              />

            </div>

            {/* USER */}
            <div className="employee-form-group">

              <label htmlFor="employee-user">
                User
              </label>

              <select
                id="employee-user"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
              >

                <option value="">
                  Select User
                </option>

                {users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.username} (ID: {user.id})
                  </option>
                ))}

              </select>

            </div>

            {/* FORM BUTTONS */}
            <div className="employee-form-actions">

              <button
                type="submit"
                className="save-employee-button"
                disabled={formLoading}
              >
                {formLoading
                  ? 'Saving...'
                  : editingEmployee
                    ? 'Update Employee'
                    : 'Create Employee'}
              </button>

              <button
                type="button"
                className="cancel-employee-button"
                onClick={handleCancel}
                disabled={formLoading}
              >
                Cancel
              </button>

            </div>

          </form>

        </div>
      )}

      {/* EMPLOYEE TABLE */}
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

                  filteredEmployees.map(
                    (employee) => (
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
                              onClick={() =>
                                handleEditEmployee(
                                  employee
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              className="delete-employee-button"
                              onClick={() =>
                                handleDelete(
                                  employee.id
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )

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