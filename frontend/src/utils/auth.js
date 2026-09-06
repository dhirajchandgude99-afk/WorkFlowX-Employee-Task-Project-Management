export const saveToken = (token) => {
  localStorage.setItem('token', token)
}

export const getToken = () => {
  return localStorage.getItem('token')
}

export const removeToken = () => {
  localStorage.removeItem('token')
}

export const isLoggedIn = () => {
  return getToken() !== null
}

export const logout = () => {
  removeToken()
}

/*
 * Decode JWT payload
 */
export const getTokenPayload = () => {
  const token = getToken()

  if (!token) {
    return null
  }

  try {
    const payload = token.split('.')[1]

    const decodedPayload = atob(
      payload.replace(/-/g, '+').replace(/_/g, '/')
    )

    return JSON.parse(decodedPayload)
  } catch (error) {
    console.error('Unable to decode JWT:', error)
    return null
  }
}

/*
 * Get username from JWT
 */
export const getUsername = () => {
  const payload = getTokenPayload()

  return payload?.sub || null
}

/*
 * Get role from JWT
 */
export const getRole = () => {
  const payload = getTokenPayload()

  if (!payload) {
    return null
  }

  if (payload.role) {
    return payload.role
  }

  if (payload.roles) {
    if (Array.isArray(payload.roles)) {
      return payload.roles[0]
    }

    return payload.roles
  }

  return null
}

/*
 * Check whether current user has a specific role
 */
export const hasRole = (role) => {
  const currentRole = getRole()

  if (!currentRole) {
    return false
  }

  return currentRole.toUpperCase() === role.toUpperCase()
}

/*
 * Check whether current user is ADMIN
 */
export const isAdmin = () => {
  return hasRole('ADMIN')
}

/*
 * Check whether current user is USER
 */
export const isUser = () => {
  return hasRole('USER')
}