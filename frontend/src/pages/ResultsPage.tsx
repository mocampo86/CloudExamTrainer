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

export function ResultsPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const attempt = (location.state as { attempt?: QuizSession } | undefined)?.attempt

  if (!attempt) {
    return (
      <section>
        <h1>Resultados</h1>
        <p>No hay resultados disponibles.</p>
        <Link to="/">Volver al inicio</Link>
      </section>
    )
  }

  const questions: Question[] = attempt.questionIds
    .map((id) => getQuestionById(id))
    .filter((question): question is Question => question !== undefined)

  const quizResult = calculateQuizResult(questions, attempt.answers)
  const topicResults = calculateTopicResults(questions, attempt.answers)
  const recommendations = getRecommendations(quizResult.percentage)

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
    <section>
      <h1>Resultados</h1>
      <ResultSummary result={quizResult} />
      <section aria-label="Resultados por tema">
        <h2>Desempeño por tema</h2>
        {topicResults.length === 0 ? (
          <p>No hay temas para mostrar.</p>
        ) : (
          <ul>
            {topicResults.map((topicResult) => (
              <li key={topicResult.topic}>
                <strong>{topicResult.topic}</strong>: {topicResult.correctCount} de {topicResult.totalQuestions} ({topicResult.percentage}%)
              </li>
            ))}
          </ul>
        )}
      </section>
      <section aria-label="Recomendaciones">
        <h2>Recomendaciones</h2>
        <ul>
          {recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      </section>
      <div>
        <button onClick={handleRetry}>Repetir cuestionario</button>
        <button onClick={handleGoHome}>Volver al inicio</button>
      </div>
    </section>
  )
}
