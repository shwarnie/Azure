function EmptyState({ message, onHome }) {
  return (
    <section className="state-page">
      <span className="state-icon" aria-hidden="true">
        ?
      </span>
      <p className="eyebrow">Nothing to practise yet</p>
      <h1>More questions are on the way.</h1>
      <p>{message}</p>
      <button
        className="button button-secondary"
        type="button"
        onClick={onHome}
      >
        Back to topics
      </button>
    </section>
  )
}

export default EmptyState
