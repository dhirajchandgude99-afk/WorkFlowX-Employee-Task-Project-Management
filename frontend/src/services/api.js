import { getToken } from '../utils/auth'

const API_BASE_URL = 'http://localhost:8080'

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  })

  let data = null

  const contentType = response.headers.get('content-type')

  if (contentType && contentType.includes('application/json')) {
    data = await response.json()
  }

  if (!response.ok) {
    const error = new Error(
      data?.message || `Request failed with status ${response.status}`
    )

    error.status = response.status
    error.data = data

    throw error
  }

  return {
    status: response.status,
    data: data,
  }
}

export const authFetch = async (url, options = {}) => {
  const token = getToken()

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  })

  return response
}

export default API_BASE_URL