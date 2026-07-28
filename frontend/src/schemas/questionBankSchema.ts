import { z } from 'zod'
import { answerOptionSchema } from './answerOptionSchema'
import { questionReferenceSchema } from './questionReferenceSchema'
import {
  QuestionTypeValues,
  type QuestionType,
  QuestionDifficultyValues,
  type QuestionDifficulty,
  QuestionStatusValues,
  type QuestionStatus,
} from '@/models/QuestionBank'

const MAX_STATEMENT_LENGTH = 5000
const MAX_EXPLANATION_LENGTH = 5000
const MAX_EXTERNAL_CODE_LENGTH = 100
const MAX_LANGUAGE_LENGTH = 10

const questionTypeValues: [QuestionType, ...QuestionType[]] = [
  QuestionTypeValues.SingleChoice,
  QuestionTypeValues.MultipleChoice,
]

const questionDifficultyValues: [QuestionDifficulty, ...QuestionDifficulty[]] = [
  QuestionDifficultyValues.Easy,
  QuestionDifficultyValues.Medium,
  QuestionDifficultyValues.Hard,
]

const questionStatusValues: [QuestionStatus, ...QuestionStatus[]] = [
  QuestionStatusValues.Draft,
  QuestionStatusValues.Active,
  QuestionStatusValues.Archived,
]

export const questionBankSchema = z
  .object({
    id: z.string().min(1),
    certificationExamId: z.string().min(1),
    examDomainId: z.string().min(1).optional(),
    topicId: z.string().min(1).optional(),
    externalCode: z.string().min(1).max(MAX_EXTERNAL_CODE_LENGTH).optional(),
    statement: z.string().trim().min(1).max(MAX_STATEMENT_LENGTH),
    explanation: z.string().max(MAX_EXPLANATION_LENGTH).optional(),
    type: z.enum(questionTypeValues),
    difficulty: z.enum(questionDifficultyValues),
    status: z.enum(questionStatusValues).default(QuestionStatusValues.Draft),
    language: z.string().min(1).max(MAX_LANGUAGE_LENGTH),
    isActive: z.boolean().default(true),
    options: z.array(answerOptionSchema).min(2),
    tagIds: z.array(z.string().min(1)).default([]),
    references: z.array(questionReferenceSchema).default([]),
    createdAt: z.string().datetime().default(() => new Date().toISOString()),
    updatedAt: z.string().datetime().default(() => new Date().toISOString()),
  })
  .superRefine((data, ctx) => {
    const displayOrders = new Set<number>()
    const texts = new Set<string>()
    const tagIds = new Set<string>()
    const referenceDisplayOrders = new Set<number>()

    data.options.forEach((option, i) => {
      if (option.questionId !== data.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `option questionId "${option.questionId}" does not match question id "${data.id}"`,
          path: ['options', i, 'questionId'],
        })
      }

      if (displayOrders.has(option.displayOrder)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate displayOrder "${option.displayOrder}" within question "${data.id}"`,
          path: ['options', i, 'displayOrder'],
        })
      } else {
        displayOrders.add(option.displayOrder)
      }

      if (texts.has(option.text)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate option text within question "${data.id}"`,
          path: ['options', i, 'text'],
        })
      } else {
        texts.add(option.text)
      }
    })

    data.tagIds.forEach((tagId, i) => {
      if (tagIds.has(tagId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate tagId "${tagId}" within question "${data.id}"`,
          path: ['tagIds', i],
        })
      } else {
        tagIds.add(tagId)
      }
    })

    data.references.forEach((reference, i) => {
      if (reference.questionId !== data.id) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `reference questionId "${reference.questionId}" does not match question id "${data.id}"`,
          path: ['references', i, 'questionId'],
        })
      }

      if (referenceDisplayOrders.has(reference.displayOrder)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate reference displayOrder "${reference.displayOrder}" within question "${data.id}"`,
          path: ['references', i, 'displayOrder'],
        })
      } else {
        referenceDisplayOrders.add(reference.displayOrder)
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
          message: `multiple_choice question must have at least one incorrect answer`,
          path: ['options'],
        })
      }
    }
  })

export const questionBanksSchema = z.array(questionBankSchema).superRefine((questions, ctx) => {
  const ids = new Set<string>()
  const externalCodes = new Set<string>()

  questions.forEach((question, i) => {
    const idKey = `${question.certificationExamId}:${question.id}`
    if (ids.has(idKey)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate question id "${question.id}" within certification "${question.certificationExamId}"`,
        path: [i, 'id'],
      })
    } else {
      ids.add(idKey)
    }

    if (question.externalCode) {
      const codeKey = `${question.certificationExamId}:${question.externalCode}`
      if (externalCodes.has(codeKey)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate external code "${question.externalCode}" within certification "${question.certificationExamId}"`,
          path: [i, 'externalCode'],
        })
      } else {
        externalCodes.add(codeKey)
      }
    }
  })
})

export interface CreateQuestionBanksSchemaOptions {
  domainIdsByCertification?: ReadonlyMap<string, ReadonlySet<string>>
  topicIdsByCertification?: ReadonlyMap<string, ReadonlySet<string>>
  validTagIds?: ReadonlySet<string>
}

/**
 * Builds a schema that validates the consistency between a question and
 * its related certification exam, domain and topic.
 *
 * The base `questionBanksSchema` only checks shape and uniqueness. This
 * schema adds cross-reference validation equivalent to foreign-key checks
 * in a server-side persistence layer.
 */
export function createQuestionBanksSchema(
  certificationExamIds: Iterable<string>,
  options: CreateQuestionBanksSchemaOptions = {},
) {
  const ids = new Set(certificationExamIds)
  const {
    domainIdsByCertification = new Map(),
    topicIdsByCertification = new Map(),
    validTagIds,
  } = options

  return questionBanksSchema.superRefine((questions, ctx) => {
    questions.forEach((question, i) => {
      if (!ids.has(question.certificationExamId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `certificationExamId "${question.certificationExamId}" does not exist`,
          path: [i, 'certificationExamId'],
        })
      }

      if (question.examDomainId) {
        const allowedDomains = domainIdsByCertification.get(question.certificationExamId)
        if (!allowedDomains || !allowedDomains.has(question.examDomainId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `examDomainId "${question.examDomainId}" does not belong to certification "${question.certificationExamId}"`,
            path: [i, 'examDomainId'],
          })
        }
      }

      if (question.topicId) {
        const allowedTopics = topicIdsByCertification.get(question.certificationExamId)
        if (!allowedTopics || !allowedTopics.has(question.topicId)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `topicId "${question.topicId}" does not belong to certification "${question.certificationExamId}"`,
            path: [i, 'topicId'],
          })
        }
      }

      if (validTagIds) {
        question.tagIds.forEach((tagId, tagIndex) => {
          if (!validTagIds.has(tagId)) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `tagId "${tagId}" does not exist`,
              path: [i, 'tagIds', tagIndex],
            })
          }
        })
      }
    })
  })
}
