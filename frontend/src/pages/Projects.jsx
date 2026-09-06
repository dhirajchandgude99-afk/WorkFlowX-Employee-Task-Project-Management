import { useState } from 'react'
import './Projects.css'

function Projects() {
  const [searchTerm, setSearchTerm] = useState('')

  const projects = [
    {
      id: 1,
      name: 'WorkflowX Development',
      manager: 'Admin User',
      status: 'In Progress',
      startDate: '2026-01-10',
      endDate: '2026-06-30',
    },
    {
      id: 2,
      name: 'Employee Management System',
      manager: 'Priya Sharma',
      status: 'Completed',
      startDate: '2025-08-01',
      endDate: '2025-12-15',
    },
    {
      id: 3,
      name: 'Project Management Portal',
      manager: 'John Doe',
      status: 'In Progress',
      startDate: '2026-02-15',
      endDate: '2026-08-30',
    },
    {
      id: 4,
      name: 'Mobile Application',
      manager: 'Rahul Patil',
      status: 'Pending',
      startDate: '2026-07-01',
      endDate: '2026-12-31',
    },
  ]

  const filteredProjects = projects.filter((project) => {
    const search = searchTerm.toLowerCase()

    return (
      project.name.toLowerCase().includes(search) ||
      project.manager.toLowerCase().includes(search) ||
      project.status.toLowerCase().includes(search)
    )
  })

  return (
    <div className="projects-page">
      <div className="projects-header">
        <div>
          <h1>Projects</h1>
          <p>Manage WorkflowX projects</p>
        </div>

        <button className="add-project-button">
          + Add Project
        </button>
      </div>

      <div className="projects-toolbar">
        <input
          type="text"
          placeholder="Search projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="projects-card">
        <div className="table-container">
          <table className="projects-table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Project Manager</th>
                <th>Status</th>
                <th>Start Date</th>
                <th>End Date</th>
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
                      {project.manager}
                    </td>

                    <td>
                      <span
                        className={`project-status ${
                          project.status === 'Completed'
                            ? 'status-completed'
                            : project.status === 'In Progress'
                            ? 'status-in-progress'
                            : 'status-pending'
                        }`}
                      >
                        {project.status}
                      </span>
                    </td>

                    <td>
                      {project.startDate}
                    </td>

                    <td>
                      {project.endDate}
                    </td>

                    <td>
                      <div className="project-actions">
                        <button className="edit-project-button">
                          Edit
                        </button>

                        <button className="delete-project-button">
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
                    className="empty-projects"
                  >
                    No projects found
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

export default Projects