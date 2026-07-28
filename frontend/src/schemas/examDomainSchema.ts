import { z } from 'zod'

/**
 * Max length constants for the ExamDomain fields.
 *
 * These values are kept conservative to match a normalized storage
 * design while remaining flexible for real-world exam codes and names.
 */
const MAX_CODE_LENGTH = 50
const MAX_NAME_LENGTH = 200
const MAX_DESCRIPTION_LENGTH = 1000

export const examDomainSchema = z.object({
  id: z.string().min(1),
  certificationExamId: z.string().min(1),
  code: z.string().min(1).max(MAX_CODE_LENGTH),
  name: z.string().min(1).max(MAX_NAME_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  displayOrder: z.number().int().min(0),
  isActive: z.boolean().default(true),
})

export const examDomainsSchema = z.array(examDomainSchema).superRefine((domains, ctx) => {
  const keys = new Set<string>()

  domains.forEach((domain, i) => {
    const key = `${domain.certificationExamId}:${domain.code}`

    if (keys.has(key)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate domain code "${domain.code}" within certification "${domain.certificationExamId}"`,
        path: [i, 'code'],
      })
    } else {
      keys.add(key)
    }
  })
})

/**
 * Builds a schema that validates that each domain references an existing
 * certification exam.
 *
 * This replaces a foreign-key constraint in a server-side persistence layer
 * with a runtime check against the currently known certification ids.
 */
export function createExamDomainsSchema(certificationExamIds: Iterable<string>) {
  const ids = new Set(certificationExamIds)

  return examDomainsSchema.superRefine((domains, ctx) => {
    domains.forEach((domain, i) => {
      if (!ids.has(domain.certificationExamId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `certificationExamId "${domain.certificationExamId}" does not exist`,
          path: [i, 'certificationExamId'],
        })
      }
    })
  })
}
