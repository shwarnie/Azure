function ErrorState({ message, onRetry }) {
  return (
    <main className="state-page">
      <span className="state-icon state-icon-error" aria-hidden="true">
        !
      </span>
      <p className="eyebrow">We hit a snag</p>
      <h1>Questions couldn’t load.</h1>
      <p>
        Check that <code>data/questions.json</code> exists and follows the
        question format, then try again.
      </p>
      <p className="state-detail">{message}</p>
      <button className="button button-primary" type="button" onClick={onRetry}>
        Try again
      </button>
    </main>
  )
}

export default ErrorState
