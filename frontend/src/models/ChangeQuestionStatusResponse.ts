import type { QuestionStatus } from './QuestionBank'

/**
 * Response after changing the active/inactive status of a question.
 */
export interface ChangeQuestionStatusResponse {
  /** Unique identifier of the question. */
  id: string
  /** New active flag. */
  isActive: boolean
  /** New lifecycle status. */
  status: QuestionStatus
  /** ISO 8601 timestamp of the last update in UTC. */
  updatedAt: string
}
