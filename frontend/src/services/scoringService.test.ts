import { describe, it, expect } from 'vitest'
import type { Question } from '@/models/Question'
import { calculateQuizResult, calculateTopicResults } from './scoringService'

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

describe('calculateTopicResults', () => {
  it('returns an empty array when there are no questions', () => {
    const result = calculateTopicResults([], {})
    expect(result).toEqual([])
  })

  it('groups answers by topic and calculates accuracy', () => {
    const questions: Question[] = [
      { ...singleChoiceQuestion, topic: 'Security' },
      { ...multipleChoiceQuestion, topic: 'Security' },
    ]
    const result = calculateTopicResults(questions, { q1: ['a'], q2: ['a', 'b'] })
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      topic: 'Security',
      correctCount: 2,
      totalQuestions: 2,
      percentage: 100,
      classification: 'mastered',
    })
  })

  it('calculates accuracy separately for each topic', () => {
    const questions: Question[] = [
      { ...singleChoiceQuestion, topic: 'Security' },
      { ...multipleChoiceQuestion, topic: 'Compute' },
    ]
    const result = calculateTopicResults(questions, { q1: ['a'], q2: ['a', 'c'] })
    expect(result).toEqual([
      {
        topic: 'Compute',
        correctCount: 0,
        totalQuestions: 1,
        percentage: 0,
        classification: 'high_attention',
      },
      {
        topic: 'Security',
        correctCount: 1,
        totalQuestions: 1,
        percentage: 100,
        classification: 'mastered',
      },
    ])
  })

  it('classifies topics based on percentage thresholds', () => {
    const questions: Question[] = [
      { ...singleChoiceQuestion, id: 'q1', topic: 'A' },
      { ...singleChoiceQuestion, id: 'q2', topic: 'B' },
      { ...singleChoiceQuestion, id: 'q3', topic: 'C' },
      { ...singleChoiceQuestion, id: 'q4', topic: 'D' },
    ]
    const answers = { q1: ['b'], q2: ['b'], q3: ['b'], q4: ['a'] }
    const result = calculateTopicResults(questions, answers)
    expect(result).toEqual([
      expect.objectContaining({ topic: 'A', percentage: 0, classification: 'high_attention' }),
      expect.objectContaining({ topic: 'B', percentage: 0, classification: 'high_attention' }),
      expect.objectContaining({ topic: 'C', percentage: 0, classification: 'high_attention' }),
      expect.objectContaining({ topic: 'D', percentage: 100, classification: 'mastered' }),
    ])
  })

  it('sorts topics from worst to best percentage', () => {
    const questions: Question[] = [
      { ...singleChoiceQuestion, id: 'q1', topic: 'High' },
      { ...singleChoiceQuestion, id: 'q2', topic: 'Mid' },
      { ...singleChoiceQuestion, id: 'q3', topic: 'Low' },
      { ...singleChoiceQuestion, id: 'q4', topic: 'High' },
      { ...singleChoiceQuestion, id: 'q5', topic: 'Mid' },
      { ...singleChoiceQuestion, id: 'q6', topic: 'Low' },
    ]
    const answers = { q1: ['a'], q2: ['b'], q3: ['b'], q4: ['a'], q5: ['a'], q6: ['a'] }
    const result = calculateTopicResults(questions, answers)
    expect(result.map((r) => r.topic)).toEqual(['Low', 'Mid', 'High'])
    expect(result.map((r) => r.percentage)).toEqual([50, 50, 100])
  })
})
