/**
 * Command to change the active/inactive status of a question.
 */
export interface ChangeQuestionStatusCommand {
  /** Desired active state of the question. */
  isActive: boolean
}
