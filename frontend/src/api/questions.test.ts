import { describe, it, expect } from 'vitest'
import {
  createQuestionEndpoint,
  updateQuestionEndpoint,
  getQuestionByIdEndpoint,
  listQuestionsEndpoint,
  changeQuestionStatusEndpoint,
  deleteQuestionEndpoint,
  duplicateQuestionEndpoint,
} from './questions'
import { QuestionTypeValues, QuestionDifficultyValues } from '@/models/QuestionBank'

const validCommand = {
  certificationExamId: 'saa-c03',
  statement: 'What is the capital of France?',
  explanation: 'Paris is the capital of France.',
  type: QuestionTypeValues.SingleChoice,
  difficulty: QuestionDifficultyValues.Easy,
  options: [
    { text: 'Paris', isCorrect: true },
    { text: 'London', isCorrect: false },
  ],
}

describe('questions API', () => {
  it('returns 201 Created for a valid question', async () => {
    const response = await createQuestionEndpoint({
      ...validCommand,
      statement: `API test ${Date.now()}`,
    })

    expect(response.status).toBe(201)
    if (response.status !== 201) return

    expect(response.body.id).toBeDefined()
    expect(response.body.certificationExamId).toBe('saa-c03')
    expect(response.body.statement).toContain('API test')
    expect(response.body.createdAt).toBeDefined()
  })

  it('returns 400 Bad Request for a validation error', async () => {
    const response = await createQuestionEndpoint({
      ...validCommand,
      statement: '',
    })

    expect(response.status).toBe(400)
    if (response.status !== 400) return

    expect(response.body.error).toBe('Validation failed')
    expect(response.body.details.length).toBeGreaterThan(0)
  })

  it('returns 404 Not Found for an unknown certification', async () => {
    const response = await createQuestionEndpoint({
      ...validCommand,
      certificationExamId: 'unknown-cert',
      statement: `API unknown cert ${Date.now()}`,
    })

    expect(response.status).toBe(404)
    if (response.status !== 404) return

    expect(response.body.error).toBe('Exam or category not found')
  })

  it('returns 404 Not Found for a topic that does not belong to the certification', async () => {
    const response = await createQuestionEndpoint({
      ...validCommand,
      topicId: 'Unknown Topic',
      statement: `API unknown topic ${Date.now()}`,
    })

    expect(response.status).toBe(404)
  })

  it('returns 200 OK when updating an existing question', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API update base ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    const updated = await updateQuestionEndpoint(created.body.id, {
      ...validCommand,
      statement: `API updated ${Date.now()}`,
      difficulty: QuestionDifficultyValues.Hard,
    })

    expect(updated.status).toBe(200)
    if (updated.status !== 200) return

    expect(updated.body.id).toBe(created.body.id)
    expect(updated.body.difficulty).toBe(QuestionDifficultyValues.Hard)
  })

  it('returns 404 Not Found when updating a non-existent question', async () => {
    const response = await updateQuestionEndpoint('non-existent-id', {
      ...validCommand,
      statement: `API missing ${Date.now()}`,
    })

    expect(response.status).toBe(404)
  })

  it('returns 400 Bad Request for an invalid update command', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API invalid update base ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    const response = await updateQuestionEndpoint(created.body.id, {
      ...validCommand,
      statement: '',
    })

    expect(response.status).toBe(400)
  })

  it('returns 409 Conflict when the concurrency token does not match', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API concurrency base ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    const response = await updateQuestionEndpoint(created.body.id, {
      ...validCommand,
      statement: `API concurrency ${Date.now()}`,
      concurrencyToken: '2020-01-01T00:00:00.000Z',
    })

    expect(response.status).toBe(409)
  })

  it('returns 200 OK with the full question detail for an existing id', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API get base ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    const response = await getQuestionByIdEndpoint(created.body.id)

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.id).toBe(created.body.id)
    expect(response.body.statement).toBe(created.body.statement)
    expect(response.body.certificationExamName).toBeDefined()
    expect(response.body.options).toHaveLength(2)
  })

  it('returns 404 Not Found for an unknown question id', async () => {
    const response = await getQuestionByIdEndpoint('unknown-id')
    expect(response.status).toBe(404)
  })

  it('returns 400 Bad Request for an empty question id', async () => {
    const response = await getQuestionByIdEndpoint('')
    expect(response.status).toBe(400)
  })

  it('returns 200 OK with a paginated list of questions', async () => {
    for (let index = 0; index < 3; index += 1) {
      const created = await createQuestionEndpoint({
        ...validCommand,
        statement: `API list ${Date.now()} ${index}`,
      })
      expect(created.status).toBe(201)
    }

    const response = await listQuestionsEndpoint({ pageNumber: 1, pageSize: 2 })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.items).toHaveLength(2)
    expect(response.body.pageNumber).toBe(1)
    expect(response.body.pageSize).toBe(2)
    expect(response.body.totalItems).toBeGreaterThanOrEqual(3)
    expect(response.body.hasNextPage).toBe(true)
    expect(response.body.hasPreviousPage).toBe(false)
    expect(response.body.items[0].optionsCount).toBeGreaterThanOrEqual(2)
  })

  it('returns 200 OK with an empty page beyond total pages', async () => {
    const response = await listQuestionsEndpoint({ pageNumber: 9999, pageSize: 10 })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.items).toHaveLength(0)
    expect(response.body.totalPages).toBeLessThan(9999)
  })

  it('returns 400 Bad Request for invalid pagination parameters', async () => {
    const response = await listQuestionsEndpoint({ pageSize: 51 })
    expect(response.status).toBe(400)
  })

  it('returns 200 OK filtered by search text', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API filter search ${Date.now()}`,
    })
    expect(created.status).toBe(201)

    const response = await listQuestionsEndpoint({ searchText: 'API filter search', pageSize: 50 })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.items.some((item) => item.statement.includes('API filter search'))).toBe(true)
  })

  it('returns 200 OK filtered by type and difficulty', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      type: QuestionTypeValues.MultipleChoice,
      difficulty: QuestionDifficultyValues.Hard,
      options: [
        { text: 'A', isCorrect: true },
        { text: 'B', isCorrect: true },
        { text: 'C', isCorrect: false },
      ],
      statement: `API filter type ${Date.now()}`,
    })
    expect(created.status).toBe(201)

    const response = await listQuestionsEndpoint({
      type: QuestionTypeValues.MultipleChoice,
      difficulty: QuestionDifficultyValues.Hard,
      pageSize: 50,
    })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.items[0].type).toBe(QuestionTypeValues.MultipleChoice)
    expect(response.body.items[0].difficulty).toBe(QuestionDifficultyValues.Hard)
  })

  it('returns 400 Bad Request for an invalid sort field', async () => {
    const response = await listQuestionsEndpoint({ sortBy: 'unknown' })
    expect(response.status).toBe(400)
  })

  it('returns 200 OK when deactivating an existing question', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API deactivate ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    const response = await changeQuestionStatusEndpoint(created.body.id, { isActive: false })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.isActive).toBe(false)
    expect(response.body.status).toBe('draft')
  })

  it('returns 200 OK when activating a valid question', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API activate ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    await changeQuestionStatusEndpoint(created.body.id, { isActive: false })
    const response = await changeQuestionStatusEndpoint(created.body.id, { isActive: true })

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.isActive).toBe(true)
    expect(response.body.status).toBe('active')
  })

  it('returns 400 Bad Request for an empty question identifier', async () => {
    const response = await changeQuestionStatusEndpoint('', { isActive: false })
    expect(response.status).toBe(400)
  })

  it('returns 404 Not Found for an unknown question', async () => {
    const response = await changeQuestionStatusEndpoint('missing-id', { isActive: false })
    expect(response.status).toBe(404)
  })

  it('returns 200 OK when deleting an existing question', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API delete ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    const response = await deleteQuestionEndpoint(created.body.id)

    expect(response.status).toBe(200)
    if (response.status !== 200) return

    expect(response.body.isActive).toBe(false)
  })

  it('excludes deleted questions from list results', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API delete list ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    await deleteQuestionEndpoint(created.body.id)

    const list = await listQuestionsEndpoint({ searchText: created.body.statement, pageSize: 50 })

    expect(list.status).toBe(200)
    if (list.status !== 200) return

    expect(list.body.items.some((item) => item.id === created.body.id)).toBe(false)
  })

  it('returns 404 Not Found for an unknown question', async () => {
    const response = await deleteQuestionEndpoint('missing-id')
    expect(response.status).toBe(404)
  })

  it('returns 201 Created when duplicating an existing question', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API duplicate ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    const response = await duplicateQuestionEndpoint(created.body.id)

    expect(response.status).toBe(201)
    if (response.status !== 201) return

    expect(response.body.sourceQuestionId).toBe(created.body.id)
    expect(response.body.id).not.toBe(created.body.id)
    expect(response.body.isActive).toBe(false)
  })

  it('returns 404 Not Found when duplicating an archived question', async () => {
    const created = await createQuestionEndpoint({
      ...validCommand,
      statement: `API duplicate archived ${Date.now()}`,
    })

    expect(created.status).toBe(201)
    if (created.status !== 201) return

    await deleteQuestionEndpoint(created.body.id)
    const response = await duplicateQuestionEndpoint(created.body.id)

    expect(response.status).toBe(404)
  })

  it('returns 404 Not Found for an unknown source question', async () => {
    const response = await duplicateQuestionEndpoint('missing-id')
    expect(response.status).toBe(404)
  })
})
