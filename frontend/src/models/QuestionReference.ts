/**
 * Reference types supported for a question reference.
 *
 * The list is extensible and not tied to any specific cloud provider,
 * allowing new categories to be added without changing the model contract.
 */
export const ReferenceTypeValues = {
  OfficialDocumentation: 'official_documentation',
  Whitepaper: 'whitepaper',
  Other: 'other',
} as const

export type ReferenceType = (typeof ReferenceTypeValues)[keyof typeof ReferenceTypeValues]

/**
 * Represents an external reference associated with a question.
 *
 * A reference can point to official documentation, whitepapers or any other
 * authorized resource. It always belongs to exactly one Question.
 */
export interface QuestionReference {
  /** Unique identifier of the reference. */
  id: string
  /** Reference to the question this resource belongs to. */
  questionId: string
  /** Display title of the reference. */
  title: string
  /** URL of the external resource. Only http and https schemes are allowed. */
  url: string
  /** Classification of the referenced resource. */
  referenceType: ReferenceType
  /** Order used when displaying references. Non-negative values only. */
  displayOrder: number
}
