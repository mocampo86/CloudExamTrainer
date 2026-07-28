/**
 * Represents a single answer option for a question.
 *
 * An answer option always belongs to exactly one Question through the
 * `questionId` field. The `isCorrect` flag is the source of truth for
 * correctness; there is no separate correct-answer list based on letters
 * or positions.
 */
export interface AnswerOption {
  /** Unique identifier of the answer option. */
  id: string
  /** Reference to the question this option belongs to. */
  questionId: string
  /** Display text of the option. Must contain at least one non-whitespace character. */
  text: string
  /** Whether this option is a correct answer. */
  isCorrect: boolean
  /** Order used when displaying options. Non-negative values only. */
  displayOrder: number
}
