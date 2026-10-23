function ResultsScreen({
  result,
  onRetryMissed,
  onTryAnotherTopic,
  onHome,
}) {
  const { score, missedAnswers, topic } = result

  return (
    <section className="results-screen" aria-labelledby="results-title">
      <p className="eyebrow">Practice complete</p>
      <h1 id="results-title">A little more confident.</h1>
      <p className="results-topic">{topic}</p>

      <div className="score-card">
        <div className="score-ring" aria-label={`${score.percentage}% score`}>
          <strong>{score.percentage}%</strong>
          <span>score</span>
        </div>
        <p>
          <strong>
            {score.correct} of {score.total}
          </strong>{' '}
          answers correct
        </p>
      </div>

      <section className="breakdown-section" aria-labelledby="breakdown-title">
        <h2 id="breakdown-title">By subtopic</h2>
        {score.bySubtopic.length ? (
          <ul className="breakdown-list">
            {score.bySubtopic.map((item) => (
              <li className="breakdown-row" key={item.subtopic}>
                <span>{item.subtopic}</span>
                <span className="breakdown-score">
                  {item.correct}/{item.total}
                </span>
                <span className="breakdown-percent">{item.percentage}%</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted-copy">No subtopic breakdown is available.</p>
        )}
      </section>

      <section className="missed-section" aria-labelledby="missed-title">
        <div className="section-title-row">
          <h2 id="missed-title">Questions to revisit</h2>
          <span className="count-pill">{missedAnswers.length}</span>
        </div>
        {missedAnswers.length ? (
          <ul className="missed-list">
            {missedAnswers.map((answer) => (
              <li className="missed-card" key={answer.question.id}>
                <p className="missed-question">{answer.question.question}</p>
                <p className="missed-answer">
                  <span>Your answer:</span>{' '}
                  {answer.question.options[answer.selectedIndex]}
                </p>
                <p className="missed-answer correct-answer-text">
                  <span>Correct answer:</span>{' '}
                  {answer.question.options[answer.question.correctIndex]}
                </p>
                <p className="missed-explanation">
                  {answer.question.explanation}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="all-correct-message">
            Great work — you got every question right.
          </p>
        )}
      </section>

      <div className="results-actions">
        {missedAnswers.length > 0 && (
          <button
            className="button button-primary"
            type="button"
            onClick={onRetryMissed}
          >
            Retry missed questions <span aria-hidden="true">↻</span>
          </button>
        )}
        <button
          className="button button-secondary"
          type="button"
          onClick={onTryAnotherTopic}
        >
          Try another topic
        </button>
        <button className="button button-quiet" type="button" onClick={onHome}>
          Home
        </button>
      </div>
    </section>
  )
}

export default ResultsScreen
