import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { QuestionCard } from '@/components/QuestionCard'
import { getQuestionById } from '@/services/questionService'
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
      <section>
        <h1>Cuestionario</h1>
        <p>No hay un cuestionario activo.</p>
        <Link to="/">Volver al inicio</Link>
      </section>
    )
  }

  const currentQuestionId = session.questionIds[session.currentIndex]
  const currentQuestion = currentQuestionId ? getQuestionById(currentQuestionId) : undefined

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

  const finishQuiz = () => {
    const finishedAt = new Date().toISOString()
    const completedSession: QuizSession = {
      ...session,
      status: 'completed',
      finishedAt,
    }
    setSession(completedSession)
    navigate('/results', { state: { attempt: completedSession } })
  }

  const handleFinishRequest = () => {
    const pending = countPendingAnswers(session)
    if (pending === 0) {
      finishQuiz()
    } else {
      setShowFinishConfirmation(true)
    }
  }

  const handleCancelFinish = () => {
    setShowFinishConfirmation(false)
  }

  if (!currentQuestion) {
    return (
      <section>
        <h1>Cuestionario</h1>
        <p>La pregunta no está disponible.</p>
      </section>
    )
  }

  const selectedAnswerIds = session.answers[currentQuestionId] ?? []
  const progress = getProgressPercent(session.currentIndex, session.questionIds.length)
  const isLastQuestion = session.currentIndex === session.questionIds.length - 1
  const pendingCount = showFinishConfirmation ? countPendingAnswers(session) : 0

  return (
    <section>
      <h1>Cuestionario</h1>
      <p>Pregunta {session.currentIndex + 1} de {session.questionIds.length}</p>
      <div
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Progreso del cuestionario"
      >
        <div
          style={{
            width: `${progress}%`,
            height: '8px',
            backgroundColor: 'currentColor',
          }}
        />
      </div>
      <QuestionCard
        question={currentQuestion}
        selectedAnswerIds={selectedAnswerIds}
        onAnswerChange={handleAnswerChange}
      />
      <div>
        <button onClick={handlePrevious} disabled={session.currentIndex === 0}>
          Anterior
        </button>
        {isLastQuestion ? (
          <button onClick={handleFinishRequest}>Finalizar</button>
        ) : (
          <button onClick={handleNext} disabled={session.currentIndex === session.questionIds.length - 1}>
            Siguiente
          </button>
        )}
      </div>
      {showFinishConfirmation && (
        <div role="dialog" aria-modal="true" aria-labelledby="finish-title">
          <h2 id="finish-title">Confirmar finalización</h2>
          <p>Quedan {pendingCount} preguntas sin responder.</p>
          <button onClick={handleCancelFinish}>Cancelar</button>
          <button onClick={finishQuiz}>Confirmar y finalizar</button>
        </div>
      )}
    </section>
  )
}
