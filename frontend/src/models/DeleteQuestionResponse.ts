/**
 * Response after a question has been logically deleted.
 */
export interface DeleteQuestionResponse {
  /** Unique identifier of the deleted question. */
  id: string
  /** Whether the question is still active. Should be false after deletion. */
  isActive: boolean
  /** Deletion timestamp in UTC as an ISO 8601 string. */
  deletedAt: string
}
