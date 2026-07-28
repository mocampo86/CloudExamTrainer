import type { CertificationSummary } from '@/models/QuizAttemptResult'
import type { QuizResult } from '@/models/QuizResult'

interface ResultSummaryProps {
  result: QuizResult
  topic?: string
  duration?: string
  certification?: CertificationSummary
}

export function ResultSummary({ result, topic, duration, certification }: ResultSummaryProps) {
  const { correctCount, incorrectCount, percentage, totalQuestions } = result

  return (
    <section aria-label="Resumen de resultados" className="card result-summary">
      <div className="score-ring" aria-hidden="true">
        <svg className="score-ring__svg" viewBox="0 0 36 36">
          <path
            className="score-ring__track"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
          />
          <path
            className="score-ring__progress"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            fill="none"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${percentage}, 100`}
          />
        </svg>
        <span className="score-ring__value">{percentage}%</span>
      </div>

      <div className="result-grid">
        {certification && (
          <p className="result-summary__certification">
            Certificación: <strong>{certification.provider.name} — {certification.name}</strong>
          </p>
        )}
        <p>
          Puntaje: <strong>{correctCount} de {totalQuestions}</strong>
        </p>
        <p>
          Porcentaje: <strong>{percentage}%</strong>
        </p>
        <p>Correctas: {correctCount} | Incorrectas: {incorrectCount}</p>
        {topic && (
          <p>
            Tema: <strong>{topic}</strong>
          </p>
        )}
        {duration && (
          <p>
            Tiempo: <strong>{duration}</strong>
          </p>
        )}
      </div>
    </section>
  )
}
