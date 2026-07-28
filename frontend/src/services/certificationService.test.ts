import { describe, it, expect } from 'vitest'
import {
  getAvailableCertifications,
  getCertificationById,
  getCertificationByCode,
} from './certificationService'

describe('certificationService', () => {
  it('returns all active certifications sorted by name', async () => {
    const certifications = await getAvailableCertifications()
    expect(certifications.length).toBeGreaterThan(0)
    expect(certifications.every((cert) => cert.isActive)).toBe(true)
    expect(certifications).toEqual([...certifications].sort((a, b) => a.name.localeCompare(b.name)))
  })

  it('finds an active certification by id', async () => {
    const certification = await getCertificationById('saa-c03')
    expect(certification).not.toBeNull()
    expect(certification?.id).toBe('saa-c03')
    expect(certification?.provider).toEqual({ id: 'aws', name: 'Amazon Web Services' })
  })

  it('finds an active certification by code', async () => {
    const certification = await getCertificationByCode('SAA-C03')
    expect(certification).not.toBeNull()
    expect(certification?.code).toBe('SAA-C03')
  })

  it('returns null for an unknown certification id', async () => {
    const certification = await getCertificationById('unknown-id')
    expect(certification).toBeNull()
  })

  it('returns null for an unknown certification code', async () => {
    const certification = await getCertificationByCode('UNKNOWN-CODE')
    expect(certification).toBeNull()
  })

  it('maps the certification entity to the DTO shape', async () => {
    const certification = await getCertificationById('saa-c03')
    expect(certification).toMatchObject({
      id: 'saa-c03',
      code: 'SAA-C03',
      name: 'AWS Certified Solutions Architect - Associate',
      version: 'SAA-C03',
      difficulty: 'medium',
      isActive: true,
      provider: {
        id: 'aws',
        name: 'Amazon Web Services',
      },
    })
    expect(typeof certification?.description).toBe('string')
    expect(typeof certification?.imageUrl).toBe('string')
  })
})
