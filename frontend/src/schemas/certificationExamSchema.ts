import { z } from 'zod'

export const certificationExamDifficultySchema = z.enum(['easy', 'medium', 'hard'])

export const certificationExamSchema = z.object({
  id: z.string().min(1),
  providerId: z.string().min(1),
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().min(1),
  version: z.string().min(1),
  difficulty: certificationExamDifficultySchema,
  isActive: z.boolean(),
  imageUrl: z.string().min(1),
})

export const certificationExamsSchema = z.array(certificationExamSchema).superRefine((exams, ctx) => {
  const codes = new Set<string>()

  exams.forEach((exam, i) => {
    if (codes.has(exam.code)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate exam code "${exam.code}"`,
        path: [i, 'code'],
      })
    } else {
      codes.add(exam.code)
    }
  })
})
