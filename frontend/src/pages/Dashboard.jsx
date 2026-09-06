import './Dashboard.css'

function Dashboard() {
  const statistics = [
    {
      title: 'Total Users',
      value: 12,
      description: 'Registered users',
    },
    {
      title: 'Employees',
      value: 25,
      description: 'Active employees',
    },
    {
      title: 'Projects',
      value: 8,
      description: 'Active projects',
    },
    {
      title: 'Tasks',
      value: 42,
      description: 'Total tasks',
    },
  ]

  const recentProjects = [
    {
      name: 'WorkflowX Development',
      status: 'In Progress',
    },
    {
      name: 'Employee Management System',
      status: 'Completed',
    },
    {
      name: 'Project Management Portal',
      status: 'In Progress',
    },
  ]

  const recentTasks = [
    {
      name: 'Complete authentication module',
      status: 'Completed',
    },
    {
      name: 'Build employee management UI',
      status: 'In Progress',
    },
    {
      name: 'Implement task management',
      status: 'Pending',
    },
  ]

  return (
    <div className="dashboard">

      {/* Dashboard Header */}

      <div className="dashboard-header">
        <div>
          <h1>Dashboard</h1>
          <p>Welcome back to WorkflowX</p>
        </div>
      </div>

      {/* Statistics */}

      <div className="stats-grid">

        {statistics.map((stat) => (
          <div
            className="stat-card"
            key={stat.title}
          >
            <div className="stat-card-content">
              <h3>{stat.title}</h3>

              <p className="stat-value">
                {stat.value}
              </p>

              <p className="stat-description">
                {stat.description}
              </p>
            </div>
          </div>
        ))}

      </div>

      {/* Dashboard Overview */}

      <div className="dashboard-grid">

        {/* Recent Projects */}

        <div className="dashboard-card">

          <div className="card-header">
            <h2>Recent Projects</h2>
          </div>

          <div className="card-list">

            {recentProjects.map((project) => (
              <div
                className="list-item"
                key={project.name}
              >

                <div>
                  <h3>{project.name}</h3>
                </div>

                <span
                  className={`status status-${project.status
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {project.status}
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* Recent Tasks */}

        <div className="dashboard-card">

          <div className="card-header">
            <h2>Recent Tasks</h2>
          </div>

          <div className="card-list">

            {recentTasks.map((task) => (
              <div
                className="list-item"
                key={task.name}
              >

                <div>
                  <h3>{task.name}</h3>
                </div>

                <span
                  className={`status status-${task.status
                    .toLowerCase()
                    .replace(' ', '-')}`}
                >
                  {task.status}
                </span>

              </div>
            ))}

          </div>

        </div>

      </div>

    </div>
  )
}

export default Dashboard