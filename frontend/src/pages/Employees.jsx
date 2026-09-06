import { useState } from 'react'
import './Employees.css'

function Employees() {
  const [searchTerm, setSearchTerm] = useState('')

  const employees = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john.doe@workflowx.com',
      department: 'IT',
      designation: 'Software Developer',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@workflowx.com',
      department: 'HR',
      designation: 'HR Manager',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Rahul Patil',
      email: 'rahul.patil@workflowx.com',
      department: 'Finance',
      designation: 'Accountant',
      status: 'Active',
    },
    {
      id: 4,
      name: 'Sneha Joshi',
      email: 'sneha.joshi@workflowx.com',
      department: 'Marketing',
      designation: 'Marketing Executive',
      status: 'Inactive',
    },
    {
      id: 5,
      name: 'Amit Kulkarni',
      email: 'amit.kulkarni@workflowx.com',
      department: 'IT',
      designation: 'Backend Developer',
      status: 'Active',
    },
  ]

  const filteredEmployees = employees.filter((employee) => {
    const search = searchTerm.toLowerCase()

    return (
      employee.name.toLowerCase().includes(search) ||
      employee.email.toLowerCase().includes(search) ||
      employee.department.toLowerCase().includes(search) ||
      employee.designation.toLowerCase().includes(search)
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

        <button className="add-employee-button">
          + Add Employee
        </button>

      </div>

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

        <div className="table-container">

          <table className="employees-table">

            <thead>

              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Status</th>
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

                      <span
                        className={`employee-status ${
                          employee.status === 'Active'
                            ? 'status-active'
                            : 'status-inactive'
                        }`}
                      >
                        {employee.status}
                      </span>

                    </td>

                    <td>

                      <div className="employee-actions">

                        <button className="edit-employee-button">
                          Edit
                        </button>

                        <button className="delete-employee-button">
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
                    No employees found
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

export default Employees