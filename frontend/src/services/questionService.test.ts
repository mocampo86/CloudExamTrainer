import { describe, it, expect } from 'vitest'
import { getAllQuestions, getQuestionsByTopic, getRandomQuestions } from './questionService'

describe('questionService', () => {
  it('loads all questions', () => {
    const questions = getAllQuestions()
    expect(questions.length).toBeGreaterThan(0)
  })

  it('returns questions filtered by topic', () => {
    const securityQuestions = getQuestionsByTopic('Security')
    expect(securityQuestions.every((q) => q.topic === 'Security')).toBe(true)
  })

  it('returns an empty array for a topic with no questions', () => {
    expect(getQuestionsByTopic('Unknown')).toEqual([])
  })

  it('returns the requested number of random questions', () => {
    const selected = getRandomQuestions(3)
    expect(selected).toHaveLength(3)
    expect(new Set(selected.map((q) => q.id)).size).toBe(3)
  })

  it('returns random questions for a specific topic', () => {
    const selected = getRandomQuestions(2, 'Security')
    expect(selected).toHaveLength(2)
    expect(selected.every((q) => q.topic === 'Security')).toBe(true)
    expect(new Set(selected.map((q) => q.id)).size).toBe(2)
  })

  it('does not modify the original pool when selecting random questions', () => {
    const before = getAllQuestions().map((q) => q.id)
    getRandomQuestions(2)
    const after = getAllQuestions().map((q) => q.id)
    expect(after).toEqual(before)
  })

  it('throws when the requested count exceeds the available questions', () => {
    expect(() => getRandomQuestions(1000)).toThrow()
  })

  it('throws when the requested count exceeds the available questions for a topic', () => {
    expect(() => getRandomQuestions(5, 'Security')).toThrow()
  })
})
