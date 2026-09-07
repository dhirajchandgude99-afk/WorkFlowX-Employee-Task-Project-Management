import './EmptyState.css'

function EmptyState({
  title = 'No data found',
  message = 'There is no data available to display.',
}) {
  return (
    <div className="empty-state">
      <div className="empty-icon">∅</div>

      <h3>{title}</h3>

      <p>{message}</p>
    </div>
  )
}

export default EmptyState