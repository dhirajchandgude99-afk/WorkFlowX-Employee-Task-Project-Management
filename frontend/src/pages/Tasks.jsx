import { useState } from 'react'
import './Tasks.css'

function Tasks() {
  const [searchTerm, setSearchTerm] = useState('')

  const tasks = [
    {
      id: 1,
      name: 'Implement JWT Authentication',
      employee: 'John Doe',
      project: 'WorkflowX Development',
      priority: 'High',
      status: 'Completed',
      dueDate: '2026-05-15',
    },
    {
      id: 2,
      name: 'Build Employee Management UI',
      employee: 'Amit Kulkarni',
      project: 'WorkflowX Development',
      priority: 'High',
      status: 'In Progress',
      dueDate: '2026-05-25',
    },
    {
      id: 3,
      name: 'Design Project Dashboard',
      employee: 'Priya Sharma',
      project: 'Project Management Portal',
      priority: 'Medium',
      status: 'In Progress',
      dueDate: '2026-06-05',
    },
    {
      id: 4,
      name: 'Create Database Schema',
      employee: 'Rahul Patil',
      project: 'Mobile Application',
      priority: 'High',
      status: 'Pending',
      dueDate: '2026-07-10',
    },
    {
      id: 5,
      name: 'Prepare Application Documentation',
      employee: 'Sneha Joshi',
      project: 'Employee Management System',
      priority: 'Low',
      status: 'Pending',
      dueDate: '2026-07-20',
    },
    {
      id: 6,
      name: 'Test REST API Endpoints',
      employee: 'John Doe',
      project: 'WorkflowX Development',
      priority: 'Medium',
      status: 'Completed',
      dueDate: '2026-05-20',
    },
  ]

  const filteredTasks = tasks.filter((task) => {
    const search = searchTerm.toLowerCase()

    return (
      task.name.toLowerCase().includes(search) ||
      task.employee.toLowerCase().includes(search) ||
      task.project.toLowerCase().includes(search) ||
      task.priority.toLowerCase().includes(search) ||
      task.status.toLowerCase().includes(search)
    )
  })

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        <div>
          <h1>Tasks</h1>
          <p>Manage WorkflowX tasks</p>
        </div>

        <button className="add-task-button">
          + Add Task
        </button>
      </div>

      <div className="tasks-toolbar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="tasks-card">
        <div className="table-container">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>Task Name</th>
                <th>Assigned Employee</th>
                <th>Project</th>
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
                      {task.name}
                    </td>

                    <td>
                      {task.employee}
                    </td>

                    <td>
                      {task.project}
                    </td>

                    <td>
                      <span
                        className={`priority-badge priority-${task.priority.toLowerCase()}`}
                      >
                        {task.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`task-status ${
                          task.status === 'Completed'
                            ? 'task-status-completed'
                            : task.status === 'In Progress'
                            ? 'task-status-in-progress'
                            : 'task-status-pending'
                        }`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td>
                      {task.dueDate}
                    </td>

                    <td>
                      <div className="task-actions">
                        <button className="edit-task-button">
                          Edit
                        </button>

                        <button className="delete-task-button">
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
                    className="empty-tasks"
                  >
                    No tasks found
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

export default Tasks