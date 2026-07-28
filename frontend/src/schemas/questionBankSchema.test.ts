import { describe, it, expect } from 'vitest'
import { questionBankSchema, questionBanksSchema, createQuestionBanksSchema } from './questionBankSchema'
import {
  QuestionTypeValues,
  QuestionDifficultyValues,
  QuestionStatusValues,
} from '@/models/QuestionBank'
import type { QuestionReference } from '@/models/QuestionReference'

const validOptions = [
  { id: 'opt1', questionId: 'q1', text: 'Paris', isCorrect: true, displayOrder: 0 },
  { id: 'opt2', questionId: 'q1', text: 'London', isCorrect: false, displayOrder: 1 },
  { id: 'opt3', questionId: 'q1', text: 'Madrid', isCorrect: false, displayOrder: 2 },
]

const validQuestion = {
  id: 'q1',
  certificationExamId: 'saa-c03',
  examDomainId: 'domain-1',
  topicId: 'topic-1',
  externalCode: 'EXT-001',
  statement: 'What is the capital of France?',
  explanation: 'Paris is the capital of France.',
  type: QuestionTypeValues.SingleChoice,
  difficulty: QuestionDifficultyValues.Easy,
  status: QuestionStatusValues.Active,
  language: 'en',
  isActive: true,
  options: validOptions,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
}

function buildQuestion(
  id: string,
  overrides: Partial<typeof validQuestion> & { tagIds?: string[]; references?: QuestionReference[] } = {},
) {
  const { references = [], ...rest } = overrides
  return {
    ...validQuestion,
    id,
    options: validQuestion.options.map((option) => ({ ...option, questionId: id })),
    references: references.map((reference) => ({ ...reference, questionId: id })),
    ...rest,
  }
}

describe('questionBankSchema', () => {
  it('validates a complete question', () => {
    const result = questionBankSchema.safeParse(validQuestion)
    expect(result.success).toBe(true)
  })

  it('rejects an empty statement', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, statement: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a whitespace-only statement', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, statement: '   ' })
    expect(result.success).toBe(false)
  })

  it('trims leading and trailing whitespace from the statement', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, statement: '  What?  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.statement).toBe('What?')
    }
  })

  it('defaults status to Draft when omitted', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, status: undefined })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.status).toBe(QuestionStatusValues.Draft)
    }
  })

  it('defaults isActive to true when omitted', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, isActive: undefined })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isActive).toBe(true)
    }
  })

  it('defaults createdAt and updatedAt when omitted', () => {
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      createdAt: undefined,
      updatedAt: undefined,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(typeof result.data.createdAt).toBe('string')
      expect(typeof result.data.updatedAt).toBe('string')
    }
  })

  it('rejects an invalid question type', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, type: 'open_ended' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid difficulty', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, difficulty: 'expert' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid status', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, status: 'deleted' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid language value exceeding max length', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, language: 'en-US-extra-long' })
    expect(result.success).toBe(false)
  })
})

describe('questionBanksSchema', () => {
  it('rejects duplicate question ids within the same certification', () => {
    const result = questionBanksSchema.safeParse([validQuestion, buildQuestion('q1')])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('duplicate question id'))).toBe(true)
    }
  })

  it('allows the same question id in different certifications', () => {
    const anotherQuestion = buildQuestion('q1', { certificationExamId: 'sap-c02' })
    const result = questionBanksSchema.safeParse([validQuestion, anotherQuestion])
    expect(result.success).toBe(true)
  })

  it('rejects duplicate external codes within the same certification', () => {
    const result = questionBanksSchema.safeParse([validQuestion, buildQuestion('q2')])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('duplicate external code'))).toBe(true)
    }
  })

  it('allows the same external code in different certifications', () => {
    const anotherQuestion = buildQuestion('q2', { certificationExamId: 'sap-c02' })
    const result = questionBanksSchema.safeParse([validQuestion, anotherQuestion])
    expect(result.success).toBe(true)
  })
})

describe('createQuestionBanksSchema', () => {
  const schemaOptions = {
    domainIdsByCertification: new Map([['saa-c03', new Set(['domain-1'])]]),
    topicIdsByCertification: new Map([['saa-c03', new Set(['topic-1'])]]),
  }

  it('validates questions with consistent associations', () => {
    const schema = createQuestionBanksSchema(['saa-c03'], schemaOptions)
    const result = schema.safeParse([validQuestion])
    expect(result.success).toBe(true)
  })

  it('rejects questions linked to an unknown certification', () => {
    const schema = createQuestionBanksSchema(['saa-c03'], schemaOptions)
    const result = schema.safeParse([{ ...validQuestion, certificationExamId: 'unknown-exam' }])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('does not exist'))).toBe(true)
    }
  })

  it('rejects a domain from another certification', () => {
    const schema = createQuestionBanksSchema(['saa-c03'], {
      ...schemaOptions,
      domainIdsByCertification: new Map([
        ['saa-c03', new Set(['domain-1'])],
        ['sap-c02', new Set(['domain-2'])],
      ]),
    })
    const result = schema.safeParse([{ ...validQuestion, examDomainId: 'domain-2' }])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('does not belong'))).toBe(true)
    }
  })

  it('rejects a topic from another certification', () => {
    const schema = createQuestionBanksSchema(['saa-c03'], {
      ...schemaOptions,
      topicIdsByCertification: new Map([
        ['saa-c03', new Set(['topic-1'])],
        ['sap-c02', new Set(['topic-2'])],
      ]),
    })
    const result = schema.safeParse([{ ...validQuestion, topicId: 'topic-2' }])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('does not belong'))).toBe(true)
    }
  })
})

describe('questionBankSchema answer options', () => {
  it('rejects a question with fewer than two options', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, options: [validQuestion.options[0]] })
    expect(result.success).toBe(false)
  })

  it('rejects a SingleChoice question with no correct answer', () => {
    const options = validQuestion.options.map((option) => ({ ...option, isCorrect: false }))
    const result = questionBankSchema.safeParse({ ...validQuestion, options })
    expect(result.success).toBe(false)
  })

  it('rejects a SingleChoice question with more than one correct answer', () => {
    const options = validQuestion.options.map((option, i) => ({ ...option, isCorrect: i < 2 }))
    const result = questionBankSchema.safeParse({ ...validQuestion, options })
    expect(result.success).toBe(false)
  })

  it('validates a MultipleChoice question with at least two correct and one incorrect answer', () => {
    const options = [
      { id: 'opt1', questionId: 'q1', text: 'A', isCorrect: true, displayOrder: 0 },
      { id: 'opt2', questionId: 'q1', text: 'B', isCorrect: true, displayOrder: 1 },
      { id: 'opt3', questionId: 'q1', text: 'C', isCorrect: false, displayOrder: 2 },
    ]
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      type: QuestionTypeValues.MultipleChoice,
      options,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a MultipleChoice question with fewer than two correct answers', () => {
    const options = [
      { id: 'opt1', questionId: 'q1', text: 'A', isCorrect: true, displayOrder: 0 },
      { id: 'opt2', questionId: 'q1', text: 'B', isCorrect: false, displayOrder: 1 },
      { id: 'opt3', questionId: 'q1', text: 'C', isCorrect: false, displayOrder: 2 },
    ]
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      type: QuestionTypeValues.MultipleChoice,
      options,
    })
    expect(result.success).toBe(false)
  })

  it('rejects a MultipleChoice question with all correct answers', () => {
    const options = validQuestion.options.map((option) => ({ ...option, isCorrect: true }))
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      type: QuestionTypeValues.MultipleChoice,
      options,
    })
    expect(result.success).toBe(false)
  })

  it('rejects duplicate option text within the same question', () => {
    const options = [
      { id: 'opt1', questionId: 'q1', text: 'Same text', isCorrect: true, displayOrder: 0 },
      { id: 'opt2', questionId: 'q1', text: 'Same text', isCorrect: false, displayOrder: 1 },
    ]
    const result = questionBankSchema.safeParse({ ...validQuestion, options })
    expect(result.success).toBe(false)
  })

  it('rejects duplicate displayOrder within the same question', () => {
    const options = [
      { id: 'opt1', questionId: 'q1', text: 'A', isCorrect: true, displayOrder: 0 },
      { id: 'opt2', questionId: 'q1', text: 'B', isCorrect: false, displayOrder: 0 },
    ]
    const result = questionBankSchema.safeParse({ ...validQuestion, options })
    expect(result.success).toBe(false)
  })

  it('rejects an option whose questionId does not match the question', () => {
    const options = [
      { id: 'opt1', questionId: 'other', text: 'A', isCorrect: true, displayOrder: 0 },
      { id: 'opt2', questionId: 'q1', text: 'B', isCorrect: false, displayOrder: 1 },
    ]
    const result = questionBankSchema.safeParse({ ...validQuestion, options })
    expect(result.success).toBe(false)
  })

  it('ignores surrounding whitespace when comparing duplicate option text', () => {
    const options = [
      { id: 'opt1', questionId: 'q1', text: 'Same text', isCorrect: true, displayOrder: 0 },
      { id: 'opt2', questionId: 'q1', text: '  Same text  ', isCorrect: false, displayOrder: 1 },
    ]
    const result = questionBankSchema.safeParse({ ...validQuestion, options })
    expect(result.success).toBe(false)
  })
})

describe('questionBankSchema tags', () => {
  it('validates a question with tag ids', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, tagIds: ['t1', 't2'] })
    expect(result.success).toBe(true)
  })

  it('rejects duplicate tag ids within the same question', () => {
    const result = questionBankSchema.safeParse({ ...validQuestion, tagIds: ['t1', 't1'] })
    expect(result.success).toBe(false)
  })

  it('validates tag ids through createQuestionBanksSchema', () => {
    const schema = createQuestionBanksSchema(['saa-c03'], { validTagIds: new Set(['t1', 't2']) })
    const result = schema.safeParse([
      buildQuestion('q1', { examDomainId: undefined, topicId: undefined, tagIds: ['t1'] }),
    ])
    expect(result.success).toBe(true)
  })

  it('rejects a tag id that does not exist', () => {
    const schema = createQuestionBanksSchema(['saa-c03'], { validTagIds: new Set(['t1']) })
    const result = schema.safeParse([
      buildQuestion('q1', { examDomainId: undefined, topicId: undefined, tagIds: ['t2'] }),
    ])
    expect(result.success).toBe(false)
  })
})

describe('questionBankSchema references', () => {
  const validReferences: QuestionReference[] = [
    {
      id: 'ref1',
      questionId: 'q1',
      title: 'Official docs',
      url: 'https://example.com/docs',
      referenceType: 'official_documentation',
      displayOrder: 0,
    },
    {
      id: 'ref2',
      questionId: 'q1',
      title: 'Whitepaper',
      url: 'https://example.com/whitepaper',
      referenceType: 'whitepaper',
      displayOrder: 1,
    },
  ]

  it('validates a question with multiple references', () => {
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      references: validReferences,
    })
    expect(result.success).toBe(true)
  })

  it('rejects a reference whose questionId does not match the question', () => {
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      references: [{ ...validReferences[0], questionId: 'other' }],
    })
    expect(result.success).toBe(false)
  })

  it('rejects duplicate reference displayOrder within the same question', () => {
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      references: [
        { ...validReferences[0], displayOrder: 0 },
        { ...validReferences[1], displayOrder: 0 },
      ],
    })
    expect(result.success).toBe(false)
  })

  it('rejects a reference with a dangerous URL through the embedded schema', () => {
    const result = questionBankSchema.safeParse({
      ...validQuestion,
      references: [{ ...validReferences[0], url: 'javascript:alert(1)' }],
    })
    expect(result.success).toBe(false)
  })
})
