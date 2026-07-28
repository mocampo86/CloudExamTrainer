/**
 * Represents a many-to-many relationship between a question and a tag.
 *
 * This join entity is used to validate and document the relationship while
 * keeping questions and tags decoupled. Removing a relationship does not
 * delete the question or the tag.
 */
export interface QuestionTag {
  /** Reference to the question. */
  questionId: string
  /** Reference to the tag. */
  tagId: string
}
