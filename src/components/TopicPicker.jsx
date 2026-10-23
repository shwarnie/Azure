const TOPICS = [
  'Describe Cloud Concepts',
  'Describe Azure Architecture and Services',
  'Describe Azure Management and Governance',
]

function TopicPicker({ questions, progress, onSelectTopic }) {
  const getCount = (topic) =>
    questions.filter((question) => question.topic === topic).length

  const allCount = questions.length
  const availableTopics = TOPICS.filter((topic) => getCount(topic) > 0)
  const practicedTopics = TOPICS.filter(
    (topic) => typeof progress?.[topic]?.bestPercentage === 'number',
  )
  const topicsExplored = practicedTopics.length
  const topicProgress = Math.round((topicsExplored / TOPICS.length) * 100)
  const perfectRounds = TOPICS.some(
    (topic) => progress?.[topic]?.bestPercentage === 100,
  )
  const recommendedTopic = [...availableTopics].sort((first, second) => {
    const firstScore = progress?.[first]?.bestPercentage ?? -1
    const secondScore = progress?.[second]?.bestPercentage ?? -1
    return firstScore - secondScore
  })[0]
  const averageBest = practicedTopics.length
    ? Math.round(
        practicedTopics.reduce(
          (total, topic) => total + progress[topic].bestPercentage,
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
              <strong>
                {practicedTopics.length ? `${averageBest}%` : '0%'}
              </strong>
              <span>
                {practicedTopics.length
                  ? 'average best score'
                  : 'your first score is waiting'}
              </span>
            </div>
            <div
              className="mini-progress"
              role="progressbar"
              aria-label="Average best score across practiced topics"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={practicedTopics.length ? averageBest : 0}
            >
              <span
                style={{
                  width: `${practicedTopics.length ? averageBest : 0}%`,
                }}
              />
            </div>
          </div>

          <button
            className="preview-card preview-recommendation"
            type="button"
            onClick={() => recommendedTopic && onSelectTopic(recommendedTopic)}
            disabled={!recommendedTopic}
            aria-label={
              recommendedTopic
                ? `Start suggested topic: ${recommendedTopic}`
                : 'No topics are available yet'
            }
          >
            <span className="preview-icon preview-icon-pink" aria-hidden="true">
              ✧
            </span>
            <span>
              <strong>
                {recommendedTopic ? 'Your next quest' : 'Up next'}
              </strong>
              <small>
                {recommendedTopic ?? 'Add questions to begin your journey'}
              </small>
            </span>
            <span className="preview-arrow" aria-hidden="true">
              {recommendedTopic ? '↗' : '·'}
            </span>
          </button>
          <div className="preview-progress-chip">
            <span className="progress-dot" aria-hidden="true" />
            {topicsExplored} / {TOPICS.length} topics explored
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
              {topicsExplored ? 'Welcome back, learner' : 'Quest board'}
            </p>
            <h2>
              {topicsExplored
                ? `${topicsExplored} topic${topicsExplored === 1 ? '' : 's'} explored!`
                : 'Your cloud adventure starts here.'}
            </h2>
            <p>
              {topicsExplored
                ? 'Keep going to unlock your next achievement.'
                : 'Complete a topic quiz to unlock your first badge.'}
            </p>
          </div>
        </div>
        <div className="dashboard-stat">
          <span className="stat-value">
            {topicsExplored}
            <span className="stat-total">/{TOPICS.length}</span>
          </span>
          <span className="stat-label">topics explored</span>
          <div
            className="dashboard-progress"
            role="progressbar"
            aria-label="Topic exploration progress"
            aria-valuemin={0}
            aria-valuemax={TOPICS.length}
            aria-valuenow={topicsExplored}
          >
            <span style={{ width: `${topicProgress}%` }} />
          </div>
        </div>
      </section>

      <section
        className="quest-board"
        aria-label="Daily quest and achievements"
      >
        <article className="daily-quest-card">
          <span className="quest-ribbon">TODAY’S QUEST</span>
          <span className="quest-mascot" aria-hidden="true">
            ✦
          </span>
          <div className="quest-copy">
            <h2>Take a quick cloud quest</h2>
            <p>
              {recommendedTopic
                ? `Practise ${Math.min(10, getCount(recommendedTopic))} ${
                    Math.min(10, getCount(recommendedTopic)) === 1
                      ? 'question'
                      : 'questions'
                  } in ${recommendedTopic}.`
                : 'A new topic quiz will be ready when questions are added.'}
            </p>
          </div>
          <button
            className="button button-primary quest-button"
            type="button"
            onClick={() => recommendedTopic && onSelectTopic(recommendedTopic)}
            disabled={!recommendedTopic}
          >
            {recommendedTopic ? 'Start quest' : 'All explored'}
            <span aria-hidden="true">{recommendedTopic ? '→' : '✓'}</span>
          </button>
        </article>

        <article className="achievement-card">
          <div className="achievement-heading">
            <div>
              <p className="eyebrow">Little wins add up</p>
              <h2>Your badges</h2>
            </div>
            <span className="badge-count">
              {Number(topicsExplored > 0) +
                Number(topicsExplored === TOPICS.length) +
                Number(perfectRounds)}{' '}
              / 3
            </span>
          </div>
          <div className="badge-list">
            <div
              className={`achievement-badge ${topicsExplored > 0 ? 'is-unlocked' : ''}`}
              aria-label={
                topicsExplored > 0
                  ? 'First Steps badge unlocked'
                  : 'First Steps badge locked'
              }
            >
              <span aria-hidden="true">{topicsExplored > 0 ? '✓' : '·'}</span>
              <small>First steps</small>
            </div>
            <div
              className={`achievement-badge ${topicsExplored === TOPICS.length ? 'is-unlocked' : ''}`}
              aria-label={
                topicsExplored === TOPICS.length
                  ? 'Cloud Explorer badge unlocked'
                  : 'Cloud Explorer badge locked'
              }
            >
              <span aria-hidden="true">
                {topicsExplored === TOPICS.length ? '✦' : '·'}
              </span>
              <small>Cloud explorer</small>
            </div>
            <div
              className={`achievement-badge ${perfectRounds ? 'is-unlocked' : ''}`}
              aria-label={
                perfectRounds
                  ? 'Perfect Round badge unlocked'
                  : 'Perfect Round badge locked'
              }
            >
              <span aria-hidden="true">{perfectRounds ? '★' : '·'}</span>
              <small>Perfect round</small>
            </div>
          </div>
        </article>
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
                {typeof bestScore === 'number' && (
                  <span
                    className="topic-mastery"
                    role="progressbar"
                    aria-label={`${topic} best score`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={bestScore}
                  >
                    <span style={{ width: `${bestScore}%` }} />
                  </span>
                )}
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
