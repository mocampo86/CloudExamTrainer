export interface ValidationResult {
  valid: boolean
  errors: string[]
}

const DIFFICULTIES = ['easy', 'medium', 'hard'] as const
const TYPES = ['single_choice', 'multiple_choice'] as const

export function validateQuestion(question: unknown, index?: number): string[] {
  const prefix = index !== undefined ? `question[${index}]: ` : ''
  const errors: string[] = []

  if (typeof question !== 'object' || question === null) {
    errors.push(`${prefix}must be an object`)
    return errors
  }

  const q = question as Record<string, unknown>

  const requiredStrings = ['id', 'topic', 'difficulty', 'type', 'question', 'explanation']
  for (const key of requiredStrings) {
    if (typeof q[key] !== 'string' || (q[key] as string).trim() === '') {
      errors.push(`${prefix}${key} must be a non-empty string`)
    }
  }

  if (!DIFFICULTIES.includes(q.difficulty as typeof DIFFICULTIES[number])) {
    errors.push(`${prefix}difficulty must be one of ${DIFFICULTIES.join(', ')}`)
  }

  if (!TYPES.includes(q.type as typeof TYPES[number])) {
    errors.push(`${prefix}type must be one of ${TYPES.join(', ')}`)
  }

  if (!Array.isArray(q.options) || q.options.length < 2) {
    errors.push(`${prefix}options must be an array with at least 2 items`)
  } else {
    const optionIds: string[] = []

    for (let i = 0; i < q.options.length; i++) {
      const opt = q.options[i]
      if (typeof opt !== 'object' || opt === null) {
        errors.push(`${prefix}options[${i}] must be an object`)
        continue
      }

      const option = opt as Record<string, unknown>

      if (typeof option.id !== 'string' || option.id.trim() === '') {
        errors.push(`${prefix}options[${i}].id must be a non-empty string`)
      } else if (optionIds.includes(option.id)) {
        errors.push(`${prefix}options[${i}].id "${option.id}" is duplicated`)
      } else {
        optionIds.push(option.id)
      }

      if (typeof option.text !== 'string' || option.text.trim() === '') {
        errors.push(`${prefix}options[${i}].text must be a non-empty string`)
      }
    }

    if (!Array.isArray(q.correctAnswers) || q.correctAnswers.length === 0) {
      errors.push(`${prefix}correctAnswers must be a non-empty array`)
    } else {
      const type = q.type as typeof TYPES[number]
      const correctCount = q.correctAnswers.length

      if (type === 'single_choice' && correctCount !== 1) {
        errors.push(`${prefix}single_choice must have exactly one correct answer`)
      }

      if (type === 'multiple_choice' && correctCount < 2) {
        errors.push(`${prefix}multiple_choice must have at least two correct answers`)
      }

      for (let i = 0; i < q.correctAnswers.length; i++) {
        const answer = q.correctAnswers[i]
        if (typeof answer !== 'string') {
          errors.push(`${prefix}correctAnswers[${i}] must be a string`)
        } else if (!optionIds.includes(answer)) {
          errors.push(`${prefix}correctAnswers[${i}] references unknown option id "${answer}"`)
        }
      }
    }
  }

  return errors
}

export function validateQuestions(questions: unknown, source?: string): ValidationResult {
  const errors: string[] = []

  if (!Array.isArray(questions)) {
    errors.push(`${source ? `${source}: ` : ''}questions must be an array`)
    return { valid: false, errors }
  }

  const ids = new Set<string>()

  for (let i = 0; i < questions.length; i++) {
    const questionErrors = validateQuestion(questions[i], i)
    errors.push(...questionErrors)

    const q = questions[i] as Record<string, unknown>
    if (typeof q?.id === 'string') {
      if (ids.has(q.id)) {
        errors.push(`${source ? `${source}: ` : ''}duplicate question id "${q.id}"`)
      }
      ids.add(q.id)
    }
  }

  return { valid: errors.length === 0, errors }
}
