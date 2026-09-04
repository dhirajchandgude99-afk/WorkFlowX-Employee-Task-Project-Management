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

const data = await response.json()

return {
status: response.status,
data: data,
}
}

export default API_BASE_URL
