import type { Question } from '@/models/Question'
import type { QuizSession } from '@/models/QuizSession'
import { createQuizSession as buildQuizSession } from '@/models/QuizSession'
import { getCertificationById } from '@/services/certificationService'
import { migrateQuestionBankToLegacy } from '@/services/questionBankMigration'
import { questionBanksSchema } from '@/schemas/questionBankSchema'
import rawQuestionBanks from '@/data/questionBanks'

export const DEFAULT_CERTIFICATION_EXAM_ID = 'saa-c03'

export class QuestionValidationError extends Error {
  readonly errors: string[]

  constructor(message: string, errors: string[]) {
    super(message)
    this.name = 'QuestionValidationError'
    this.errors = errors
  }
}

function loadAndValidate(data: unknown, source?: string): Question[] {
  const result = questionBanksSchema.safeParse(data)
  if (!result.success) {
    throw new QuestionValidationError(
      `Failed to load question banks${source ? ` from ${source}` : ''}`,
      result.error.issues.map((issue) => issue.message),
    )
  }
  return result.data.map(migrateQuestionBankToLegacy)
}

const loadedQuestions = loadAndValidate(rawQuestionBanks, 'src/data/questionBanks/index.ts')

function filterByCertification(questions: Question[], certificationExamId?: string): Question[] {
  if (certificationExamId === undefined) return questions
  return questions.filter((question) => question.certificationExamId === certificationExamId)
}

export function getAllQuestions(): Question[] {
  return [...loadedQuestions]
}

export function getQuestionsByTopic(
  topic: string,
  certificationExamId: string = DEFAULT_CERTIFICATION_EXAM_ID,
): Question[] {
  return filterByCertification(loadedQuestions, certificationExamId).filter(
    (question) => question.topic === topic,
  )
}

export function getRandomQuestions(
  count: number,
  topic?: string,
  certificationExamId: string = DEFAULT_CERTIFICATION_EXAM_ID,
): Question[] {
  const basePool = filterByCertification([...loadedQuestions], certificationExamId)
  const pool = topic ? basePool.filter((question) => question.topic === topic) : basePool

  if (count > pool.length) {
    throw new Error(
      `Requested ${count} questions but only ${pool.length} are available${topic ? ` for topic "${topic}"` : ''}`,
    )
  }

  if (count <= 0) {
    throw new Error('Requested count must be greater than 0')
  }

  const shuffled = [...pool]

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = shuffled[i]
    shuffled[i] = shuffled[j]
    shuffled[j] = temp
  }

  return shuffled.slice(0, count)
}

export function getTopics(certificationExamId: string = DEFAULT_CERTIFICATION_EXAM_ID): string[] {
  const topics = new Set(
    filterByCertification(loadedQuestions, certificationExamId).map((question) => question.topic),
  )
  return [...topics].sort((a, b) => a.localeCompare(b))
}

export function getQuestionCountByTopic(
  topic: string,
  certificationExamId: string = DEFAULT_CERTIFICATION_EXAM_ID,
): number {
  return getQuestionsByTopic(topic, certificationExamId).length
}

export function getQuestionById(
  id: string,
  certificationExamId?: string,
): Question | undefined {
  return filterByCertification(loadedQuestions, certificationExamId).find((question) => question.id === id)
}

export type QuizSessionResponse =
  | { status: 200; body: QuizSession }
  | { status: 400; body: { error: string } }
  | { status: 404; body: { error: string } }
  | { status: 422; body: { error: string } }
  | { status: 500; body: { error: string } }

export function createQuizSession(config: {
  topic: string
  count: number
  certificationExamId: string
}): QuizSession {
  const questions = getRandomQuestions(config.count, config.topic, config.certificationExamId)
  return buildQuizSession(config.topic, questions.map((question) => question.id), config.certificationExamId)
}

function isValidIdentifier(value: string): boolean {
  return value.trim().length > 0
}

/**
 * Starts a quiz session for a specific certification and optional topic.
 *
 * Validates that the certification exists and is active, that the topic
 * belongs to the certification when provided, and that enough questions are
 * available before creating the session.
 */
export async function startQuizSession(config: {
  certificationExamId: string
  topic?: string
  count: number
}): Promise<QuizSessionResponse> {
  if (!isValidIdentifier(config.certificationExamId)) {
    return { status: 400, body: { error: 'Certification identifier is required' } }
  }

  try {
    const certification = await getCertificationById(config.certificationExamId)
    if (!certification) {
      return { status: 404, body: { error: 'Certification not found or inactive' } }
    }

    const topic = config.topic?.trim() || undefined

    if (topic) {
      const allowedTopics = getTopics(config.certificationExamId)
      if (!allowedTopics.includes(topic)) {
        return {
          status: 422,
          body: { error: `Topic "${topic}" does not belong to the selected certification` },
        }
      }
    }

    const questions = getRandomQuestions(
      config.count,
      topic,
      config.certificationExamId,
    )
    const session = buildQuizSession(
      topic ?? '',
      questions.map((question) => question.id),
      config.certificationExamId,
    )
    return { status: 200, body: session }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to start quiz session'
    return { status: 500, body: { error: message } }
  }
}
