import { describe, it, expect } from 'vitest'
import { examDomainSchema, examDomainsSchema, createExamDomainsSchema } from './examDomainSchema'

const validDomain = {
  id: 'domain-1',
  certificationExamId: 'saa-c03',
  code: 'D1',
  name: 'Design Resilient Architectures',
  description: 'Covers resilient design patterns.',
  displayOrder: 1,
  isActive: true,
}

describe('examDomainSchema', () => {
  it('validates a complete exam domain', () => {
    const result = examDomainSchema.safeParse(validDomain)
    expect(result.success).toBe(true)
  })

  it('rejects an empty code', () => {
    const result = examDomainSchema.safeParse({ ...validDomain, code: '' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty name', () => {
    const result = examDomainSchema.safeParse({ ...validDomain, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a missing certification exam reference', () => {
    const result = examDomainSchema.safeParse({ ...validDomain, certificationExamId: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a negative display order', () => {
    const result = examDomainSchema.safeParse({ ...validDomain, displayOrder: -1 })
    expect(result.success).toBe(false)
  })

  it('defaults isActive to true when omitted', () => {
    const result = examDomainSchema.safeParse({ ...validDomain, isActive: undefined })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.isActive).toBe(true)
    }
  })

  it('rejects a code exceeding the maximum length', () => {
    const result = examDomainSchema.safeParse({ ...validDomain, code: 'a'.repeat(51) })
    expect(result.success).toBe(false)
  })

  it('rejects a name exceeding the maximum length', () => {
    const result = examDomainSchema.safeParse({ ...validDomain, name: 'a'.repeat(201) })
    expect(result.success).toBe(false)
  })
})

describe('examDomainsSchema', () => {
  it('rejects duplicate codes within the same certification', () => {
    const result = examDomainsSchema.safeParse([validDomain, { ...validDomain, id: 'domain-2' }])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('duplicate domain code'))).toBe(true)
    }
  })

  it('allows the same code for different certifications', () => {
    const anotherDomain = { ...validDomain, id: 'domain-2', certificationExamId: 'sap-c02' }
    const result = examDomainsSchema.safeParse([validDomain, anotherDomain])
    expect(result.success).toBe(true)
  })

  it('rejects a list with an invalid domain', () => {
    const result = examDomainsSchema.safeParse([{ ...validDomain, code: '' }])
    expect(result.success).toBe(false)
  })
})

describe('createExamDomainsSchema', () => {
  it('validates domains that reference existing certifications', () => {
    const schema = createExamDomainsSchema(['saa-c03'])
    const result = schema.safeParse([validDomain])
    expect(result.success).toBe(true)
  })

  it('rejects domains linked to an unknown certification', () => {
    const schema = createExamDomainsSchema(['saa-c03'])
    const result = schema.safeParse([{ ...validDomain, certificationExamId: 'unknown-exam' }])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('does not exist'))).toBe(true)
    }
  })
})
