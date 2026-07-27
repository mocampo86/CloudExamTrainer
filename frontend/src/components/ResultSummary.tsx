import type { QuizResult } from '@/models/QuizResult'

interface ResultSummaryProps {
  result: QuizResult
}

export function ResultSummary({ result }: ResultSummaryProps) {
  const { correctCount, incorrectCount, percentage, totalQuestions } = result

  return (
    <section aria-label="Resumen de resultados">
      <h2>Resumen</h2>
      <p>
        Puntaje: <strong>{correctCount} de {totalQuestions}</strong>
      </p>
      <p>
        Porcentaje: <strong>{percentage}%</strong>
      </p>
      <p>
        Correctas: {correctCount} | Incorrectas: {incorrectCount}
      </p>
    </section>
  )
}
