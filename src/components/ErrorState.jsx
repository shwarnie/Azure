function ErrorState({ message, onRetry, onUseSample }) {
  return (
    <section className="state-page">
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
      {onUseSample && (
        <button
          className="button button-secondary"
          type="button"
          onClick={onUseSample}
        >
          Preview with sample questions
        </button>
      )}
    </section>
  )
}

export default ErrorState
