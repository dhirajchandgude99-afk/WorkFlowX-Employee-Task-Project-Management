import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Signup.css'
import { signupUser } from '../services/api'
import Loading from '../components/Loading'

function Signup() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    username: '',
    password: '',
    confirmPassword: '',
  })

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError('')
    setSuccess('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.department.trim() ||
      !formData.designation.trim() ||
      !formData.username.trim() ||
      !formData.password.trim()
    ) {
      setError('Please fill in all required fields.')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setError('')
    setSuccess('')
    setLoading(true)

    try {
      await signupUser({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        department: formData.department,
        designation: formData.designation,
        username: formData.username,
        password: formData.password,
      })

      setSuccess(
        'Account created successfully. Redirecting to login...'
      )

      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 1200)

    } catch (error) {
      console.error('Signup failed:', error)

      if (error.status === 400) {
        setError(
          error.data?.message ||
          error.message ||
          'Please check the entered information.'
        )
      } else if (error.status === 409) {
        setError(
          error.data?.message ||
          'Username or email is already registered.'
        )
      } else if (error.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError(
          error.message ||
          'Unable to create account.'
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <div className="signup-card">

        <h1>WorkflowX</h1>

        <p className="signup-subtitle">
          Create your employee account
        </p>

        {error && (
          <p className="signup-error">
            {error}
          </p>
        )}

        {success && (
          <p className="signup-success">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit}>

          <div className="signup-form-row">
            <div className="form-group">
              <label htmlFor="name">Name</label>

              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                value={formData.name}
                disabled={loading}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>

              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                disabled={loading}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="signup-form-row">
            <div className="form-group">
              <label htmlFor="phone">Phone</label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                disabled={loading}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="department">Department</label>

              <input
                type="text"
                id="department"
                name="department"
                placeholder="e.g. IT"
                value={formData.department}
                disabled={loading}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="designation">Designation</label>

            <input
              type="text"
              id="designation"
              name="designation"
              placeholder="e.g. Software Developer"
              value={formData.designation}
              disabled={loading}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>

            <input
              type="text"
              id="username"
              name="username"
              placeholder="Create username"
              value={formData.username}
              disabled={loading}
              onChange={handleChange}
            />
          </div>

          <div className="signup-form-row">
            <div className="form-group">
              <label htmlFor="password">Password</label>

              <input
                type="password"
                id="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={formData.password}
                disabled={loading}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                disabled={loading}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            className="signup-button"
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

        </form>

        <p className="signup-login-link">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => navigate('/login')}
            disabled={loading}
          >
            Login
          </button>
        </p>

        {loading && (
          <Loading message="Creating your account..." />
        )}

      </div>
    </div>
  )
}

export default Signup