import { z } from 'zod'
import { ReferenceTypeValues, type ReferenceType } from '@/models/QuestionReference'

const MAX_TITLE_LENGTH = 200

const referenceTypeValues: [ReferenceType, ...ReferenceType[]] = [
  ReferenceTypeValues.OfficialDocumentation,
  ReferenceTypeValues.Whitepaper,
  ReferenceTypeValues.Other,
]

const ALLOWED_SCHEMES = ['http:', 'https:']

function isAllowedUrl(value: string): boolean {
  try {
    const url = new URL(value)
    return ALLOWED_SCHEMES.includes(url.protocol)
  } catch {
    return false
  }
}

export const questionReferenceSchema = z.object({
  id: z.string().min(1),
  questionId: z.string().min(1),
  title: z.string().trim().min(1).max(MAX_TITLE_LENGTH),
  url: z
    .string()
    .trim()
    .refine(isAllowedUrl, {
      message: 'url must be a valid http or https URL',
    }),
  referenceType: z.enum(referenceTypeValues),
  displayOrder: z.number().int().min(0),
})
