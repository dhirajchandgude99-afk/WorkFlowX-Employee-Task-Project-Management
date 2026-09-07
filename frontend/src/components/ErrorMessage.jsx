import './ErrorMessage.css'

function ErrorMessage({
  message = 'Something went wrong. Please try again.',
  onRetry,
}) {
  return (
    <div className="error-state">
      <div className="error-icon">!</div>

      <h3>Something went wrong</h3>

      <p>{message}</p>

      {onRetry && (
        <button
          className="retry-button"
          onClick={onRetry}
        >
          Try Again
        </button>
      )}
    </div>
  )
}

export default ErrorMessage