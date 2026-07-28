/**
 * Difficulty levels supported for a certification exam.
 *
 * These values can be extended in the future without changing the
 * model contract because they are defined as a named type.
 */
export type CertificationExamDifficulty = 'easy' | 'medium' | 'hard'

/**
 * Represents a certification exam offered by a provider.
 *
 * A CertificationExam always belongs to exactly one Provider through
 * the `providerId` field, forming a one-to-many relationship.
 * The `code` property must be unique across all exams.
 */
export interface CertificationExam {
  /** Unique identifier of the exam. */
  id: string
  /** Reference to the provider that offers this exam. */
  providerId: string
  /** Unique code that identifies the exam (e.g. "SAA-C03"). */
  code: string
  /** Display name of the exam (e.g. "AWS Certified Solutions Architect - Associate"). */
  name: string
  /** Short description of the exam. */
  description: string
  /** Exam version or revision (e.g. "SAA-C03"). */
  version: string
  /** Difficulty level of the exam. */
  difficulty: CertificationExamDifficulty
  /** Whether the exam is active and available for selection. */
  isActive: boolean
  /** URL or path to the exam image or badge. */
  imageUrl: string
}
