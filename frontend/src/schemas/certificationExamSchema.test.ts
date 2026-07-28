import { describe, it, expect } from 'vitest'
import { certificationExamSchema, certificationExamsSchema } from './certificationExamSchema'

const validExam = {
  id: 'saa-c03',
  providerId: 'aws',
  code: 'SAA-C03',
  name: 'AWS Certified Solutions Architect - Associate',
  description: 'Validate technical expertise in designing distributed systems on AWS.',
  version: 'SAA-C03',
  difficulty: 'medium',
  isActive: true,
  imageUrl: '/images/saa-c03.png',
}

describe('certificationExamSchema', () => {
  it('validates a complete certification exam', () => {
    const result = certificationExamSchema.safeParse(validExam)
    expect(result.success).toBe(true)
  })

  it('rejects an empty code', () => {
    const result = certificationExamSchema.safeParse({ ...validExam, code: '' })
    expect(result.success).toBe(false)
  })

  it('rejects an invalid difficulty value', () => {
    const result = certificationExamSchema.safeParse({ ...validExam, difficulty: 'expert' })
    expect(result.success).toBe(false)
  })

  it('rejects a list with duplicate exam codes', () => {
    const result = certificationExamsSchema.safeParse([validExam, validExam])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('duplicate exam code'))).toBe(true)
    }
  })

  it('allows exams with different codes for the same provider', () => {
    const anotherExam = { ...validExam, id: 'sap-c02', code: 'SAP-C02', name: 'AWS Certified Solutions Architect - Professional' }
    const result = certificationExamsSchema.safeParse([validExam, anotherExam])
    expect(result.success).toBe(true)
  })
})
