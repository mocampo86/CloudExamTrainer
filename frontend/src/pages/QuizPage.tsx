import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { QuestionCard } from '@/components/QuestionCard'
import { getQuestionById } from '@/services/questionService'
import type { QuizSession } from '@/models/QuizSession'
import type { QuizAnswer } from '@/models/QuizAnswer'

function getProgressPercent(current: number, total: number): number {
  if (total === 0) return 0
  return ((current + 1) / total) * 100
}

export function QuizPage() {
  const location = useLocation()
  const initialSession = (location.state as { session?: QuizSession } | undefined)?.session
  const [session, setSession] = useState<QuizSession | null>(initialSession ?? null)

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
        <button onClick={handleNext} disabled={session.currentIndex === session.questionIds.length - 1}>
          Siguiente
        </button>
      </div>
    </section>
  )
}
