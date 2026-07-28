import { z } from 'zod'

const MAX_TEXT_LENGTH = 1000

export const answerOptionSchema = z.object({
  id: z.string().min(1),
  questionId: z.string().min(1),
  text: z.string().trim().min(1).max(MAX_TEXT_LENGTH),
  isCorrect: z.boolean(),
  displayOrder: z.number().int().min(0),
})
