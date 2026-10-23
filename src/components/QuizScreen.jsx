import { useEffect } from 'react'
import ExplainButton from './ExplainButton.jsx'
import FeedbackPanel from './FeedbackPanel.jsx'

function QuizScreen({
  question,
  questionNumber,
  totalQuestions,
  feedback,
  simpleExplanation,
  explanationLoading,
  onAnswer,
  onNext,
  onExplain,
}) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      const target = event.target
      const isEditing =
        target instanceof HTMLElement &&
        target.matches('input, textarea, select, [contenteditable="true"]')
      if (isEditing) return

      if (feedback && event.key === 'Enter') {
        event.preventDefault()
        onNext()
      } else if (!feedback && /^[1-4]$/.test(event.key)) {
        onAnswer(Number(event.key) - 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [feedback, onAnswer, onNext])

  if (!question) return null

  const progress = (questionNumber / totalQuestions) * 100

  return (
    <section className="quiz-screen" aria-labelledby="question-heading">
      <div className="quiz-progress">
        <div className="progress-label">
          <span>
            Question {questionNumber} of {totalQuestions}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div
          className="progress-track"
          role="progressbar"
          aria-label="Quiz progress"
          aria-valuemin={0}
          aria-valuemax={totalQuestions}
          aria-valuenow={questionNumber}
        >
          <span style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="question-card">
        <div className="question-meta">
          <span className="topic-badge">{question.topic}</span>
          <span className={`difficulty-badge difficulty-${question.difficulty}`}>
            {question.difficulty}
          </span>
        </div>
        <h1 id="question-heading">{question.question}</h1>
        <p className="answer-hint">
          Choose one answer <span aria-hidden="true">·</span> Use keys 1–4
        </p>

        <div className="option-list" role="group" aria-label="Answer options">
          {question.options.map((option, index) => {
            const isCorrect = feedback?.correctIndex === index
            const isSelected = feedback?.selectedIndex === index
            let optionClass = 'answer-option'

            if (feedback && isCorrect) optionClass += ' answer-option-correct'
            else if (feedback && isSelected) {
              optionClass += ' answer-option-wrong'
            }

            return (
              <button
                type="button"
                className={optionClass}
                key={`${question.id}-${index}`}
                onClick={() => onAnswer(index)}
                disabled={Boolean(feedback)}
                aria-pressed={isSelected}
              >
                <span className="option-key">{index + 1}</span>
                <span className="option-text">{option}</span>
                {feedback && isCorrect && (
                  <span className="answer-symbol" aria-label="Correct answer">
                    ✓
                  </span>
                )}
                {feedback && isSelected && !isCorrect && (
                  <span className="answer-symbol" aria-label="Your answer">
                    ✕
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {feedback && (
        <FeedbackPanel
          question={question}
          feedback={feedback}
          simpleExplanation={simpleExplanation}
          explanationLoading={explanationLoading}
          onExplain={onExplain}
          onNext={onNext}
          isLastQuestion={questionNumber === totalQuestions}
        />
      )}
    </section>
  )
}

export default QuizScreen
