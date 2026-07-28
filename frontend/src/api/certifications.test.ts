import { describe, it, expect } from 'vitest'
import { getCertification, getCertificationByCodeEndpoint, getCertifications } from './certifications'

describe('certifications API', () => {
  it('returns 200 OK with active certifications ordered by name', async () => {
    const response = await getCertifications()

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.length).toBeGreaterThan(0)
    expect(response.body.every((cert) => cert.isActive)).toBe(true)
    expect(response.body).toEqual([...response.body].sort((a, b) => a.name.localeCompare(b.name)))
  })

  it('returns 200 OK with an existing certification by id', async () => {
    const response = await getCertification('saa-c03')

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.id).toBe('saa-c03')
    expect(response.body.isActive).toBe(true)
  })

  it('returns 200 OK with an existing certification by code', async () => {
    const response = await getCertificationByCodeEndpoint('SAA-C03')

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.code).toBe('SAA-C03')
  })

  it('returns 404 Not Found for an unknown certification id', async () => {
    const response = await getCertification('unknown-id')
    expect(response.status).toBe(404)
    if (response.status !== 404) return
    expect(response.body.error).toBe('Certification not found')
  })

  it('returns 404 Not Found for an unknown certification code', async () => {
    const response = await getCertificationByCodeEndpoint('UNKNOWN')
    expect(response.status).toBe(404)
  })

  it('returns 400 Bad Request for an empty id', async () => {
    const response = await getCertification('  ')
    expect(response.status).toBe(400)
    if (response.status !== 400) return
    expect(response.body.error).toBe('Invalid certification identifier')
  })

  it('does not expose inactive certifications', async () => {
    const listResponse = await getCertifications()
    expect(listResponse.status).toBe(200)
    if (listResponse.status !== 200) return

    expect(listResponse.body.some((cert) => !cert.isActive)).toBe(false)
  })
})
