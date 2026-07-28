import type { AnswerOption } from './AnswerOption'
import type { QuestionReference } from './QuestionReference'

/**
 * Question types supported by the question bank.
 *
 * These values avoid magic strings and keep the model decoupled from
 * any specific cloud provider or exam.
 */
export const QuestionTypeValues = {
  SingleChoice: 'single_choice',
  MultipleChoice: 'multiple_choice',
} as const

export type QuestionType = (typeof QuestionTypeValues)[keyof typeof QuestionTypeValues]

/**
 * Difficulty levels supported for a question.
 */
export const QuestionDifficultyValues = {
  Easy: 'easy',
  Medium: 'medium',
  Hard: 'hard',
} as const

export type QuestionDifficulty = (typeof QuestionDifficultyValues)[keyof typeof QuestionDifficultyValues]

/**
 * Lifecycle status of a question in the bank.
 *
 * New questions are created as `Draft` and only `Active` questions are
 * eligible for public quizzes.
 */
export const QuestionStatusValues = {
  Draft: 'draft',
  Active: 'active',
  Archived: 'archived',
} as const

export type QuestionStatus = (typeof QuestionStatusValues)[keyof typeof QuestionStatusValues]

/**
 * Represents a question in the question bank.
 *
 * This is the base entity for the question bank module.
 *
 * A question always belongs to exactly one CertificationExam. The optional
 * `examDomainId` and `topicId` must belong to the same certification when
 * provided.
 *
 * Answer options are part of the question (one-to-many). The `isCorrect`
 * flag on each option is the source of truth for correctness.
 */
export interface QuestionBank {
  /** Unique identifier of the question. */
  id: string
  /** Reference to the certification exam this question belongs to. */
  certificationExamId: string
  /** Optional reference to an exam domain from the same certification. */
  examDomainId?: string
  /** Optional reference to a topic from the same certification. */
  topicId?: string
  /** Optional external code, unique within the parent certification. */
  externalCode?: string
  /** Question statement. Must contain at least one non-whitespace character. */
  statement: string
  /** Optional explanation of the correct answer. */
  explanation?: string
  /** Type of question. */
  type: QuestionType
  /** Difficulty level of the question. */
  difficulty: QuestionDifficulty
  /** Current lifecycle status of the question. */
  status: QuestionStatus
  /** Language of the question content (e.g. "en", "es"). */
  language: string
  /** Whether the question is active and available for new content. */
  isActive: boolean
  /** Answer options for the question. A question must have two or more options. */
  options: AnswerOption[]
  /** Tag ids associated with the question. Tags are global and reusable across certifications. */
  tagIds: string[]
  /** External references associated with the question. */
  references: QuestionReference[]
  /** ISO 8601 timestamp of creation. */
  createdAt: string
  /** ISO 8601 timestamp of last update. */
  updatedAt: string
}
