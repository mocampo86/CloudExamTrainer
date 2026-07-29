import { z } from 'zod'
import {
  QuestionTypeValues,
  type QuestionType,
  QuestionDifficultyValues,
  type QuestionDifficulty,
} from '@/models/QuestionBank'

const MAX_STATEMENT_LENGTH = 5000
const MAX_EXPLANATION_LENGTH = 5000
const MAX_EXTERNAL_CODE_LENGTH = 100
const MAX_LANGUAGE_LENGTH = 10
const MAX_OPTION_TEXT_LENGTH = 1000

const questionTypeValues: [QuestionType, ...QuestionType[]] = [
  QuestionTypeValues.SingleChoice,
  QuestionTypeValues.MultipleChoice,
]

const questionDifficultyValues: [QuestionDifficulty, ...QuestionDifficulty[]] = [
  QuestionDifficultyValues.Easy,
  QuestionDifficultyValues.Medium,
  QuestionDifficultyValues.Hard,
]

const updateQuestionOptionSchema = z.object({
  text: z.string().trim().min(1).max(MAX_OPTION_TEXT_LENGTH),
  isCorrect: z.boolean(),
})

export const updateQuestionCommandSchema = z
  .object({
    id: z.string().min(1).optional(),
    certificationExamId: z.string().min(1),
    examDomainId: z.string().min(1).optional(),
    topicId: z.string().min(1).optional(),
    externalCode: z.string().min(1).max(MAX_EXTERNAL_CODE_LENGTH).optional(),
    statement: z.string().trim().min(1).max(MAX_STATEMENT_LENGTH),
    explanation: z.string().max(MAX_EXPLANATION_LENGTH).optional(),
    type: z.enum(questionTypeValues),
    difficulty: z.enum(questionDifficultyValues),
    language: z.string().min(1).max(MAX_LANGUAGE_LENGTH).default('en'),
    options: z.array(updateQuestionOptionSchema).min(2),
    tagIds: z.array(z.string().min(1)).default([]),
    concurrencyToken: z.string().min(1).optional(),
  })
  .superRefine((data, ctx) => {
    const normalizedTexts = new Set<string>()

    data.options.forEach((option, i) => {
      const normalized = option.text.trim().toLowerCase()
      if (normalizedTexts.has(normalized)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'duplicate option text after normalization',
          path: ['options', i, 'text'],
        })
      } else {
        normalizedTexts.add(normalized)
      }
    })

    const correctCount = data.options.filter((option) => option.isCorrect).length

    if (data.type === QuestionTypeValues.SingleChoice && correctCount !== 1) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `single_choice question must have exactly one correct answer, found ${correctCount}`,
        path: ['options'],
      })
    }

    if (data.type === QuestionTypeValues.MultipleChoice) {
      if (correctCount < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `multiple_choice question must have at least two correct answers, found ${correctCount}`,
          path: ['options'],
        })
      }
      if (correctCount === data.options.length) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'multiple_choice question must have at least one incorrect answer',
          path: ['options'],
        })
      }
    }
  })

export interface UpdateQuestionCommandSchemaOptions {
  /** Known certification exam ids used as a foreign-key substitute. */
  certificationExamIds?: ReadonlySet<string>
  /** Map from certification exam id to the set of valid domain ids for that exam. */
  domainIdsByCertification?: ReadonlyMap<string, ReadonlySet<string>>
  /** Map from certification exam id to the set of valid topic ids for that exam. */
  topicIdsByCertification?: ReadonlyMap<string, ReadonlySet<string>>
}

/**
 * Builds a schema that validates cross-reference constraints for the
 * update question command.
 *
 * In the MVP there is no backend persistence layer; these checks replace
 * foreign-key and domain ownership constraints at runtime.
 */
export function createUpdateQuestionCommandSchema(options: UpdateQuestionCommandSchemaOptions = {}) {
  const { certificationExamIds, domainIdsByCertification, topicIdsByCertification } = options

  return updateQuestionCommandSchema.superRefine((data, ctx) => {
    if (certificationExamIds && !certificationExamIds.has(data.certificationExamId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `certificationExamId "${data.certificationExamId}" does not exist`,
        path: ['certificationExamId'],
      })
    }

    if (data.examDomainId) {
      const allowedDomains = domainIdsByCertification?.get(data.certificationExamId)
      if (!allowedDomains || !allowedDomains.has(data.examDomainId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `examDomainId "${data.examDomainId}" does not belong to certification "${data.certificationExamId}"`,
          path: ['examDomainId'],
        })
      }
    }

    if (data.topicId) {
      const allowedTopics = topicIdsByCertification?.get(data.certificationExamId)
      if (!allowedTopics || !allowedTopics.has(data.topicId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `topicId "${data.topicId}" does not belong to certification "${data.certificationExamId}"`,
          path: ['topicId'],
        })
      }
    }
  })
}
