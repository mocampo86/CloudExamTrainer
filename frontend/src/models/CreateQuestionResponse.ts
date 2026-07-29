import type { QuestionDifficulty, QuestionType } from './QuestionBank'

/**
 * Response returned after a question is created successfully.
 *
 * Contains the minimum information needed to confirm the creation
 * without exposing the full persistence entity.
 */
export interface CreateQuestionResponse {
  /** Unique identifier of the created question. */
  id: string
  /** Identifier of the certification exam the question belongs to. */
  certificationExamId: string
  /** Question statement. */
  statement: string
  /** Type of question. */
  type: QuestionType
  /** Difficulty level of the question. */
  difficulty: QuestionDifficulty
  /** ISO 8601 timestamp of creation in UTC. */
  createdAt: string
}
