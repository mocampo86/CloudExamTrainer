import { z } from 'zod'

export const questionOptionSchema = z.object({
  id: z.string().min(1),
  text: z.string().min(1),
})

export const questionSchema = z.object({
  id: z.string().min(1),
  topic: z.string().min(1),
  difficulty: z.enum(['easy', 'medium', 'hard']),
  type: z.enum(['single_choice', 'multiple_choice']),
  question: z.string().min(1),
  options: z.array(questionOptionSchema).min(2),
  correctAnswers: z.array(z.string().min(1)).min(1),
  explanation: z.string().min(1),
}).superRefine((data, ctx) => {
  const optionIds = new Set<string>()

  data.options.forEach((option, i) => {
    if (optionIds.has(option.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `options[${i}].id "${option.id}" is duplicated`,
        path: ['options', i, 'id'],
      })
    } else {
      optionIds.add(option.id)
    }
  })

  data.correctAnswers.forEach((answer, i) => {
    if (!optionIds.has(answer)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `correctAnswers[${i}] references unknown option id "${answer}"`,
        path: ['correctAnswers', i],
      })
    }
  })

  if (data.type === 'single_choice' && data.correctAnswers.length !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'single_choice must have exactly one correct answer',
      path: ['correctAnswers'],
    })
  }

  if (data.type === 'multiple_choice' && data.correctAnswers.length < 2) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'multiple_choice must have at least two correct answers',
      path: ['correctAnswers'],
    })
  }
})

export const questionsSchema = z.array(questionSchema).superRefine((questions, ctx) => {
  const ids = new Set<string>()

  questions.forEach((q, i) => {
    if (ids.has(q.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `duplicate question id "${q.id}"`,
        path: [i, 'id'],
      })
    } else {
      ids.add(q.id)
    }
  })
})
