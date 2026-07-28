import { questionsSchema } from '../schemas/questionSchema'
import { questionBanksSchema } from '../schemas/questionBankSchema'
import { QuestionStatusValues } from '../models/QuestionBank'
import type { Question as LegacyQuestion } from '../models/Question'
import type { QuestionBank } from '../models/QuestionBank'
import type { AnswerOption } from '../models/AnswerOption'

/**
 * Current schema version for the question bank JSON data.
 */
export const QUESTION_BANK_VERSION = 2

/**
 * Stable timestamp used for all migrated questions in a single process.
 */
const MIGRATION_TIMESTAMP = new Date().toISOString()

function migrateLegacyQuestion(legacy: LegacyQuestion): QuestionBank {
  const options: AnswerOption[] = legacy.options.map((option, index) => ({
    id: option.id,
    questionId: legacy.id,
    text: option.text,
    isCorrect: legacy.correctAnswers.includes(option.id),
    displayOrder: index,
  }))

  return {
    id: legacy.id,
    certificationExamId: legacy.certificationExamId,
    topicId: legacy.topic,
    statement: legacy.question,
    explanation: legacy.explanation,
    type: legacy.type,
    difficulty: legacy.difficulty,
    status: QuestionStatusValues.Active,
    language: 'en',
    isActive: true,
    options,
    tagIds: [],
    references: [],
    createdAt: MIGRATION_TIMESTAMP,
    updatedAt: MIGRATION_TIMESTAMP,
  }
}

export type MigrationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: string[] }

/**
 * Migrates an array of legacy questions to the `QuestionBank` schema.
 *
 * The function is reproducible: given the same legacy input it always
 * produces the same output. It validates the legacy shape first, then
 * validates the migrated result against the new `QuestionBank` schema.
 */
export function migrateLegacyQuestionsToQuestionBank(
  legacyQuestions: unknown,
): MigrationResult<QuestionBank[]> {
  const parsed = questionsSchema.safeParse(legacyQuestions)

  if (!parsed.success) {
    return {
      success: false,
      errors: parsed.error.issues.map((issue) => issue.message),
    }
  }

  const migrated = parsed.data.map(migrateLegacyQuestion)
  const validated = questionBanksSchema.safeParse(migrated)

  if (!validated.success) {
    return {
      success: false,
      errors: validated.error.issues.map((issue) => issue.message),
    }
  }

  return { success: true, data: validated.data }
}

/**
 * Downgrades a `QuestionBank` question back to the legacy shape.
 *
 * This is a lossy transformation: extra fields such as `tagIds`,
 * `references`, `status` and `externalCode` are discarded. The topic
 * name is reconstructed from `topicId`, which may not be the original
 * display name.
 */
export function migrateQuestionBankToLegacy(question: QuestionBank): LegacyQuestion {
  return {
    id: question.id,
    certificationExamId: question.certificationExamId,
    topic: question.topicId ?? 'unknown',
    difficulty: question.difficulty,
    type: question.type,
    question: question.statement,
    options: question.options.map((option) => ({ id: option.id, text: option.text })),
    correctAnswers: question.options.filter((option) => option.isCorrect).map((option) => option.id),
    explanation: question.explanation ?? '',
  }
}
