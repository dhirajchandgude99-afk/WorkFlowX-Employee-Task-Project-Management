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
========================================
Decode JWT Payload
========================================
*/
export const getTokenPayload = () => {
  const token = getToken()

  if (!token) {
    return null
  }

  try {
    const payload = token.split('.')[1]

    if (!payload) {
      return null
    }

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
========================================
Username
========================================
*/
export const getUsername = () => {
  return getTokenPayload()?.sub || null
}

/*
========================================
Role
========================================
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
========================================
Role Check
========================================
*/
export const hasRole = (role) => {
  const currentRole = getRole()

  if (!currentRole) {
    return false
  }

  return currentRole.toUpperCase() === role.toUpperCase()
}

export const isAdmin = () => {
  return hasRole('ADMIN')
}

export const isUser = () => {
  return hasRole('USER')
}

/*
========================================
JWT Expiry Check
========================================
*/
export const isTokenExpired = () => {
  const payload = getTokenPayload()

  if (!payload || !payload.exp) {
    return true
  }

  const currentTime = Math.floor(Date.now() / 1000)

  return payload.exp <= currentTime
}