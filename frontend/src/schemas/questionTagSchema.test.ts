import { describe, it, expect } from 'vitest'
import { questionTagSchema, createQuestionTagsSchema } from './questionTagSchema'

const validRelation = {
  questionId: 'q1',
  tagId: 't1',
}

describe('questionTagSchema', () => {
  it('validates a complete question-tag relation', () => {
    const result = questionTagSchema.safeParse(validRelation)
    expect(result.success).toBe(true)
  })

  it('rejects an empty question id', () => {
    const result = questionTagSchema.safeParse({ ...validRelation, questionId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty tag id', () => {
    const result = questionTagSchema.safeParse({ ...validRelation, tagId: '' })
    expect(result.success).toBe(false)
  })
})

describe('createQuestionTagsSchema', () => {
  it('validates relations with existing question and tag ids', () => {
    const schema = createQuestionTagsSchema(['q1', 'q2'], ['t1', 't2'])
    const result = schema.safeParse([
      { questionId: 'q1', tagId: 't1' },
      { questionId: 'q1', tagId: 't2' },
      { questionId: 'q2', tagId: 't1' },
    ])
    expect(result.success).toBe(true)
  })

  it('rejects a relation with an unknown question id', () => {
    const schema = createQuestionTagsSchema(['q1'], ['t1'])
    const result = schema.safeParse([{ questionId: 'q2', tagId: 't1' }])
    expect(result.success).toBe(false)
  })

  it('rejects a relation with an unknown tag id', () => {
    const schema = createQuestionTagsSchema(['q1'], ['t1'])
    const result = schema.safeParse([{ questionId: 'q1', tagId: 't2' }])
    expect(result.success).toBe(false)
  })

  it('rejects duplicate question-tag relations', () => {
    const schema = createQuestionTagsSchema(['q1'], ['t1'])
    const result = schema.safeParse([
      { questionId: 'q1', tagId: 't1' },
      { questionId: 'q1', tagId: 't1' },
    ])
    expect(result.success).toBe(false)
  })
})
