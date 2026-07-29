import { describe, it, expect } from 'vitest'
import {
  createQuestion,
  updateQuestion,
  getQuestionById,
  listQuestions,
  changeQuestionStatus,
  deleteQuestion,
  duplicateQuestion,
  getAdminQuestions,
  CreateQuestionValidationError,
  UpdateQuestionValidationError,
  QuestionNotFoundError,
  UpdateQuestionConcurrencyError,
  InvalidQuestionIdentifierError,
  ListQuestionsValidationError,
  QuestionStatusChangeValidationError,
} from './questionAdminService'
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

describe('questionAdminService', () => {
  it('creates a question with a unique id and current UTC timestamps', async () => {
    const response = await createQuestion({
      ...validCommand,
      statement: `Service test ${Date.now()}`,
    })

    expect(response.certificationExamId).toBe('saa-c03')
    expect(response.statement).toContain('Service test')
    expect(response.type).toBe(QuestionTypeValues.SingleChoice)
    expect(response.difficulty).toBe(QuestionDifficultyValues.Easy)
    expect(response.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)

    const stored = getAdminQuestions().find((question) => question.id === response.id)
    expect(stored).toBeDefined()
    expect(stored?.createdAt).toBe(response.createdAt)
    expect(stored?.updatedAt).toBe(response.createdAt)
  })

  it('creates a question with an existing topic', async () => {
    const response = await createQuestion({
      ...validCommand,
      topicId: 'Compute',
      statement: `Service topic test ${Date.now()}`,
    })

    expect(response.id).toBeDefined()
  })

  it('rejects a question for an unknown certification', async () => {
    await expect(
      createQuestion({
        ...validCommand,
        certificationExamId: 'unknown-cert',
        statement: `Unknown cert ${Date.now()}`,
      }),
    ).rejects.toThrow(CreateQuestionValidationError)
  })

  it('rejects a question with a topic that does not belong to the certification', async () => {
    await expect(
      createQuestion({
        ...validCommand,
        topicId: 'Unknown Topic',
        statement: `Unknown topic ${Date.now()}`,
      }),
    ).rejects.toThrow(CreateQuestionValidationError)
  })

  it('rejects a question with invalid options', async () => {
    await expect(
      createQuestion({
        ...validCommand,
        options: [{ text: 'Only one', isCorrect: true }],
        statement: `Invalid options ${Date.now()}`,
      }),
    ).rejects.toThrow(CreateQuestionValidationError)
  })

  it('rejects a single choice question with multiple correct answers', async () => {
    await expect(
      createQuestion({
        ...validCommand,
        options: [
          { text: 'Paris', isCorrect: true },
          { text: 'Lyon', isCorrect: true },
        ],
        statement: `Multiple correct ${Date.now()}`,
      }),
    ).rejects.toThrow(CreateQuestionValidationError)
  })

  it('creates a multiple choice question with valid correct answers', async () => {
    const response = await createQuestion({
      ...validCommand,
      type: QuestionTypeValues.MultipleChoice,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'Lyon', isCorrect: true },
        { text: 'London', isCorrect: false },
      ],
      statement: `Multiple choice ${Date.now()}`,
    })

    const stored = getAdminQuestions().find((question) => question.id === response.id)
    expect(stored?.options.filter((option) => option.isCorrect)).toHaveLength(2)
    expect(stored?.options).toHaveLength(3)
  })

  it('updates a question preserving id and creation date', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Update base ${Date.now()}`,
    })

    await new Promise((resolve) => {
      setTimeout(resolve, 5)
    })

    const updated = await updateQuestion(created.id, {
      ...validCommand,
      statement: `Updated ${Date.now()}`,
      difficulty: QuestionDifficultyValues.Hard,
      options: [
        { text: 'Paris', isCorrect: true },
        { text: 'Berlin', isCorrect: false },
      ],
    })

    expect(updated.id).toBe(created.id)
    expect(updated.createdAt).toBe(created.createdAt)
    expect(updated.updatedAt).not.toBe(created.createdAt)
    expect(updated.difficulty).toBe(QuestionDifficultyValues.Hard)

    const stored = getAdminQuestions().find((question) => question.id === created.id)
    expect(stored?.statement).toContain('Updated')
    expect(stored?.options).toHaveLength(2)
    expect(stored?.options.every((option) => option.questionId === created.id)).toBe(true)
  })

  it('rejects an update for a non-existent question', async () => {
    await expect(
      updateQuestion('non-existent-id', {
        ...validCommand,
        statement: `Missing ${Date.now()}`,
      }),
    ).rejects.toThrow(QuestionNotFoundError)
  })

  it('rejects an update when the command id does not match the path id', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Id mismatch ${Date.now()}`,
    })

    await expect(
      updateQuestion(created.id, {
        ...validCommand,
        id: 'other-id',
        statement: `Mismatch ${Date.now()}`,
      }),
    ).rejects.toThrow(UpdateQuestionValidationError)
  })

  it('rejects an update with invalid options', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Invalid update ${Date.now()}`,
    })

    await expect(
      updateQuestion(created.id, {
        ...validCommand,
        options: [{ text: 'Only one', isCorrect: true }],
      }),
    ).rejects.toThrow(UpdateQuestionValidationError)
  })

  it('rejects an update when the concurrency token does not match', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Concurrency ${Date.now()}`,
    })

    await expect(
      updateQuestion(created.id, {
        ...validCommand,
        statement: `Stale ${Date.now()}`,
        concurrencyToken: '2020-01-01T00:00:00.000Z',
      }),
    ).rejects.toThrow(UpdateQuestionConcurrencyError)
  })

  it('rejects an update when the topic does not belong to the selected certification', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Topic update ${Date.now()}`,
    })

    await expect(
      updateQuestion(created.id, {
        ...validCommand,
        topicId: 'Unknown Topic',
        statement: `Bad topic ${Date.now()}`,
      }),
    ).rejects.toThrow(UpdateQuestionValidationError)
  })

  it('returns a question detail by id', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Get by id ${Date.now()}`,
    })

    const detail = await getQuestionById(created.id)

    expect(detail.id).toBe(created.id)
    expect(detail.statement).toContain('Get by id')
    expect(detail.certificationExamName).toBeDefined()
    expect(detail.options).toHaveLength(2)
    expect(detail.options[0].displayOrder).toBe(0)
    expect(detail.options[1].displayOrder).toBe(1)
  })

  it('throws InvalidQuestionIdentifierError for an empty id', async () => {
    await expect(getQuestionById('')).rejects.toThrow(InvalidQuestionIdentifierError)
  })

  it('throws QuestionNotFoundError when the question does not exist', async () => {
    await expect(getQuestionById('non-existent-id')).rejects.toThrow(QuestionNotFoundError)
  })

  it('lists questions with default pagination and metadata', async () => {
    await createQuestion({
      ...validCommand,
      statement: `List default ${Date.now()}`,
    })

    const page = await listQuestions()

    expect(page.pageNumber).toBe(1)
    expect(page.pageSize).toBe(10)
    expect(page.items.length).toBeGreaterThanOrEqual(1)
    expect(page.totalItems).toBeGreaterThanOrEqual(page.items.length)
    expect(page.totalPages).toBeGreaterThanOrEqual(1)
    expect(page.hasPreviousPage).toBe(false)
    expect(page.items[0].optionsCount).toBeGreaterThanOrEqual(0)
  })

  it('paginates through created questions', async () => {
    for (let index = 0; index < 3; index += 1) {
      await createQuestion({
        ...validCommand,
        statement: `List pagination ${Date.now()} ${index}`,
      })
    }

    const pageOne = await listQuestions({ pageNumber: 1, pageSize: 2 })
    expect(pageOne.items).toHaveLength(2)
    expect(pageOne.hasNextPage).toBe(true)
    expect(pageOne.hasPreviousPage).toBe(false)

    const pageTwo = await listQuestions({ pageNumber: 2, pageSize: 2 })
    expect(pageTwo.items.length).toBeGreaterThanOrEqual(1)
    expect(pageTwo.hasPreviousPage).toBe(true)
  })

  it('returns an empty page when page number is beyond total pages', async () => {
    const page = await listQuestions({ pageNumber: 9999, pageSize: 10 })
    expect(page.items).toHaveLength(0)
    expect(page.totalPages).toBeLessThan(9999)
    expect(page.hasNextPage).toBe(false)
  })

  it('rejects a page number of zero', async () => {
    await expect(listQuestions({ pageNumber: 0 })).rejects.toThrow(ListQuestionsValidationError)
  })

  it('rejects a page size that exceeds the maximum', async () => {
    await expect(listQuestions({ pageSize: 51 })).rejects.toThrow(ListQuestionsValidationError)
  })

  it('rejects a negative page size', async () => {
    await expect(listQuestions({ pageSize: -1 })).rejects.toThrow(ListQuestionsValidationError)
  })

  it('filters by certification exam identifier', async () => {
    await createQuestion({
      ...validCommand,
      certificationExamId: 'saa-c03',
      statement: `Filter cert ${Date.now()}`,
    })

    const page = await listQuestions({ certificationExamId: 'saa-c03', pageSize: 50 })
    expect(page.items.every((item) => item.certificationExamId === 'saa-c03')).toBe(true)
  })

  it('filters by question type and difficulty', async () => {
    await createQuestion({
      ...validCommand,
      type: QuestionTypeValues.MultipleChoice,
      difficulty: QuestionDifficultyValues.Hard,
      options: [
        { text: 'A', isCorrect: true },
        { text: 'B', isCorrect: true },
        { text: 'C', isCorrect: false },
      ],
      statement: `Filter type diff ${Date.now()}`,
    })

    const page = await listQuestions({ type: QuestionTypeValues.MultipleChoice, difficulty: QuestionDifficultyValues.Hard, pageSize: 50 })
    expect(page.items.length).toBeGreaterThanOrEqual(1)
    expect(page.items[0].type).toBe(QuestionTypeValues.MultipleChoice)
    expect(page.items[0].difficulty).toBe(QuestionDifficultyValues.Hard)
  })

  it('filters by search text case-insensitively', async () => {
    await createQuestion({
      ...validCommand,
      statement: `UNIQUE SEARCH TEXT ${Date.now()}`,
    })

    const page = await listQuestions({ searchText: 'unique search', pageSize: 50 })
    expect(page.items.some((item) => item.statement.includes('UNIQUE SEARCH TEXT'))).toBe(true)
  })

  it('filters by creation date range', async () => {
    const before = new Date().toISOString()
    await createQuestion({
      ...validCommand,
      statement: `Filter date ${Date.now()}`,
    })
    const after = new Date().toISOString()

    const page = await listQuestions({ createdFrom: before, createdTo: after, pageSize: 50 })
    expect(page.items.length).toBeGreaterThanOrEqual(1)
  })

  it('sorts by a whitelisted field in ascending order', async () => {
    for (let index = 0; index < 3; index += 1) {
      await createQuestion({
        ...validCommand,
        statement: `Sort asc ${String.fromCharCode(90 - index)} ${Date.now()}`,
      })
    }

    const page = await listQuestions({ sortBy: 'statement', sortDirection: 'asc', pageSize: 50 })
    const statements = page.items.map((item) => item.statement.toLowerCase())
    const sorted = [...statements].sort((a, b) => a.localeCompare(b))
    expect(statements).toEqual(sorted)
  })

  it('rejects an invalid question type filter', async () => {
    await expect(listQuestions({ type: 'invalid' as unknown as 'single_choice' })).rejects.toThrow(
      ListQuestionsValidationError,
    )
  })

  it('rejects an invalid sort field', async () => {
    await expect(listQuestions({ sortBy: 'unknown' })).rejects.toThrow(ListQuestionsValidationError)
  })

  it('rejects a createdFrom later than createdTo', async () => {
    await expect(
      listQuestions({ createdFrom: '2025-01-02', createdTo: '2025-01-01' }),
    ).rejects.toThrow(ListQuestionsValidationError)
  })

  it('deactivates an active question', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Deactivate ${Date.now()}`,
    })

    await new Promise((resolve) => {
      setTimeout(resolve, 5)
    })

    const response = await changeQuestionStatus(created.id, { isActive: false })

    expect(response.id).toBe(created.id)
    expect(response.isActive).toBe(false)
    expect(response.status).toBe('draft')
    expect(response.updatedAt).not.toBe(created.createdAt)
  })

  it('activates a deactivated question when structure is valid', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Activate ${Date.now()}`,
    })

    await changeQuestionStatus(created.id, { isActive: false })
    const response = await changeQuestionStatus(created.id, { isActive: true })

    expect(response.isActive).toBe(true)
    expect(response.status).toBe('active')
  })

  it('is idempotent when activating an already active question', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Idempotent active ${Date.now()}`,
    })

    const first = await changeQuestionStatus(created.id, { isActive: true })
    const second = await changeQuestionStatus(created.id, { isActive: true })

    expect(second.id).toBe(first.id)
    expect(second.isActive).toBe(true)
    expect(second.status).toBe('active')
  })

  it('rejects activation when the question has only one option', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Activate invalid ${Date.now()}`,
    })

    const admin = getAdminQuestions().find((question) => question.id === created.id)
    if (admin) {
      admin.options = [{ id: 'opt-1', questionId: created.id, text: 'Only', isCorrect: true, displayOrder: 0 }]
    }

    await expect(changeQuestionStatus(created.id, { isActive: true })).rejects.toThrow(
      QuestionStatusChangeValidationError,
    )
  })

  it('rejects activation for a non-existent question', async () => {
    await expect(changeQuestionStatus('missing-id', { isActive: true })).rejects.toThrow(QuestionNotFoundError)
  })

  it('deletes a question logically', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Delete ${Date.now()}`,
    })

    await new Promise((resolve) => {
      setTimeout(resolve, 5)
    })

    const response = await deleteQuestion(created.id)

    expect(response.id).toBe(created.id)
    expect(response.isActive).toBe(false)
    expect(response.deletedAt).not.toBe(created.createdAt)

    const after = getAdminQuestions().find((question) => question.id === created.id)
    expect(after?.status).toBe('archived')
    expect(after?.isActive).toBe(false)
  })

  it('is idempotent when deleting an already deleted question', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Delete idempotent ${Date.now()}`,
    })

    const first = await deleteQuestion(created.id)
    const second = await deleteQuestion(created.id)

    expect(second.id).toBe(first.id)
    expect(second.isActive).toBe(false)
  })

  it('excludes deleted questions from default list results', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Delete list ${Date.now()}`,
    })

    await deleteQuestion(created.id)

    const page = await listQuestions({ searchText: created.statement, pageSize: 50 })
    expect(page.items.some((item) => item.id === created.id)).toBe(false)
  })

  it('rejects deletion for an empty identifier', async () => {
    await expect(deleteQuestion('')).rejects.toThrow(InvalidQuestionIdentifierError)
  })

  it('rejects deletion for a non-existent question', async () => {
    await expect(deleteQuestion('missing-id')).rejects.toThrow(QuestionNotFoundError)
  })

  it('duplicates an active question as an inactive draft', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Duplicate source ${Date.now()}`,
    })

    const response = await duplicateQuestion(created.id)

    expect(response.id).not.toBe(created.id)
    expect(response.sourceQuestionId).toBe(created.id)
    expect(response.isActive).toBe(false)

    const original = getAdminQuestions().find((question) => question.id === created.id)
    const copy = getAdminQuestions().find((question) => question.id === response.id)

    expect(original?.statement).toBe(created.statement)
    expect(copy?.statement).toBe(created.statement)
    expect(copy?.type).toBe(created.type)
    expect(copy?.difficulty).toBe(created.difficulty)
    expect(copy?.isActive).toBe(false)
    expect(copy?.status).toBe('draft')
    expect(copy?.options.length).toBe(original?.options.length ?? 0)
    expect(copy?.options.some((option) => original?.options.some((o) => o.id === option.id))).toBe(false)
  })

  it('duplicates an inactive question', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Duplicate inactive ${Date.now()}`,
    })

    await changeQuestionStatus(created.id, { isActive: false })
    const response = await duplicateQuestion(created.id)

    expect(response.sourceQuestionId).toBe(created.id)
    expect(response.isActive).toBe(false)
  })

  it('does not duplicate an archived question', async () => {
    const created = await createQuestion({
      ...validCommand,
      statement: `Duplicate archived ${Date.now()}`,
    })

    await deleteQuestion(created.id)
    await expect(duplicateQuestion(created.id)).rejects.toThrow(QuestionNotFoundError)
  })

  it('rejects duplication for a non-existent question', async () => {
    await expect(duplicateQuestion('missing-id')).rejects.toThrow(QuestionNotFoundError)
  })
})
