import { describe, it, expect } from 'vitest'
import {
  getAllQuestions,
  getQuestionsByTopic,
  getRandomQuestions,
  getTopics,
  getQuestionCountByTopic,
  createQuizSession,
} from './questionService'

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

  it('returns the list of available topics sorted alphabetically', () => {
    const topics = getTopics()
    expect(topics.length).toBeGreaterThan(0)
    expect(topics).toEqual([...topics].sort((a, b) => a.localeCompare(b)))
    expect(new Set(topics).size).toBe(topics.length)
  })

  it('returns the number of questions for a topic', () => {
    expect(getQuestionCountByTopic('Security')).toBe(2)
    expect(getQuestionCountByTopic('Unknown')).toBe(0)
  })

  it('creates a quiz session with selected topic and question ids', () => {
    const session = createQuizSession({ topic: 'Security', count: 2 })
    expect(session.topic).toBe('Security')
    expect(session.questionIds).toHaveLength(2)
    expect(session.currentIndex).toBe(0)
    expect(session.status).toBe('in_progress')
    expect(session.answers).toEqual({})
  })
})
