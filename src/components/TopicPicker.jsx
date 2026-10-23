const TOPICS = [
  'Describe Cloud Concepts',
  'Describe Azure Architecture and Services',
  'Describe Azure Management and Governance',
]

function TopicPicker({ questions, progress, onSelectTopic }) {
  const getCount = (topic) =>
    questions.filter((question) => question.topic === topic).length

  const allCount = questions.length
  const progressEntries = Object.values(progress ?? {})
  const sessionsCompleted = progressEntries.reduce(
    (total, entry) => total + (Number(entry.total) > 0 ? 1 : 0),
    0,
  )
  const practicedTopics = progressEntries.filter(
    (entry) => typeof entry.bestPercentage === 'number',
  )
  const averageBest = practicedTopics.length
    ? Math.round(
        practicedTopics.reduce(
          (total, entry) => total + entry.bestPercentage,
          0,
        ) / practicedTopics.length,
      )
    : 0

  return (
    <div className="learning-dashboard">
      <section className="hero-section" aria-labelledby="welcome-title">
        <div className="hero-copy">
          <p className="eyebrow">
            <span className="eyebrow-sparkle" aria-hidden="true">
              ✦
            </span>
            Your cloud-learning companion
          </p>
          <h1 id="welcome-title">
            Understand the cloud.
            <span>Master the concepts.</span>
          </h1>
          <p className="hero-description">
            Your AI-powered companion for learning Azure fundamentals,
            practising smarter, and building exam confidence.
          </p>
          <div className="hero-actions">
            <a className="button button-primary" href="#topics">
              Start learning <span aria-hidden="true">→</span>
            </a>
            <a className="button button-soft" href="#features">
              Explore features
            </a>
          </div>
          <div className="hero-note">
            <span className="avatar-stack" aria-hidden="true">
              <span>A</span>
              <span>Z</span>
              <span>+</span>
            </span>
            <span>A calmer way to prepare, one concept at a time.</span>
          </div>
        </div>

        <div className="hero-art" aria-label="Azora learning dashboard preview">
          <span className="hero-orbit orbit-one" aria-hidden="true" />
          <span className="hero-orbit orbit-two" aria-hidden="true" />
          <span className="sparkle sparkle-one" aria-hidden="true">
            ✦
          </span>
          <span className="sparkle sparkle-two" aria-hidden="true">
            ✧
          </span>
          <svg
            className="cloud-illustration"
            viewBox="0 0 360 240"
            role="img"
            aria-label="Soft pastel cloud illustration"
          >
            <defs>
              <linearGradient id="cloudFill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#fff" />
                <stop offset="1" stopColor="#e9f5ff" />
              </linearGradient>
              <linearGradient id="cloudShade" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#bde0fe" />
                <stop offset="1" stopColor="#ffc8dd" />
              </linearGradient>
            </defs>
            <ellipse
              cx="181"
              cy="200"
              rx="122"
              ry="15"
              fill="#accdf0"
              opacity=".28"
            />
            <path
              d="M86 162c-20 0-36-15-36-34s16-34 36-34c3 0 7 0 10 1 7-30 34-52 66-52 35 0 64 25 68 59 5-3 11-4 17-4 20 0 36 15 36 34s-16 34-36 34H86Z"
              fill="url(#cloudFill)"
              stroke="#fff"
              strokeWidth="4"
            />
            <path
              d="M104 157c23-13 48-18 76-15 22 2 39 8 60 15"
              fill="none"
              stroke="url(#cloudShade)"
              strokeLinecap="round"
              strokeWidth="5"
              opacity=".8"
            />
            <circle cx="137" cy="115" r="4" fill="#75a9dc" />
            <circle cx="185" cy="115" r="4" fill="#75a9dc" />
            <path
              d="M146 128c9 10 21 10 30 0"
              fill="none"
              stroke="#75a9dc"
              strokeLinecap="round"
              strokeWidth="3"
            />
            <path
              d="m90 73 5 12 12 5-12 5-5 12-5-12-12-5 12-5 5-12Z"
              fill="#ffc8dd"
            />
            <path d="m262 81 4 9 9 4-9 4-4 9-4-9-9-4 9-4 4-9Z" fill="#bde0fe" />
          </svg>

          <div className="preview-card preview-score">
            <div className="preview-card-heading">
              <span
                className="preview-icon preview-icon-blue"
                aria-hidden="true"
              >
                ✦
              </span>
              <span>Learning snapshot</span>
            </div>
            <div className="preview-score-row">
              <strong>{averageBest ? `${averageBest}%` : 'Your pace'}</strong>
              <span>
                {averageBest ? 'best topic score' : 'Start when you’re ready'}
              </span>
            </div>
            <div
              className="mini-progress"
              role="progressbar"
              aria-label="Average best score across practiced topics"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={averageBest}
            >
              <span style={{ width: `${averageBest}%` }} />
            </div>
          </div>

          <div className="preview-card preview-recommendation">
            <span className="preview-icon preview-icon-pink" aria-hidden="true">
              ✧
            </span>
            <span>
              <strong>Up next</strong>
              <small>Explore a topic at your pace</small>
            </span>
            <span className="preview-arrow" aria-hidden="true">
              ↗
            </span>
          </div>
          <div className="preview-progress-chip">
            <span className="progress-dot" aria-hidden="true" />
            {sessionsCompleted
              ? `${sessionsCompleted} topic${sessionsCompleted === 1 ? '' : 's'} explored`
              : 'Your learning journey starts here'}
          </div>
        </div>
      </section>

      <section
        className="dashboard-welcome"
        aria-label="Your learning dashboard"
      >
        <div>
          <span className="welcome-icon" aria-hidden="true">
            ☀
          </span>
          <div>
            <p className="dashboard-kicker">
              {sessionsCompleted ? 'Welcome back' : 'A lovely place to begin'}
            </p>
            <h2>
              {sessionsCompleted
                ? 'Your progress is taking shape.'
                : 'Ready when you are.'}
            </h2>
            <p>
              {sessionsCompleted
                ? 'Pick up with a topic or explore something new.'
                : 'Choose a short topic quiz to take your first step.'}
            </p>
          </div>
        </div>
        <div className="dashboard-stat">
          <span className="stat-value">{sessionsCompleted}</span>
          <span className="stat-label">topics explored</span>
        </div>
        <div className="dashboard-stat dashboard-stat-pink">
          <span className="stat-value">
            {practicedTopics.length ? `${averageBest}%` : '—'}
          </span>
          <span className="stat-label">average best</span>
        </div>
      </section>

      <section
        className="topic-picker"
        id="topics"
        aria-labelledby="topics-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Your learning path</p>
            <h2 id="topics-title">What would you like to explore?</h2>
          </div>
          <span className="section-aside">
            Short practice. Clear explanations.
          </span>
        </div>

        <div className="topic-grid">
          {TOPICS.map((topic, index) => {
            const count = getCount(topic)
            const bestScore = progress?.[topic]?.bestPercentage

            return (
              <button
                className={`topic-card topic-card-${index + 1}`}
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
                    <span className="best-score">Best {bestScore}%</span>
                  )}
                </span>
              </button>
            )
          })}
        </div>

        <div className="mixed-topic-row">
          <div className="mixed-icon" aria-hidden="true">
            ✦
          </div>
          <div className="mixed-copy">
            <h3>A little bit of everything?</h3>
            <p>Mix questions from all available topics for a quick review.</p>
          </div>
          <button
            className="button button-secondary"
            type="button"
            onClick={() => onSelectTopic('All topics (mixed)')}
            disabled={allCount === 0}
          >
            Mixed practice <span aria-hidden="true">→</span>
          </button>
        </div>
      </section>

      <section
        className="feature-section"
        id="features"
        aria-labelledby="features-title"
      >
        <div className="section-heading">
          <div>
            <p className="eyebrow">Made for understanding</p>
            <h2 id="features-title">Small steps, lasting confidence.</h2>
          </div>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-icon feature-icon-blue" aria-hidden="true">
              ✓
            </span>
            <h3>Learn as you go</h3>
            <p>
              Get immediate feedback and straightforward explanations after each
              answer.
            </p>
          </article>
          <article className="feature-card">
            <span className="feature-icon feature-icon-pink" aria-hidden="true">
              ✦
            </span>
            <h3>See your progress</h3>
            <p>Review your scores by topic and revisit questions you missed.</p>
          </article>
          <article className="feature-card source-feature">
            <span
              className="feature-icon feature-icon-lavender"
              aria-hidden="true"
            >
              ↥
            </span>
            <div className="feature-title-row">
              <h3>Bring your own notes</h3>
              <span className="coming-soon-badge">Not connected</span>
            </div>
            <p>
              Document uploads and note extraction aren’t available in this
              version. No files are accepted or processed.
            </p>
          </article>
        </div>
      </section>
    </div>
  )
}

export default TopicPicker
