import { getToken } from '../utils/auth'

const API_BASE_URL = 'http://localhost:8080'

const handleResponse = async (response) => {
  let data = null

  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  } else {
    const text = await response.text()

    if (text) {
      data = text
    }
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
        (typeof data === 'string' ? data : null) ||
        `Request failed with status ${response.status}`
    )

    error.status = response.status
    error.data = data

    throw error
  }

  return data
}

/*
 * LOGIN
 */
export const loginUser = async (username, password) => {
  const response = await fetch(
    `${API_BASE_URL}/api/auth/login`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
      }),
    }
  )

  const data = await handleResponse(response)

  return {
    status: response.status,
    data,
  }
}

/*
 * AUTHENTICATED REQUEST
 */
export const authFetch = async (
  url,
  options = {}
) => {
  const token = getToken()

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  const response = await fetch(
    `${API_BASE_URL}${url}`,
    {
      ...options,
      headers,
    }
  )

  return response
}

/*
 * GET REQUEST
 */
export const apiGet = async (url) => {
  const response = await authFetch(url)

  return handleResponse(response)
}

/*
 * POST REQUEST
 */
export const apiPost = async (url, data) => {
  const response = await authFetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse(response)
}

/*
 * PUT REQUEST
 */
export const apiPut = async (url, data) => {
  const response = await authFetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  return handleResponse(response)
}

/*
 * DELETE REQUEST
 */
export const apiDelete = async (url) => {
  const response = await authFetch(url, {
    method: 'DELETE',
  })

  return handleResponse(response)
}

/*
 * USER API
 */
export const getUsers = () => {
  return apiGet('/api/users')
}

export const getUserById = (id) => {
  return apiGet(`/api/users/${id}`)
}

export const createUser = (user) => {
  return apiPost('/api/users', user)
}

export const updateUser = (id, user) => {
  return apiPut(`/api/users/${id}`, user)
}

export const deleteUser = (id) => {
  return apiDelete(`/api/users/${id}`)
}

/*
 * EMPLOYEE API
 */
export const getEmployees = () => {
  return apiGet('/api/employees')
}

export const getEmployeeById = (id) => {
  return apiGet(`/api/employees/${id}`)
}

export const createEmployee = (employee) => {
  return apiPost('/api/employees', employee)
}

export const updateEmployee = (id, employee) => {
  return apiPut(`/api/employees/${id}`, employee)
}

export const deleteEmployee = (id) => {
  return apiDelete(`/api/employees/${id}`)
}

/*
 * PROJECT API
 */
export const getProjects = () => {
  return apiGet('/api/projects')
}

export const getProjectById = (id) => {
  return apiGet(`/api/projects/${id}`)
}

export const createProject = (project) => {
  return apiPost('/api/projects', project)
}

export const updateProject = (id, project) => {
  return apiPut(`/api/projects/${id}`, project)
}

export const deleteProject = (id) => {
  return apiDelete(`/api/projects/${id}`)
}

/*
 * TASK API
 */
export const getTasks = () => {
  return apiGet('/api/tasks')
}

export const getTaskById = (id) => {
  return apiGet(`/api/tasks/${id}`)
}

export const createTask = (task) => {
  return apiPost('/api/tasks', task)
}

export const updateTask = (id, task) => {
  return apiPut(`/api/tasks/${id}`, task)
}

export const deleteTask = (id) => {
  return apiDelete(`/api/tasks/${id}`)
}

export default API_BASE_URL