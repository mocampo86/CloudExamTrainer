import { useLocation, useNavigate, Link } from 'react-router-dom'
import { ResultSummary } from '@/components/ResultSummary'
import { calculateQuizResult, calculateTopicResults } from '@/services/scoringService'
import { createQuizSession, getQuestionById } from '@/services/questionService'
import type { Question } from '@/models/Question'
import type { QuizSession } from '@/models/QuizSession'

function getRecommendations(percentage: number): string[] {
  if (percentage >= 85) {
    return ['¡Excelente desempeño! Continúa practicando para mantener el nivel.']
  }
  if (percentage >= 70) {
    return ['Buen nivel. Refuerza los temas con menor puntuación.']
  }
  if (percentage >= 50) {
    return ['Necesitas repasar. Prioriza los temas marcados como "Requiere atención".']
  }
  return ['Desempeño bajo. Estudia los conceptos fundamentales antes de continuar.']
}

function getHeaderMessage(percentage: number): string {
  if (percentage >= 85) {
    return '¡Felicitaciones! Excelente trabajo.'
  }
  if (percentage >= 70) {
    return '¡Buen trabajo! Sigues mejorando.'
  }
  if (percentage >= 50) {
    return 'Sigue adelante, puedes lograrlo.'
  }
  return 'No te rindas, repasa los conceptos fundamentales.'
}

function formatDuration(startedAt: string, finishedAt?: string): string | undefined {
  if (!finishedAt) return undefined

  const diff = Math.max(0, new Date(finishedAt).getTime() - new Date(startedAt).getTime())
  const totalSeconds = Math.floor(diff / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes > 0) {
    return `${minutes} min ${seconds} s`
  }
  return `${seconds} s`
}

function isQuestionCorrect(question: Question, selectedAnswerIds: string[]): boolean {
  if (selectedAnswerIds.length !== question.correctAnswers.length) {
    return false
  }
  const selectedSet = new Set(selectedAnswerIds)
  return question.correctAnswers.every((answerId) => selectedSet.has(answerId))
}

function getAnswerText(question: Question, answerIds: string[]): string {
  if (answerIds.length === 0) return 'Sin respuesta'

  const optionMap = new Map(question.options.map((option) => [option.id, option.text]))
  const texts = answerIds.map((id) => optionMap.get(id) ?? id)
  return texts.join(', ')
}

export function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const attempt = (location.state as { attempt?: QuizSession } | undefined)?.attempt

  if (!attempt) {
    return (
      <section className="empty-state">
        <h1>Resultados</h1>
        <p>No hay resultados disponibles.</p>
        <Link to="/" className="btn btn-secondary">
          Volver al inicio
        </Link>
      </section>
    )
  }

  const questions: Question[] = attempt.questionIds
    .map((id) => getQuestionById(id))
    .filter((question): question is Question => question !== undefined)

  const quizResult = calculateQuizResult(questions, attempt.answers)
  const topicResults = calculateTopicResults(questions, attempt.answers)
  const recommendations = getRecommendations(quizResult.percentage)
  const headerMessage = getHeaderMessage(quizResult.percentage)
  const duration = formatDuration(attempt.startedAt, attempt.finishedAt)

  const handleRetry = () => {
    const newSession = createQuizSession({
      topic: attempt.topic,
      count: attempt.questionIds.length,
    })
    navigate('/quiz', { state: { session: newSession } })
  }

  const handleGoHome = () => {
    navigate('/')
  }

  return (
    <section className="results-page">
      <header className="page-header">
        <h1 className="page-header__title">Cuestionario finalizado</h1>
        <p className="page-header__description">{headerMessage}</p>
      </header>

      <ResultSummary result={quizResult} topic={attempt.topic} duration={duration} />

      <section aria-label="Resultados por tema" className="results-section">
        <h2 className="results-section__title">Desempeño por tema</h2>
        {topicResults.length === 0 ? (
          <p className="info-text">No hay temas para mostrar.</p>
        ) : (
          <ul className="topic-list">
            {topicResults.map((topicResult) => (
              <li key={topicResult.topic} className="topic-item">
                <strong>{topicResult.topic}</strong>: {topicResult.correctCount} de {topicResult.totalQuestions} ({topicResult.percentage}%)
              </li>
            ))}
          </ul>
        )}
      </section>

      <section aria-label="Recomendaciones" className="results-section">
        <h2 className="results-section__title">Recomendaciones</h2>
        <ul className="recommendation-list">
          {recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </section>

      <section aria-label="Revisión de respuestas" className="results-section">
        <h2 className="results-section__title">Revisión de respuestas</h2>
        <ol className="answer-list">
          {questions.map((question, index) => {
            const selectedAnswerIds = attempt.answers[question.id] ?? []
            const correct = isQuestionCorrect(question, selectedAnswerIds)
            const selectedText = getAnswerText(question, selectedAnswerIds)
            const correctText = getAnswerText(question, question.correctAnswers)

            return (
              <li key={question.id} className="card answer-card">
                <div className="answer-card__header">
                  <h3 className="answer-card__title">
                    Pregunta {index + 1}
                  </h3>
                  <span className={`status-badge ${correct ? 'status-badge--correct' : 'status-badge--incorrect'}`}>
                    {correct ? 'Correcta' : 'Incorrecta'}
                  </span>
                </div>
                <p className="answer-card__question">{question.question}</p>
                <div className="answer-card__row">
                  <span className="answer-card__label">Tu respuesta:</span>
                  <span className={correct ? 'answer-card__value--correct' : 'answer-card__value--incorrect'}>
                    {selectedText}
                  </span>
                </div>
                <div className="answer-card__row">
                  <span className="answer-card__label">Respuesta correcta:</span>
                  <span className="answer-card__value--correct">{correctText}</span>
                </div>
                {question.explanation && (
                  <p className="answer-card__explanation">
                    <strong>Explicación:</strong> {question.explanation}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </section>

      <div className="actions">
        <button onClick={handleRetry} className="btn btn-primary">
          Repetir cuestionario
        </button>
        <button onClick={handleGoHome} className="btn btn-secondary">
          Volver al inicio
        </button>
      </div>
    </section>
  )
}
