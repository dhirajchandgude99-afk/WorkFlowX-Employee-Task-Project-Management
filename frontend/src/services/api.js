import {
  getToken,
  logout,
  isTokenExpired,
} from '../utils/auth'

const API_BASE_URL = 'http://localhost:8080'

/*
========================================
Handle API Response
========================================
*/
const handleResponse = async (response) => {
  let data = null

  try {
    const text = await response.text()

    if (text) {
      data = JSON.parse(text)
    }
  } catch (error) {
    console.error('Unable to parse API response:', error)
  }

  /*
  ========================================
  Authentication Expired
  ========================================
  */
  if (response.status === 401) {
    logout()

    localStorage.setItem(
      'authMessage',
      'Your session has expired. Please log in again.'
    )

    window.location.href = '/login'

    const error = new Error(
      'Your session has expired. Please log in again.'
    )

    error.status = 401
    error.data = data

    throw error
  }

  /*
  ========================================
  Other API Errors
  ========================================
  */
  if (!response.ok) {
    const message =
      data?.message ||
      data?.error ||
      'Something went wrong. Please try again.'

    const error = new Error(message)

    error.status = response.status
    error.data = data

    throw error
  }

  return data
}

/*
========================================
Login
========================================
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

  return handleResponse(response)
}

/*
========================================
Authenticated Fetch
========================================
*/
export const authFetch = async (url, options = {}) => {
  const token = getToken()

  /*
  ========================================
  Check JWT expiry before API request
  ========================================
  */
  if (token && isTokenExpired()) {
    logout()

    localStorage.setItem(
      'authMessage',
      'Your session has expired. Please log in again.'
    )

    window.location.href = '/login'

    const error = new Error(
      'Your session has expired. Please log in again.'
    )

    error.status = 401

    throw error
  }

  const headers = {
    ...(options.headers || {}),
    'Content-Type': 'application/json',
  }

  /*
  Add JWT to protected request
  */
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(
    `${API_BASE_URL}${url}`,
    {
      ...options,
      headers,
    }
  )

  return handleResponse(response)
}

/*
========================================
GET
========================================
*/
export const apiGet = async (url) => {
  return authFetch(url, {
    method: 'GET',
  })
}

/*
========================================
POST
========================================
*/
export const apiPost = async (url, data) => {
  return authFetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

/*
========================================
PUT
========================================
*/
export const apiPut = async (url, data) => {
  return authFetch(url, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

/*
========================================
DELETE
========================================
*/
export const apiDelete = async (url) => {
  return authFetch(url, {
    method: 'DELETE',
  })
}

/*
========================================
USERS
========================================
*/
export const getUsers = () =>
  apiGet('/api/users')

export const getUserById = (id) =>
  apiGet(`/api/users/${id}`)

export const createUser = (user) =>
  apiPost('/api/users', user)

export const updateUser = (id, user) =>
  apiPut(`/api/users/${id}`, user)

export const deleteUser = (id) =>
  apiDelete(`/api/users/${id}`)

/*
========================================
EMPLOYEES
========================================
*/
export const getEmployees = () =>
  apiGet('/api/employees')

export const getEmployeeById = (id) =>
  apiGet(`/api/employees/${id}`)

export const createEmployee = (employee) =>
  apiPost('/api/employees', employee)

export const updateEmployee = (id, employee) =>
  apiPut(`/api/employees/${id}`, employee)

export const deleteEmployee = (id) =>
  apiDelete(`/api/employees/${id}`)

/*
========================================
PROJECTS
========================================
*/
export const getProjects = () =>
  apiGet('/api/projects')

export const getProjectById = (id) =>
  apiGet(`/api/projects/${id}`)

export const createProject = (project) =>
  apiPost('/api/projects', project)

export const updateProject = (id, project) =>
  apiPut(`/api/projects/${id}`, project)

export const deleteProject = (id) =>
  apiDelete(`/api/projects/${id}`)

/*
========================================
TASKS
========================================
*/
export const getTasks = () =>
  apiGet('/api/tasks')

export const getTaskById = (id) =>
  apiGet(`/api/tasks/${id}`)

export const createTask = (task) =>
  apiPost('/api/tasks', task)

export const updateTask = (id, task) =>
  apiPut(`/api/tasks/${id}`, task)

export const deleteTask = (id) =>
  apiDelete(`/api/tasks/${id}`)