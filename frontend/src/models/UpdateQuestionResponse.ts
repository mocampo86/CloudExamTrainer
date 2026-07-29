import type { QuestionDifficulty, QuestionType } from './QuestionBank'

/**
 * Response returned after a question is updated successfully.
 *
 * Contains the minimum information needed to confirm the update
 * without exposing the full persistence entity.
 */
export interface UpdateQuestionResponse {
  /** Unique identifier of the updated question. */
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
  /** ISO 8601 timestamp of the last update in UTC. */
  updatedAt: string
}
