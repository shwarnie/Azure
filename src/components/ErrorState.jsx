function ErrorState({ onRetry, onUseSample }) {
  return (
    <section className="state-page">
      <span className="state-icon state-icon-error" aria-hidden="true">
        !
      </span>
      <p className="eyebrow">A quick pause</p>
      <h1>Your practice is taking a moment.</h1>
      <p>We couldn’t load the questions just now. Please try again shortly.</p>
      <button className="button button-primary" type="button" onClick={onRetry}>
        Try again
      </button>
      {onUseSample && (
        <button
          className="button button-secondary"
          type="button"
          onClick={onUseSample}
        >
          Try a sample quiz
        </button>
      )}
    </section>
  )
}

export default ErrorState
