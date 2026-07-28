import { useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { QuestionCard } from '@/components/QuestionCard'
import { getQuestionById } from '@/services/questionService'
import { calculateQuizResult } from '@/services/scoringService'
import { createAttemptResult } from '@/services/resultService'
import type { Question } from '@/models/Question'
import type { QuizSession } from '@/models/QuizSession'
import type { QuizAnswer } from '@/models/QuizAnswer'

function getProgressPercent(current: number, total: number): number {
  if (total === 0) return 0
  return ((current + 1) / total) * 100
}

function countPendingAnswers(session: QuizSession): number {
  return session.questionIds.filter((questionId) => {
    const answer = session.answers[questionId]
    return !answer || answer.length === 0
  }).length
}

export function QuizPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const initialSession = (location.state as { session?: QuizSession } | undefined)?.session
  const [session, setSession] = useState<QuizSession | null>(initialSession ?? null)
  const [showFinishConfirmation, setShowFinishConfirmation] = useState(false)

  if (!session) {
    return (
      <section className="empty-state">
        <h1>Cuestionario</h1>
        <p>No hay un cuestionario activo.</p>
        <Link to="/" className="btn btn-secondary">
          Volver al inicio
        </Link>
      </section>
    )
  }

  const currentQuestionId = session.questionIds[session.currentIndex]
  const currentQuestion = currentQuestionId
    ? getQuestionById(currentQuestionId, session.certificationExamId)
    : undefined

  const allQuestions = useMemo(() => {
    return session.questionIds
      .map((id) => getQuestionById(id, session.certificationExamId))
      .filter((question): question is Question => question !== undefined)
  }, [session])

  const partialResult = useMemo(() => {
    return calculateQuizResult(allQuestions, session.answers)
  }, [allQuestions, session.answers])

  const handleAnswerChange = (answerIds: QuizAnswer) => {
    setSession((prev) => {
      if (!prev) return prev
      return {
        ...prev,
        answers: {
          ...prev.answers,
          [currentQuestionId]: answerIds,
        },
      }
    })
  }

  const goToQuestion = (index: number) => {
    setSession((prev) => (prev ? { ...prev, currentIndex: index } : prev))
  }

  const handlePrevious = () => {
    if (session.currentIndex > 0) {
      goToQuestion(session.currentIndex - 1)
    }
  }

  const handleNext = () => {
    if (session.currentIndex < session.questionIds.length - 1) {
      goToQuestion(session.currentIndex + 1)
    }
  }

  const finishQuiz = async () => {
    const finishedAt = new Date().toISOString()
    const completedSession: QuizSession = {
      ...session,
      status: 'completed',
      finishedAt,
    }
    setSession(completedSession)
    const attemptResult = await createAttemptResult(completedSession)
    navigate('/results', { state: { attempt: attemptResult } })
  }

  const handleFinishRequest = async () => {
    const pending = countPendingAnswers(session)
    if (pending === 0) {
      await finishQuiz()
    } else {
      setShowFinishConfirmation(true)
    }
  }

  const handleCancelFinish = () => {
    setShowFinishConfirmation(false)
  }

  if (!currentQuestion) {
    return (
      <section className="empty-state">
        <h1>Cuestionario</h1>
        <p>La pregunta no está disponible.</p>
        <Link to="/" className="btn btn-secondary">
          Volver al inicio
        </Link>
      </section>
    )
  }

  const selectedAnswerIds = session.answers[currentQuestionId] ?? []
  const progress = getProgressPercent(session.currentIndex, session.questionIds.length)
  const isLastQuestion = session.currentIndex === session.questionIds.length - 1
  const pendingCount = showFinishConfirmation ? countPendingAnswers(session) : 0

  return (
    <section className="quiz-page">
      <header className="quiz-header">
        <h1 className="quiz-header__title">Cuestionario</h1>
        <div className="quiz-header__meta">
          <span className="quiz-header__topic">{session.topic}</span>
          <span>Pregunta {session.currentIndex + 1} de {session.questionIds.length}</span>
          <span>Puntaje parcial: {partialResult.correctCount} de {partialResult.totalQuestions}</span>
        </div>
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso del cuestionario"
        >
          <div className="progress-bar__fill" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <QuestionCard
        question={currentQuestion}
        selectedAnswerIds={selectedAnswerIds}
        onAnswerChange={handleAnswerChange}
      />

      <div className="quiz-actions">
        <button
          onClick={handlePrevious}
          disabled={session.currentIndex === 0}
          className="btn btn-secondary"
        >
          Anterior
        </button>
        {isLastQuestion ? (
          <button onClick={handleFinishRequest} className="btn btn-primary">
            Finalizar
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={session.currentIndex === session.questionIds.length - 1}
            className="btn btn-primary"
          >
            Siguiente
          </button>
        )}
      </div>

      {showFinishConfirmation && (
        <div className="modal-overlay">
          <div role="dialog" aria-modal="true" aria-labelledby="finish-title" className="card modal">
            <h2 id="finish-title" className="modal__title">Confirmar finalización</h2>
            <p className="modal__text">Quedan {pendingCount} preguntas sin responder.</p>
            <div className="modal__actions">
              <button onClick={handleCancelFinish} className="btn btn-secondary">
                Cancelar
              </button>
              <button onClick={finishQuiz} className="btn btn-primary">
                Confirmar y finalizar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
