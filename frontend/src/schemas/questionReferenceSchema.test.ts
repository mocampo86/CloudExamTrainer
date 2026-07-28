import { describe, it, expect } from 'vitest'
import { questionReferenceSchema } from './questionReferenceSchema'
import { ReferenceTypeValues } from '@/models/QuestionReference'

const validReference = {
  id: 'ref1',
  questionId: 'q1',
  title: 'Official Documentation',
  url: 'https://example.com/docs',
  referenceType: ReferenceTypeValues.OfficialDocumentation,
  displayOrder: 0,
}

describe('questionReferenceSchema', () => {
  it('validates a complete reference', () => {
    const result = questionReferenceSchema.safeParse(validReference)
    expect(result.success).toBe(true)
  })

  it('rejects an empty title', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, title: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a whitespace-only title', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, title: '   ' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid URL', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, url: 'not a url' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing protocol', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, url: 'example.com/docs' })
    expect(result.success).toBe(false)
  })

  it('rejects a javascript scheme', () => {
    const result = questionReferenceSchema.safeParse({
      ...validReference,
      url: 'javascript:alert(1)',
    })
    expect(result.success).toBe(false)
  })

  it('rejects a data scheme', () => {
    const result = questionReferenceSchema.safeParse({
      ...validReference,
      url: 'data:text/html,<script>alert(1)</script>',
    })
    expect(result.success).toBe(false)
  })

  it('accepts each reference type', () => {
    const types = [
      ReferenceTypeValues.OfficialDocumentation,
      ReferenceTypeValues.Whitepaper,
      ReferenceTypeValues.Other,
    ]

    types.forEach((type) => {
      const result = questionReferenceSchema.safeParse({ ...validReference, referenceType: type })
      expect(result.success).toBe(true)
    })
  })

  it('rejects an invalid reference type', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, referenceType: 'video' })
    expect(result.success).toBe(false)
  })

  it('rejects a negative display order', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, displayOrder: -1 })
    expect(result.success).toBe(false)
  })

  it('rejects a missing question id', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, questionId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a title exceeding the maximum length', () => {
    const result = questionReferenceSchema.safeParse({ ...validReference, title: 'a'.repeat(201) })
    expect(result.success).toBe(false)
  })
})
