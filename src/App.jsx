import { useCallback, useEffect, useState } from 'react'
import {
  buildQuiz,
  calculateScore,
  checkAnswer,
  explainSimpler,
  getProgress,
  saveResult,
} from './components/mocks/logicMock.js'
import { MOCK_QUESTIONS } from './components/mocks/logicMock.js'
import EmptyState from './components/EmptyState.jsx'
import ErrorState from './components/ErrorState.jsx'
import LoadingState from './components/LoadingState.jsx'
import QuizScreen from './components/QuizScreen.jsx'
import ResultsScreen from './components/ResultsScreen.jsx'
import TopicPicker from './components/TopicPicker.jsx'

const QUESTION_COUNT = 10

function isQuestionBank(value) {
  return (
    Array.isArray(value) &&
    value.every(
      (question) =>
        question &&
        typeof question.id === 'string' &&
        typeof question.topic === 'string' &&
        typeof question.subtopic === 'string' &&
        ['easy', 'medium', 'hard'].includes(question.difficulty) &&
        typeof question.question === 'string' &&
        Array.isArray(question.options) &&
        question.options.length === 4 &&
        question.options.every((option) => typeof option === 'string') &&
        Number.isInteger(question.correctIndex) &&
        question.correctIndex >= 0 &&
        question.correctIndex <= 3 &&
        typeof question.explanation === 'string' &&
        Array.isArray(question.whyOthersWrong) &&
        question.whyOthersWrong.length === 4 &&
        question.whyOthersWrong.every((reason, index) =>
          index === question.correctIndex
            ? reason === null
            : typeof reason === 'string',
        ),
    )
  )
}

function App() {
  const [questions, setQuestions] = useState(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [progress, setProgress] = useState(() => getProgress())
  const [screen, setScreen] = useState('home')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [quiz, setQuiz] = useState([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [result, setResult] = useState(null)
  const [simpleExplanation, setSimpleExplanation] = useState('')
  const [explanationLoading, setExplanationLoading] = useState(false)

  const loadQuestions = useCallback(async () => {
    setLoading(true)
    setLoadError('')

    try {
      const response = await fetch('/data/questions.json')
      if (!response.ok) {
        throw new Error(`Question bank request failed (${response.status}).`)
      }
      if (
        !response.headers
          .get('content-type')
          ?.toLowerCase()
          .includes('application/json')
      ) {
        throw new Error(
          'The question bank URL did not return JSON. Check that data/questions.json is served as a static file.',
        )
      }

      const questionBank = await response.json()
      if (!isQuestionBank(questionBank)) {
        throw new Error('The question bank does not match the required format.')
      }

      setQuestions(questionBank)
    } catch (error) {
      setQuestions(null)
      setLoadError(
        error instanceof Error
          ? error.message
          : 'An unknown error occurred while loading questions.',
      )
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void loadQuestions()
  }, [loadQuestions])

  const beginQuiz = (topic, sourceQuestions = questions) => {
    const nextQuiz = buildQuiz(sourceQuestions, {
      topic,
      count: QUESTION_COUNT,
      difficulty: 'all',
    })

    setSelectedTopic(topic)
    setQuiz(nextQuiz)
    setCurrentIndex(0)
    setAnswers([])
    setFeedback(null)
    setResult(null)
    setSimpleExplanation('')
    setScreen(nextQuiz.length ? 'quiz' : 'empty')
  }

  const answerQuestion = (selectedIndex) => {
    if (feedback || !quiz[currentIndex]) return

    const question = quiz[currentIndex]
    const answerFeedback = checkAnswer(question, selectedIndex)

    setAnswers((currentAnswers) => [
      ...currentAnswers,
      {
        question,
        selectedIndex,
        isCorrect: answerFeedback.isCorrect,
      },
    ])
    setFeedback({ ...answerFeedback, selectedIndex })
    setSimpleExplanation('')
  }

  const goToNextQuestion = () => {
    if (!feedback) return

    if (currentIndex + 1 < quiz.length) {
      setCurrentIndex((index) => index + 1)
      setFeedback(null)
      setSimpleExplanation('')
      return
    }

    const score = calculateScore(answers)
    const missedAnswers = answers.filter((answer) => !answer.isCorrect)
    const missedIds = missedAnswers.map((answer) => answer.question.id)

    saveResult(selectedTopic, score.correct, score.total, missedIds)
    setProgress(getProgress())
    setResult({
      topic: selectedTopic,
      score,
      answers,
      missedAnswers,
    })
    setScreen('results')
  }

  const requestSimplerExplanation = async () => {
    if (!feedback || !quiz[currentIndex]) return

    setExplanationLoading(true)
    setSimpleExplanation('')
    try {
      const explanation = await explainSimpler(
        quiz[currentIndex],
        feedback.selectedIndex,
      )
      setSimpleExplanation(explanation)
    } catch {
      setSimpleExplanation(
        'A simpler explanation is not available right now. Please use the explanation above and try again later.',
      )
    } finally {
      setExplanationLoading(false)
    }
  }

  const goHome = () => {
    setScreen('home')
    setFeedback(null)
    setResult(null)
  }

  const useSampleQuestions = () => {
    setQuestions(MOCK_QUESTIONS)
    setLoadError('')
    setProgress(getProgress())
    setScreen('home')
  }

  return (
    <div className="app-shell">
      <header className="site-header">
        <a
          className="wordmark"
          href="/"
          onClick={(event) => {
            event.preventDefault()
            goHome()
          }}
        >
          <span className="wordmark-symbol" aria-hidden="true">
            <svg viewBox="0 0 40 40" focusable="false">
              <path d="M20 3.5 36 12.75v14.5L20 36.5 4 27.25v-14.5L20 3.5Z" />
              <path d="m12 20 5 5 11-12" />
            </svg>
          </span>
          <span className="wordmark-name">AZORA</span>
        </a>
        {!loading && !loadError && screen === 'home' && (
          <>
            <nav className="main-navigation" aria-label="Main navigation">
              <a href="#topics">Learn</a>
              <a href="#features">Features</a>
            </nav>
            <a className="button button-primary header-cta" href="#topics">
              Start learning <span aria-hidden="true">↗</span>
            </a>
          </>
        )}
        {!loading && !loadError && screen !== 'home' && (
          <button className="text-button" type="button" onClick={goHome}>
            <span aria-hidden="true">←</span> Dashboard
          </button>
        )}
      </header>

      <main id="main-content" className="main-content">
        {loading && <LoadingState />}
        {!loading && loadError && (
          <ErrorState
            message={loadError}
            onRetry={loadQuestions}
            onUseSample={import.meta.env.DEV ? useSampleQuestions : undefined}
          />
        )}
        {!loading &&
          !loadError &&
          (screen === 'empty' || !questions?.length) && (
            <EmptyState
              onHome={goHome}
              message={
                questions?.length
                  ? 'There are no questions for this selection yet.'
                  : 'The question bank is empty. Add questions to get started.'
              }
            />
          )}
        {!loading &&
          !loadError &&
          questions?.length > 0 &&
          screen === 'home' && (
            <TopicPicker
              questions={questions}
              progress={progress}
              onSelectTopic={beginQuiz}
            />
          )}
        {!loading &&
          !loadError &&
          questions?.length > 0 &&
          screen === 'quiz' && (
            <QuizScreen
              question={quiz[currentIndex]}
              questionNumber={currentIndex + 1}
              totalQuestions={quiz.length}
              feedback={feedback}
              simpleExplanation={simpleExplanation}
              explanationLoading={explanationLoading}
              onAnswer={answerQuestion}
              onNext={goToNextQuestion}
              onExplain={requestSimplerExplanation}
            />
          )}
        {!loading &&
          !loadError &&
          questions?.length > 0 &&
          screen === 'results' &&
          result && (
            <ResultsScreen
              result={result}
              onRetryMissed={() =>
                beginQuiz(
                  result.topic,
                  result.missedAnswers.map((answer) => answer.question),
                )
              }
              onTryAnotherTopic={goHome}
              onHome={goHome}
            />
          )}
      </main>

      <footer className="site-footer">
        Unofficial AZ-900 practice tool. Not affiliated with or endorsed by
        Microsoft.
      </footer>
    </div>
  )
}

export default App
