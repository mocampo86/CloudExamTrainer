import { describe, it, expect } from 'vitest'
import { createAttemptResult, filterAttemptResultsByCertification } from './resultService'
import { DEFAULT_CERTIFICATION_EXAM_ID } from './questionService'
import type { QuizSession } from '@/models/QuizSession'

const validSession: QuizSession = {
  id: 'test-session',
  topic: 'Security',
  certificationExamId: DEFAULT_CERTIFICATION_EXAM_ID,
  questionIds: ['sec001', 'sec002'],
  currentIndex: 1,
  answers: {
    sec001: ['opt2'],
    sec002: ['opt1'],
  },
  status: 'completed',
  startedAt: '2026-07-26T00:00:00.000Z',
  finishedAt: '2026-07-26T00:05:00.000Z',
}

describe('resultService', () => {
  it('creates an attempt result associated with the session certification', async () => {
    const attempt = await createAttemptResult(validSession)

    expect(attempt.id).toBe(validSession.id)
    expect(attempt.session).toEqual(validSession)
    expect(attempt.certification.id).toBe(DEFAULT_CERTIFICATION_EXAM_ID)
    expect(attempt.certification.name).toBe('AWS Certified Solutions Architect - Associate')
    expect(attempt.certification.provider.name).toBe('Amazon Web Services')
    expect(attempt.result.totalQuestions).toBe(2)
    expect(attempt.topicResults).toHaveLength(1)
    expect(attempt.recommendations.length).toBeGreaterThan(0)
  })

  it('rejects a result when the session has no certification identifier', async () => {
    const invalidSession = { ...validSession, certificationExamId: '' }
    await expect(createAttemptResult(invalidSession)).rejects.toThrow('Session does not have a certification identifier')
  })

  it('rejects a result when the certification does not exist', async () => {
    const invalidSession = { ...validSession, certificationExamId: 'unknown-cert' }
    await expect(createAttemptResult(invalidSession)).rejects.toThrow('Certification not found or inactive')
  })

  it('filters attempt results by certification', async () => {
    const attempt = await createAttemptResult(validSession)
    const otherAttempt = {
      ...attempt,
      id: 'other',
      certification: { ...attempt.certification, id: 'other-cert' },
    }

    const filtered = filterAttemptResultsByCertification([attempt, otherAttempt], DEFAULT_CERTIFICATION_EXAM_ID)
    expect(filtered).toHaveLength(1)
    expect(filtered[0].id).toBe(attempt.id)
  })
})
