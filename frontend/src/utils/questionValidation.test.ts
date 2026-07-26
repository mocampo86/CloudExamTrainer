import { describe, it, expect } from 'vitest'
import { validateQuestion, validateQuestions } from './questionValidation'

const baseQuestion = {
  id: 'q001',
  topic: 'Test',
  difficulty: 'easy',
  type: 'single_choice',
  question: 'What is the answer?',
  options: [
    { id: 'a', text: 'Option A' },
    { id: 'b', text: 'Option B' },
  ],
  correctAnswers: ['a'],
  explanation: 'Because A is correct.',
}

describe('questionValidation', () => {
  it('validates a correct question', () => {
    expect(validateQuestion(baseQuestion)).toEqual([])
  })

  it('returns errors for missing fields', () => {
    const result = validateQuestions([{}])
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
  })

  it('validates a correct list of questions', () => {
    const result = validateQuestions([baseQuestion])
    expect(result.valid).toBe(true)
    expect(result.errors).toEqual([])
  })

  it('detects a single_choice question with more than one correct answer', () => {
    const question = { ...baseQuestion, correctAnswers: ['a', 'b'] }
    expect(validateQuestion(question)).toContain('single_choice must have exactly one correct answer')
  })

  it('detects a multiple_choice question with less than two correct answers', () => {
    const question = { ...baseQuestion, type: 'multiple_choice' as const, correctAnswers: ['a'] }
    expect(validateQuestion(question)).toContain('multiple_choice must have at least two correct answers')
  })

  it('detects correctAnswers that reference unknown option ids', () => {
    const question = { ...baseQuestion, correctAnswers: ['c'] }
    expect(validateQuestion(question)).toContain('correctAnswers[0] references unknown option id "c"')
  })

  it('detects duplicate option ids', () => {
    const question = {
      ...baseQuestion,
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'a', text: 'Option B' },
      ],
    }
    expect(validateQuestion(question)).toContain('options[1].id "a" is duplicated')
  })

  it('detects duplicate question ids', () => {
    const result = validateQuestions([baseQuestion, baseQuestion])
    expect(result.valid).toBe(false)
    expect(result.errors.some((error) => error.includes('duplicate question id'))).toBe(true)
  })

  it('rejects a question with fewer than two options', () => {
    const question = { ...baseQuestion, options: [{ id: 'a', text: 'Only' }] }
    expect(validateQuestion(question)).toContain('options must be an array with at least 2 items')
  })

  it('rejects an invalid difficulty value', () => {
    const question = { ...baseQuestion, difficulty: 'impossible' }
    expect(validateQuestion(question)).toContain('difficulty must be one of easy, medium, hard')
  })

  it('rejects an invalid question type', () => {
    const question = { ...baseQuestion, type: 'open_ended' }
    expect(validateQuestion(question)).toContain('type must be one of single_choice, multiple_choice')
  })
})
