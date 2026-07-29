/**
 * Response after duplicating an existing question.
 */
export interface DuplicateQuestionResponse {
  /** Unique identifier of the newly created question. */
  id: string
  /** Identifier of the source question. */
  sourceQuestionId: string
  /** Whether the new question is active. Should be false by default. */
  isActive: boolean
}
