import { describe, it, expect } from 'vitest'
import { tagSchema, tagsSchema } from './tagSchema'

const validTag = {
  id: 't1',
  name: 'Serverless',
  slug: 'serverless',
  description: 'Services that do not require server management.',
  isActive: true,
}

describe('tagSchema', () => {
  it('validates a complete tag', () => {
    const result = tagSchema.safeParse(validTag)
    expect(result.success).toBe(true)
  })

  it('rejects an empty name', () => {
    const result = tagSchema.safeParse({ ...validTag, name: '' })
    expect(result.success).toBe(false)
  })

  it('rejects an empty slug', () => {
    const result = tagSchema.safeParse({ ...validTag, slug: '' })
    expect(result.success).toBe(false)
  })

  it('rejects a whitespace-only name', () => {
    const result = tagSchema.safeParse({ ...validTag, name: '   ' })
    expect(result.success).toBe(false)
  })

  it('normalizes slug to lowercase', () => {
    const result = tagSchema.safeParse({ ...validTag, slug: 'ServerLess' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.slug).toBe('serverless')
    }
  })

  it('trims leading and trailing whitespace from slug and name', () => {
    const result = tagSchema.safeParse({
      ...validTag,
      name: '  Serverless  ',
      slug: '  Serverless  ',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.name).toBe('Serverless')
      expect(result.data.slug).toBe('serverless')
    }
  })

  it('rejects a tag name exceeding the maximum length', () => {
    const result = tagSchema.safeParse({ ...validTag, name: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })

  it('rejects a tag slug exceeding the maximum length', () => {
    const result = tagSchema.safeParse({ ...validTag, slug: 'a'.repeat(101) })
    expect(result.success).toBe(false)
  })
})

describe('tagsSchema', () => {
  it('rejects duplicate normalized slugs', () => {
    const result = tagsSchema.safeParse([
      validTag,
      { ...validTag, id: 't2', name: 'Serverless 2', slug: 'SERVERLESS' },
    ])
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues.some((issue) => issue.message.includes('duplicate slug'))).toBe(true)
    }
  })

  it('allows slugs that differ after normalization', () => {
    const result = tagsSchema.safeParse([
      validTag,
      { ...validTag, id: 't2', name: 'Containers', slug: 'containers' },
    ])
    expect(result.success).toBe(true)
  })
})
