import { describe, it, expect } from 'vitest'
import {
  updateQuestionCommandSchema,
  createUpdateQuestionCommandSchema,
} from './updateQuestionCommandSchema'
import { QuestionTypeValues, QuestionDifficultyValues } from '@/models/QuestionBank'

const validCommand = {
  certificationExamId: 'saa-c03',
  statement: 'What is the capital of France?',
  explanation: 'Paris is the capital of France.',
  type: QuestionTypeValues.SingleChoice,
  difficulty: QuestionDifficultyValues.Easy,
  options: [
    { text: 'Paris', isCorrect: true },
    { text: 'London', isCorrect: false },
  ],
}

describe('updateQuestionCommandSchema', () => {
  it('validates a complete update command', () => {
    const result = updateQuestionCommandSchema.safeParse(validCommand)
    expect(result.success).toBe(true)
  })

  it('validates a command with an optional id', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      id: 'q-123',
    })
    expect(result.success).toBe(true)
  })

  it('rejects an empty statement', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      statement: '   ',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid question type', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      type: 'unknown',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid difficulty', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      difficulty: 'extreme',
    })
    expect(result.success).toBe(false)
  })

  it('rejects fewer than two options', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [{ text: 'Paris', isCorrect: true }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects duplicate options after normalization', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: '  paris ', isCorrect: false },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a single choice question without exactly one correct answer', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'London', isCorrect: true },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('validates a multiple choice command with at least two correct and one incorrect', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      type: QuestionTypeValues.MultipleChoice,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'Lyon', isCorrect: true },
        { text: 'London', isCorrect: false },
      ],
    })
    expect(result.success).toBe(true)
  })

  it('rejects a multiple choice command with all correct answers', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      type: QuestionTypeValues.MultipleChoice,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'Lyon', isCorrect: true },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('defaults language to "en" when omitted', () => {
    const result = updateQuestionCommandSchema.safeParse({
      ...validCommand,
      language: undefined,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.language).toBe('en')
    }
  })
})

describe('createUpdateQuestionCommandSchema', () => {
  it('validates a command with existing certification and topic', () => {
    const schema = createUpdateQuestionCommandSchema({
      certificationExamIds: new Set(['saa-c03']),
      topicIdsByCertification: new Map([['saa-c03', new Set(['Compute'])]]),
    })
    const result = schema.safeParse({ ...validCommand, topicId: 'Compute' })
    expect(result.success).toBe(true)
  })

  it('rejects an unknown certification', () => {
    const schema = createUpdateQuestionCommandSchema({
      certificationExamIds: new Set(['other-cert']),
    })
    const result = schema.safeParse(validCommand)
    expect(result.success).toBe(false)
  })

  it('rejects a domain that does not belong to the selected certification', () => {
    const schema = createUpdateQuestionCommandSchema({
      certificationExamIds: new Set(['saa-c03']),
      domainIdsByCertification: new Map([['other-cert', new Set(['domain-1'])]]),
    })
    const result = schema.safeParse({
      ...validCommand,
      examDomainId: 'domain-1',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a topic that does not belong to the selected certification', () => {
    const schema = createUpdateQuestionCommandSchema({
      certificationExamIds: new Set(['saa-c03']),
      topicIdsByCertification: new Map([['other-cert', new Set(['topic-1'])]]),
    })
    const result = schema.safeParse({
      ...validCommand,
      topicId: 'topic-1',
    })
    expect(result.success).toBe(false)
  })
})
