import { describe, it, expect } from 'vitest'
import {
  createQuestionCommandSchema,
  createCreateQuestionCommandSchema,
} from './createQuestionCommandSchema'
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

describe('createQuestionCommandSchema', () => {
  it('validates a complete single choice question command', () => {
    const result = createQuestionCommandSchema.safeParse(validCommand)
    expect(result.success).toBe(true)
  })

  it('validates a complete multiple choice question command', () => {
    const result = createQuestionCommandSchema.safeParse({
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

  it('rejects a missing certification exam id', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      certificationExamId: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an empty statement', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      statement: '',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a statement containing only whitespace', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      statement: '   ',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a statement exceeding the maximum length', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      statement: 'a'.repeat(5001),
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid question type', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      type: 'open_ended',
    })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid difficulty', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      difficulty: 'very_hard',
    })
    expect(result.success).toBe(false)
  })

  it('rejects fewer than two options', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [{ text: 'Paris', isCorrect: true }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects an option with empty text', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: '', isCorrect: false },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects duplicate option texts after normalization', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: '  paris ', isCorrect: false },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a single choice question with no correct answer', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [
        { text: 'Paris', isCorrect: false },
        { text: 'London', isCorrect: false },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a single choice question with more than one correct answer', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'London', isCorrect: true },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a multiple choice question with fewer than two correct answers', () => {
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      type: QuestionTypeValues.MultipleChoice,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'London', isCorrect: false },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a multiple choice question where all options are correct', () => {
    const result = createQuestionCommandSchema.safeParse({
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
    const result = createQuestionCommandSchema.safeParse({
      ...validCommand,
      language: undefined,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.language).toBe('en')
    }
  })
})

describe('createCreateQuestionCommandSchema', () => {
  it('validates a command that references an existing certification', () => {
    const schema = createCreateQuestionCommandSchema({
      certificationExamIds: new Set(['saa-c03']),
    })
    const result = schema.safeParse(validCommand)
    expect(result.success).toBe(true)
  })

  it('rejects a command linked to an unknown certification', () => {
    const schema = createCreateQuestionCommandSchema({
      certificationExamIds: new Set(['other-cert']),
    })
    const result = schema.safeParse(validCommand)
    expect(result.success).toBe(false)
  })

  it('rejects a domain that does not belong to the selected certification', () => {
    const schema = createCreateQuestionCommandSchema({
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
    const schema = createCreateQuestionCommandSchema({
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
