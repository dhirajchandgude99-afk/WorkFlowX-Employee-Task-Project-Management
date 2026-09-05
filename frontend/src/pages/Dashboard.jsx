import { useEffect } from 'react'
import { authFetch } from '../services/api'

function Dashboard() {
  useEffect(() => {
    const testProtectedApi = async () => {
      try {
        const response = await authFetch('/api/employees')

        console.log('Protected API status:', response.status)

        const data = await response.json()

        console.log('Protected API response:', data)
      } catch (error) {
        console.error('Protected API failed:', error)
      }
    }

    testProtectedApi()
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to WorkflowX Dashboard</p>
    </div>
  )
}

export default Dashboard