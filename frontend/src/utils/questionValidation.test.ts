import { describe, it, expect } from 'vitest'
import { validateQuestion, validateQuestions } from './questionValidation'
import validQuestions from '@/schemas/__fixtures__/valid-questions.json'
import invalidQuestions from '@/schemas/__fixtures__/invalid-questions.json'

const baseQuestion = {
  id: 'q001',
  certificationExamId: 'saa-c03',
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

  it('validates a valid fixture file', () => {
    expect(validateQuestions(validQuestions).valid).toBe(true)
    expect(validateQuestions(validQuestions).errors).toEqual([])
  })

  it('rejects an invalid fixture file', () => {
    const result = validateQuestions(invalidQuestions)
    expect(result.valid).toBe(false)
    expect(result.errors.length).toBeGreaterThan(0)
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
    expect(validateQuestion(question).some((error) => error.includes('single_choice must have exactly one correct answer'))).toBe(true)
  })

  it('detects a multiple_choice question with less than two correct answers', () => {
    const question = { ...baseQuestion, type: 'multiple_choice' as const, correctAnswers: ['a'] }
    expect(validateQuestion(question).some((error) => error.includes('multiple_choice must have at least two correct answers'))).toBe(true)
  })

  it('detects correctAnswers that reference unknown option ids', () => {
    const question = { ...baseQuestion, correctAnswers: ['c'] }
    expect(validateQuestion(question).some((error) => error.includes('correctAnswers[0] references unknown option id "c"'))).toBe(true)
  })

  it('detects duplicate option ids', () => {
    const question = {
      ...baseQuestion,
      options: [
        { id: 'a', text: 'Option A' },
        { id: 'a', text: 'Option B' },
      ],
    }
    expect(validateQuestion(question).some((error) => error.includes('options[1].id "a" is duplicated'))).toBe(true)
  })

  it('detects duplicate question ids', () => {
    const result = validateQuestions([baseQuestion, baseQuestion])
    expect(result.valid).toBe(false)
    expect(result.errors.some((error) => error.includes('duplicate question id'))).toBe(true)
  })

  it('rejects a question with fewer than two options', () => {
    const question = { ...baseQuestion, options: [{ id: 'a', text: 'Only' }] }
    const errors = validateQuestion(question)
    expect(errors.some((error) => error.includes('options') && error.includes('at least 2'))).toBe(true)
  })

  it('rejects an invalid difficulty value', () => {
    const question = { ...baseQuestion, difficulty: 'impossible' }
    const errors = validateQuestion(question)
    expect(errors.some((error) => error.includes('difficulty') && error.includes('enum'))).toBe(true)
  })

  it('rejects an invalid question type', () => {
    const question = { ...baseQuestion, type: 'open_ended' }
    const errors = validateQuestion(question)
    expect(errors.some((error) => error.includes('type') && error.includes('enum'))).toBe(true)
  })

  it('rejects a question without certificationExamId', () => {
    const withoutCert = { ...baseQuestion }
    delete (withoutCert as Partial<typeof withoutCert>).certificationExamId
    const errors = validateQuestion(withoutCert)
    expect(errors.some((error) => error.includes('certificationExamId'))).toBe(true)
  })
})
