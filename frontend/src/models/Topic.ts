/**
 * Represents a topic within a certification exam.
 *
 * A topic always belongs to exactly one CertificationExam, identified
 * by `certificationExamId`. The relation to questions is maintained
 * through the `topic` name on each Question.
 */
export interface Topic {
  /** Reference to the certification exam this topic belongs to. */
  certificationExamId: string
  /** Display name of the topic. */
  name: string
}
