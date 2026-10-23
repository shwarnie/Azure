function EmptyState({ message, onHome }) {
  return (
    <main className="state-page">
      <span className="state-icon" aria-hidden="true">
        ?
      </span>
      <p className="eyebrow">Nothing to practise yet</p>
      <h1>More questions are on the way.</h1>
      <p>{message}</p>
      <button className="button button-secondary" type="button" onClick={onHome}>
        Back to topics
      </button>
    </main>
  )
}

export default EmptyState
