import ExplainButton from './ExplainButton.jsx'

function FeedbackPanel({
  question,
  feedback,
  simpleExplanation,
  explanationLoading,
  onExplain,
  onNext,
  isLastQuestion,
}) {
  const otherReasons = question.options
    .map((option, index) => ({
      option,
      reason: feedback.whyWrong?.[index],
      index,
    }))
    .filter(
      ({ index, reason }) =>
        index !== feedback.correctIndex && typeof reason === 'string',
    )

  return (
    <section
      className={`feedback-panel ${
        feedback.isCorrect ? 'feedback-correct' : 'feedback-incorrect'
      }`}
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="feedback-title"
    >
      <div className="feedback-heading">
        <span className="feedback-icon" aria-hidden="true">
          {feedback.isCorrect ? '✓' : '✕'}
        </span>
        <h2 id="feedback-title">
          {feedback.isCorrect ? 'Correct!' : 'Not quite'}
        </h2>
      </div>

      <p className="feedback-explanation">{feedback.explanation}</p>

      <details className="why-others">
        <summary>Why the others are wrong</summary>
        {otherReasons.length ? (
          <ul>
            {otherReasons.map(({ option, reason, index }) => (
              <li key={`${question.id}-reason-${index}`}>
                <strong>{option}</strong>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>Additional notes were not provided for this question.</p>
        )}
      </details>

      <div className="feedback-actions">
        <ExplainButton
          onExplain={onExplain}
          loading={explanationLoading}
          explanationText={simpleExplanation}
        />
        <button
          className="button button-primary"
          type="button"
          onClick={onNext}
        >
          {isLastQuestion ? 'See results' : 'Next'}
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}

export default FeedbackPanel
