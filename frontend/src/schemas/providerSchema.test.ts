import { describe, it, expect } from 'vitest'
import { providerSchema } from './providerSchema'

const validProvider = {
  id: 'aws',
  name: 'Amazon Web Services',
  logo: '/logos/aws.svg',
  color: '#232f3e',
}

describe('providerSchema', () => {
  it('validates a complete provider', () => {
    const result = providerSchema.safeParse(validProvider)
    expect(result.success).toBe(true)
  })

  it('rejects an empty id', () => {
    const result = providerSchema.safeParse({ ...validProvider, id: '' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty name', () => {
    const result = providerSchema.safeParse({ ...validProvider, name: '' })
    expect(result.success).toBe(false)
  })
})
