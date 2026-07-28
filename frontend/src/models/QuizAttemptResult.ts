import type { QuizResult } from '@/models/QuizResult'
import type { QuizSession } from '@/models/QuizSession'
import type { TopicResult } from '@/models/TopicResult'

/**
 * Summary of the certification associated with a quiz attempt result.
 */
export interface CertificationSummary {
  id: string
  code: string
  name: string
  provider: {
    id: string
    name: string
  }
}

/**
 * Represents a completed quiz attempt with its associated certification,
 * scoring and topic breakdown.
 */
export interface QuizAttemptResult {
  id: string
  session: QuizSession
  certification: CertificationSummary
  result: QuizResult
  topicResults: TopicResult[]
  recommendations: string[]
  startedAt: string
  finishedAt: string
  duration?: string
}
