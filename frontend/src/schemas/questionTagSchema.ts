import { z } from 'zod'

export const questionTagSchema = z.object({
  questionId: z.string().min(1),
  tagId: z.string().min(1),
})

export function createQuestionTagsSchema(questionIds: Iterable<string>, tagIds: Iterable<string>) {
  const qIds = new Set(questionIds)
  const tIds = new Set(tagIds)

  return z.array(questionTagSchema).superRefine((relations, ctx) => {
    const keys = new Set<string>()

    relations.forEach((relation, i) => {
      if (!qIds.has(relation.questionId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `questionId "${relation.questionId}" does not exist`,
          path: [i, 'questionId'],
        })
      }

      if (!tIds.has(relation.tagId)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `tagId "${relation.tagId}" does not exist`,
          path: [i, 'tagId'],
        })
      }

      const key = `${relation.questionId}:${relation.tagId}`
      if (keys.has(key)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `duplicate question-tag relation`,
          path: [i, 'tagId'],
        })
      } else {
        keys.add(key)
      }
    })
  })
}
