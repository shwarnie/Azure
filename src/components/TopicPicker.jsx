const TOPICS = [
  'Describe Cloud Concepts',
  'Describe Azure Architecture and Services',
  'Describe Azure Management and Governance',
]

function TopicPicker({ questions, progress, onSelectTopic }) {
  const getCount = (topic) =>
    questions.filter((question) => question.topic === topic).length

  const allCount = questions.length

  return (
    <section className="topic-picker" aria-labelledby="welcome-title">
      <p className="eyebrow">AZ-900 exam prep</p>
      <h1 id="welcome-title">Build your cloud confidence.</h1>
      <p className="intro-copy">
        Pick a topic to practise. You’ll get feedback and an explanation after
        every answer.
      </p>

      <div className="topic-grid">
        {TOPICS.map((topic, index) => {
          const count = getCount(topic)
          const bestScore = progress?.[topic]?.bestPercentage

          return (
            <button
              className="topic-card"
              type="button"
              key={topic}
              onClick={() => onSelectTopic(topic)}
              disabled={count === 0}
            >
              <span className="topic-card-top">
                <span className="topic-number">0{index + 1}</span>
                <span className="topic-arrow" aria-hidden="true">
                  ↗
                </span>
              </span>
              <span className="topic-name">{topic}</span>
              <span className="topic-card-meta">
                <span>
                  {count} {count === 1 ? 'question' : 'questions'}
                </span>
                {typeof bestScore === 'number' && (
                  <span>Best {bestScore}%</span>
                )}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mixed-topic-row">
        <div>
          <h2>Want a mix?</h2>
          <p>Practice across all available topics.</p>
        </div>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => onSelectTopic('All topics (mixed)')}
          disabled={allCount === 0}
        >
          All topics <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  )
}

export default TopicPicker
