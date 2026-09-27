/*
========================================
Save JWT Token
========================================
*/
export const saveToken = (token) => {
  localStorage.setItem('token', token)
}

/*
========================================
Get JWT Token
========================================
*/
export const getToken = () => {
  return localStorage.getItem('token')
}

/*
========================================
Remove JWT Token
========================================
*/
export const removeToken = () => {
  localStorage.removeItem('token')
}

/*
========================================
Check Login Status
========================================
*/
export const isLoggedIn = () => {
  return getToken() !== null
}

/*
========================================
Logout
========================================
*/
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
    const parts = token.split('.')

    // JWT must contain:
    // Header.Payload.Signature
    if (parts.length !== 3) {
      console.error('Invalid JWT format')
      return null
    }

    let payload = parts[1]

    // Convert Base64URL → Base64
    payload = payload
      .replace(/-/g, '+')
      .replace(/_/g, '/')

    // Add required Base64 padding
    while (payload.length % 4 !== 0) {
      payload += '='
    }

    const decodedPayload = atob(payload)

    return JSON.parse(decodedPayload)

  } catch (error) {
    console.error(
      'Unable to decode JWT payload:',
      error
    )

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

  // WorkflowX JWT uses:
  // "role": "USER"
  if (payload.role) {
    return payload.role
  }

  // Fallback if roles are used
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

  return currentRole.toUpperCase() ===
         role.toUpperCase()
}

/*
========================================
Admin Check
========================================
*/
export const isAdmin = () => {
  return hasRole('ADMIN')
}

/*
========================================
User Check
========================================
*/
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

  /*
  If the token cannot be decoded,
  treat it as invalid/expired.
  */
  if (!payload || payload.exp === undefined) {
    return true
  }

  /*
  JWT exp is stored in seconds.
  JavaScript Date.now() is milliseconds,
  so convert it to seconds.
  */
  const currentTime =
    Math.floor(Date.now() / 1000)

  return Number(payload.exp) <= currentTime
}
