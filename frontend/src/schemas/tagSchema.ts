import { z } from 'zod'

const MAX_NAME_LENGTH = 100
const MAX_SLUG_LENGTH = 100
const MAX_DESCRIPTION_LENGTH = 500

export const tagSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(MAX_NAME_LENGTH),
  slug: z.string().trim().toLowerCase().min(1).max(MAX_SLUG_LENGTH),
  description: z.string().max(MAX_DESCRIPTION_LENGTH).optional(),
  isActive: z.boolean().default(true),
})

export const tagsSchema = z.array(tagSchema).superRefine((tags, ctx) => {
  const slugs = new Set<string>()

  tags.forEach((tag, i) => {
    if (slugs.has(tag.slug)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate slug "${tag.slug}"`,
        path: [i, 'slug'],
      })
    } else {
      slugs.add(tag.slug)
    }
  })
})
