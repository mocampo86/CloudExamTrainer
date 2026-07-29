import type { QuestionDifficulty, QuestionStatus, QuestionType } from './QuestionBank'

/**
 * Summary item for a paginated list of questions.
 *
 * Excludes full answer options and keeps only the option count to avoid
 * exposing unnecessary data.
 */
export interface QuestionListItemDto {
  /** Unique identifier of the question. */
  id: string
  /** Question statement. */
  statement: string
  /** Identifier of the certification exam. */
  certificationExamId: string
  /** Name of the certification exam. */
  certificationExamName: string
  /** Optional identifier of the exam domain / category. */
  examDomainId?: string
  /** Type of question. */
  type: QuestionType
  /** Difficulty level of the question. */
  difficulty: QuestionDifficulty
  /** Current status of the question. */
  status: QuestionStatus
  /** Number of answer options. */
  optionsCount: number
  /** ISO 8601 timestamp of creation in UTC. */
  createdAt: string
  /** ISO 8601 timestamp of the last update in UTC. */
  updatedAt: string
}
