import type { Question } from '@/models/Question'
import type { QuizAttemptResult } from '@/models/QuizAttemptResult'
import type { QuizSession } from '@/models/QuizSession'
import { getCertificationById } from '@/services/certificationService'
import { getQuestionById } from '@/services/questionService'
import { calculateQuizResult, calculateTopicResults } from '@/services/scoringService'

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

function formatDuration(startedAt: string, finishedAt: string): string {
  const diff = Math.max(0, new Date(finishedAt).getTime() - new Date(startedAt).getTime())
  const totalSeconds = Math.floor(diff / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  if (minutes > 0) {
    return `${minutes} min ${seconds} s`
  }
  return `${seconds} s`
}

function resolveQuestions(session: QuizSession): Question[] {
  return session.questionIds
    .map((id) => getQuestionById(id, session.certificationExamId))
    .filter((question): question is Question => question !== undefined)
}

/**
 * Creates a QuizAttemptResult from a completed session.
 *
 * The certification is resolved from the validated persistence source and
 * cannot be altered by the caller. If the certification cannot be resolved,
 * the result creation fails.
 */
export async function createAttemptResult(
  session: QuizSession,
): Promise<QuizAttemptResult> {
  if (!session.certificationExamId) {
    throw new Error('Session does not have a certification identifier')
  }

  const certification = await getCertificationById(session.certificationExamId)
  if (!certification) {
    throw new Error('Certification not found or inactive')
  }

  const finishedAt = session.finishedAt ?? new Date().toISOString()
  const questions = resolveQuestions(session)
  const result = calculateQuizResult(questions, session.answers)
  const topicResults = calculateTopicResults(questions, session.answers)

  return {
    id: session.id,
    session,
    certification: {
      id: certification.id,
      code: certification.code,
      name: certification.name,
      provider: {
        id: certification.provider.id,
        name: certification.provider.name,
      },
    },
    result,
    topicResults,
    recommendations: getRecommendations(result.percentage),
    startedAt: session.startedAt,
    finishedAt,
    duration: formatDuration(session.startedAt, finishedAt),
  }
}

/**
 * Filters attempt results by certification id.
 */
export function filterAttemptResultsByCertification(
  results: QuizAttemptResult[],
  certificationExamId: string,
): QuizAttemptResult[] {
  return results.filter(
    (result) => result.certification.id === certificationExamId,
  )
}
