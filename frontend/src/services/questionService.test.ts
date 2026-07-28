import { describe, it, expect } from 'vitest'
import {
  getAllQuestions,
  getQuestionsByTopic,
  getRandomQuestions,
  getTopics,
  getQuestionCountByTopic,
  getQuestionById,
  createQuizSession,
  startQuizSession,
  DEFAULT_CERTIFICATION_EXAM_ID,
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
    const session = createQuizSession({ topic: 'Security', count: 2, certificationExamId: DEFAULT_CERTIFICATION_EXAM_ID })
    expect(session.topic).toBe('Security')
    expect(session.certificationExamId).toBe(DEFAULT_CERTIFICATION_EXAM_ID)
    expect(session.questionIds).toHaveLength(2)
    expect(session.currentIndex).toBe(0)
    expect(session.status).toBe('in_progress')
    expect(session.answers).toEqual({})
  })

  it('starts a quiz session for a valid certification and topic', async () => {
    const response = await startQuizSession({
      certificationExamId: DEFAULT_CERTIFICATION_EXAM_ID,
      topic: 'Security',
      count: 2,
    })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.topic).toBe('Security')
    expect(response.body.certificationExamId).toBe(DEFAULT_CERTIFICATION_EXAM_ID)
    expect(response.body.questionIds).toHaveLength(2)
  })

  it('starts a quiz session without a topic using questions from the certification', async () => {
    const response = await startQuizSession({
      certificationExamId: DEFAULT_CERTIFICATION_EXAM_ID,
      count: 3,
    })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.certificationExamId).toBe(DEFAULT_CERTIFICATION_EXAM_ID)
    expect(response.body.questionIds).toHaveLength(3)
  })

  it('rejects a quiz session for a missing certification', async () => {
    const response = await startQuizSession({ certificationExamId: '', topic: 'Security', count: 2 })
    expect(response.status).toBe(400)
  })

  it('rejects a quiz session for a non-existent certification', async () => {
    const response = await startQuizSession({
      certificationExamId: 'non-existent-cert',
      topic: 'Security',
      count: 2,
    })
    expect(response.status).toBe(404)
  })

  it('rejects a quiz session when the topic does not belong to the certification', async () => {
    const response = await startQuizSession({
      certificationExamId: DEFAULT_CERTIFICATION_EXAM_ID,
      topic: 'Invalid Topic',
      count: 2,
    })
    expect(response.status).toBe(422)
  })

  it('rejects a quiz session when there are not enough questions', async () => {
    const response = await startQuizSession({
      certificationExamId: DEFAULT_CERTIFICATION_EXAM_ID,
      topic: 'Security',
      count: 1000,
    })
    expect(response.status).toBe(500)
  })

  it('returns questions that belong to the selected certification', async () => {
    const response = await startQuizSession({
      certificationExamId: DEFAULT_CERTIFICATION_EXAM_ID,
      topic: 'Security',
      count: 2,
    })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    const allQuestions = getAllQuestions()
    const selectedQuestions = response.body.questionIds.map((id) =>
      allQuestions.find((q) => q.id === id),
    )
    expect(selectedQuestions.every((q) => q?.certificationExamId === DEFAULT_CERTIFICATION_EXAM_ID)).toBe(true)
    expect(selectedQuestions.every((q) => q?.topic === 'Security')).toBe(true)
  })

  it('filters questions by certification exam id', () => {
    const questions = getAllQuestions()
    expect(questions.every((q) => q.certificationExamId === DEFAULT_CERTIFICATION_EXAM_ID)).toBe(true)

    const filtered = getQuestionsByTopic('Security', DEFAULT_CERTIFICATION_EXAM_ID)
    expect(filtered.every((q) => q.certificationExamId === DEFAULT_CERTIFICATION_EXAM_ID && q.topic === 'Security')).toBe(true)
  })

  it('returns empty results for an unknown certification exam id', () => {
    expect(getAllQuestions().filter((q) => q.certificationExamId === 'unknown-cert')).toEqual([])
    expect(getTopics('unknown-cert')).toEqual([])
    expect(getQuestionCountByTopic('Security', 'unknown-cert')).toBe(0)
    expect(getQuestionById('sec001', 'unknown-cert')).toBeUndefined()
  })

  it('returns random questions filtered by certification exam id', () => {
    const selected = getRandomQuestions(2, 'Security', DEFAULT_CERTIFICATION_EXAM_ID)
    expect(selected).toHaveLength(2)
    expect(selected.every((q) => q.certificationExamId === DEFAULT_CERTIFICATION_EXAM_ID && q.topic === 'Security')).toBe(true)
  })

  it('finds a question by id filtered by certification exam id', () => {
    const question = getQuestionById('sec001', DEFAULT_CERTIFICATION_EXAM_ID)
    expect(question).toBeDefined()
    expect(question?.certificationExamId).toBe(DEFAULT_CERTIFICATION_EXAM_ID)
  })
})
