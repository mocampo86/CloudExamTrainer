import type { Question } from '@/models/Question'
import { validateQuestions } from '@/utils/questionValidation'
import rawQuestions from '@/data/questions'

export class QuestionValidationError extends Error {
  readonly errors: string[]

  constructor(message: string, errors: string[]) {
    super(message)
    this.name = 'QuestionValidationError'
    this.errors = errors
  }
}

function loadAndValidate(data: unknown, source?: string): Question[] {
  const result = validateQuestions(data, source)
  if (!result.valid) {
    throw new QuestionValidationError(
      `Failed to load questions${source ? ` from ${source}` : ''}`,
      result.errors,
    )
  }
  return data as Question[]
}

const loadedQuestions = loadAndValidate(rawQuestions, 'src/data/questions/index.ts')

export function getAllQuestions(): Question[] {
  return [...loadedQuestions]
}

export function getQuestionsByTopic(topic: string): Question[] {
  return loadedQuestions.filter((question) => question.topic === topic)
}

export function getRandomQuestions(count: number, topic?: string): Question[] {
  const pool = topic ? getQuestionsByTopic(topic) : [...loadedQuestions]

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
