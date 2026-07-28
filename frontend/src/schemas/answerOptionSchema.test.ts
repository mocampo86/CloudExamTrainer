import { describe, it, expect } from 'vitest'
import { answerOptionSchema } from './answerOptionSchema'

const validOption = {
  id: 'opt1',
  questionId: 'q1',
  text: 'Paris',
  isCorrect: true,
  displayOrder: 0,
}

describe('answerOptionSchema', () => {
  it('validates a complete answer option', () => {
    const result = answerOptionSchema.safeParse(validOption)
    expect(result.success).toBe(true)
  })

  it('rejects an empty text', () => {
    const result = answerOptionSchema.safeParse({ ...validOption, text: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a whitespace-only text', () => {
    const result = answerOptionSchema.safeParse({ ...validOption, text: '   ' })
    expect(result.success).toBe(false)
  })

  it('trims leading and trailing whitespace from the text', () => {
    const result = answerOptionSchema.safeParse({ ...validOption, text: '  Paris  ' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.text).toBe('Paris')
    }
  })

  it('rejects a negative display order', () => {
    const result = answerOptionSchema.safeParse({ ...validOption, displayOrder: -1 })
    expect(result.success).toBe(false)
  })

  it('rejects a missing question id', () => {
    const result = answerOptionSchema.safeParse({ ...validOption, questionId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a text exceeding the maximum length', () => {
    const result = answerOptionSchema.safeParse({ ...validOption, text: 'a'.repeat(1001) })
    expect(result.success).toBe(false)
  })
})
