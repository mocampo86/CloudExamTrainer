import type { QuestionDifficulty, QuestionStatus, QuestionType } from './QuestionBank'

/**
 * Answer option exposed by the question detail DTO.
 *
 * The DTO keeps only the information needed by an admin caller and hides
 * internal persistence details.
 */
export interface QuestionDetailOptionDto {
  /** Unique identifier of the option. */
  id: string
  /** Display text of the option. */
  text: string
  /** Whether this option is a correct answer. */
  isCorrect: boolean
  /** Zero-based display order. */
  displayOrder: number
}

/**
 * Full detail of a question returned by an admin query.
 */
export interface QuestionDetailDto {
  /** Unique identifier of the question. */
  id: string
  /** Identifier of the certification exam the question belongs to. */
  certificationExamId: string
  /** Name of the certification exam. */
  certificationExamName: string
  /** Optional identifier of the exam domain. */
  examDomainId?: string
  /** Optional identifier of the topic. */
  topicId?: string
  /** Optional external code, unique within the parent certification. */
  externalCode?: string
  /** Question statement. */
  statement: string
  /** Explanation of the correct answer. */
  explanation?: string
  /** Type of question. */
  type: QuestionType
  /** Difficulty level of the question. */
  difficulty: QuestionDifficulty
  /** Current status of the question. */
  status: QuestionStatus
  /** Language of the question content. */
  language: string
  /** Whether the question is active. */
  isActive: boolean
  /** Answer options in display order. */
  options: QuestionDetailOptionDto[]
  /** Tag identifiers associated with the question. */
  tagIds: string[]
  /** ISO 8601 timestamp of creation in UTC. */
  createdAt: string
  /** ISO 8601 timestamp of the last update in UTC. */
  updatedAt: string
}
