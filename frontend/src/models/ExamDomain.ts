/**
 * Represents a domain within a certification exam.
 *
 * A domain classifies the content structure of an exam (e.g. the official
 * domains defined by a certification provider). It always belongs to exactly
 * one CertificationExam through the `certificationExamId` field.
 *
 * The `code` property must be unique within the parent certification exam,
 * allowing the same code to be reused across different exams.
 */
export interface ExamDomain {
  /** Unique identifier of the exam domain. */
  id: string
  /** Reference to the certification exam this domain belongs to. */
  certificationExamId: string
  /** Unique code within the certification exam (e.g. "D1"). */
  code: string
  /** Display name of the domain. */
  name: string
  /** Optional description of the domain. */
  description?: string
  /** Order used when displaying domains. Non-negative values only. */
  displayOrder: number
  /** Whether the domain is active and available for new content. */
  isActive: boolean
}
