import { describe, it, expect } from 'vitest'
import type { Question } from '@/models/Question'
import { calculateQuizResult } from './scoringService'

const singleChoiceQuestion: Question = {
  id: 'q1',
  topic: 'Security',
  difficulty: 'easy',
  type: 'single_choice',
  question: 'Single?',
  options: [{ id: 'a', text: 'A' }, { id: 'b', text: 'B' }],
  correctAnswers: ['a'],
  explanation: '',
}

const multipleChoiceQuestion: Question = {
  id: 'q2',
  topic: 'Compute',
  difficulty: 'medium',
  type: 'multiple_choice',
  question: 'Multiple?',
  options: [
    { id: 'a', text: 'A' },
    { id: 'b', text: 'B' },
    { id: 'c', text: 'C' },
  ],
  correctAnswers: ['a', 'b'],
  explanation: '',
}

describe('scoringService', () => {
  it('returns zero counts when there are no questions', () => {
    const result = calculateQuizResult([], {})
    expect(result).toEqual({ correctCount: 0, incorrectCount: 0, percentage: 0, totalQuestions: 0 })
  })

  it('counts a correct single choice answer', () => {
    const result = calculateQuizResult([singleChoiceQuestion], { q1: ['a'] })
    expect(result.correctCount).toBe(1)
    expect(result.incorrectCount).toBe(0)
    expect(result.percentage).toBe(100)
  })

  it('counts an incorrect single choice answer', () => {
    const result = calculateQuizResult([singleChoiceQuestion], { q1: ['b'] })
    expect(result.correctCount).toBe(0)
    expect(result.incorrectCount).toBe(1)
    expect(result.percentage).toBe(0)
  })

  it('counts an unanswered question as incorrect', () => {
    const result = calculateQuizResult([singleChoiceQuestion], {})
    expect(result.correctCount).toBe(0)
    expect(result.incorrectCount).toBe(1)
    expect(result.percentage).toBe(0)
  })

  it('counts a correct multiple choice answer when order differs', () => {
    const result = calculateQuizResult([multipleChoiceQuestion], { q2: ['b', 'a'] })
    expect(result.correctCount).toBe(1)
    expect(result.incorrectCount).toBe(0)
    expect(result.percentage).toBe(100)
  })

  it('counts a multiple choice answer as incorrect when selection does not match exactly', () => {
    const result = calculateQuizResult([multipleChoiceQuestion], { q2: ['a'] })
    expect(result.correctCount).toBe(0)
    expect(result.incorrectCount).toBe(1)
    expect(result.percentage).toBe(0)
  })

  it('counts a multiple choice answer as incorrect when extra options are selected', () => {
    const result = calculateQuizResult([multipleChoiceQuestion], { q2: ['a', 'b', 'c'] })
    expect(result.correctCount).toBe(0)
    expect(result.incorrectCount).toBe(1)
    expect(result.percentage).toBe(0)
  })

  it('calculates totals and percentage for a mixed set of answers', () => {
    const result = calculateQuizResult(
      [singleChoiceQuestion, multipleChoiceQuestion],
      { q1: ['a'], q2: ['a', 'c'] },
    )
    expect(result.correctCount).toBe(1)
    expect(result.incorrectCount).toBe(1)
    expect(result.percentage).toBe(50)
  })
})
