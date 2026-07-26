import { z } from 'zod'
import { questionSchema, questionsSchema } from '../schemas/questionSchema'

export interface ValidationResult {
  valid: boolean
  errors: string[]
}

function getQuestionId(questions: unknown, index: number): string | undefined {
  if (!Array.isArray(questions)) return undefined
  const q = questions[index]
  if (q && typeof q === 'object' && !Array.isArray(q)) {
    const id = (q as Record<string, unknown>).id
    if (typeof id === 'string') return id
  }
  return undefined
}

function formatPath(path: (string | number)[]): string {
  return path
    .map((part) => (typeof part === 'number' ? `[${part}]` : `.${part}`))
    .join('')
    .replace(/^\./, '')
}

function formatIssues(
  issues: z.ZodIssue[],
  questions: unknown,
  prefix = 'question',
): string[] {
  return issues.map((issue) => {
    const index = typeof issue.path[0] === 'number' ? issue.path[0] : undefined
    const rest = index !== undefined ? issue.path.slice(1) : issue.path
    const id = index !== undefined ? getQuestionId(questions, index) : undefined
    const label =
      index !== undefined
        ? `${prefix}[${index}]${id ? ` (id="${id}")` : ''}`
        : prefix
    const path = formatPath(rest)
    return path ? `${label} at ${path}: ${issue.message}` : `${label}: ${issue.message}`
  })
}

export function validateQuestion(question: unknown, index?: number): string[] {
  const result = questionSchema.safeParse(question)
  if (result.success) return []

  const id =
    question && typeof question === 'object' && !Array.isArray(question)
      ? (question as Record<string, unknown>).id
      : undefined

  const label =
    index !== undefined
      ? `question[${index}]${typeof id === 'string' ? ` (id="${id}")` : ''}`
      : 'question'

  return result.error.issues.map((issue) => {
    const path = formatPath(issue.path)
    return path ? `${label} at ${path}: ${issue.message}` : `${label}: ${issue.message}`
  })
}

export function validateQuestions(questions: unknown): ValidationResult {
  if (!Array.isArray(questions)) {
    return { valid: false, errors: ['questions must be an array'] }
  }

  const result = questionsSchema.safeParse(questions)
  if (result.success) {
    return { valid: true, errors: [] }
  }

  return { valid: false, errors: formatIssues(result.error.issues, questions) }
}
