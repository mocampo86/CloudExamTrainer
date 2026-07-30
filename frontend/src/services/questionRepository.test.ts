import { describe, it, expect, beforeEach } from 'vitest'
import {
  PostgreSqlQuestionRepository,
  questionRepository,
  QuestionNotFoundError,
  DuplicateExternalCodeError,
  InvalidCertificationError,
  QuestionConcurrencyError,
} from './questionRepository'
import { ApplicationDbContext } from './applicationDbContext'
import { QuestionStatusValues, QuestionTypeValues, QuestionDifficultyValues, type QuestionBank } from '@/models/QuestionBank'

function buildQuestion(overrides: Partial<QuestionBank> = {}): QuestionBank {
  const id = `q-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const now = new Date().toISOString()

  return {
    id,
    certificationExamId: 'saa-c03',
    externalCode: `ext-${id}`,
    statement: `Repository test ${id}`,
    explanation: 'Explanation',
    type: QuestionTypeValues.SingleChoice,
    difficulty: QuestionDifficultyValues.Easy,
    status: QuestionStatusValues.Draft,
    language: 'en',
    isActive: false,
    options: [
      { id: `${id}-opt-1`, questionId: id, text: 'Option A', isCorrect: true, displayOrder: 0 },
      { id: `${id}-opt-2`, questionId: id, text: 'Option B', isCorrect: false, displayOrder: 1 },
    ],
    tagIds: [],
    references: [],
    createdAt: now,
    updatedAt: now,
    ...overrides,
  }
}

describe('questionRepository', () => {
  it('exports a registered repository instance', () => {
    expect(questionRepository).toBeInstanceOf(PostgreSqlQuestionRepository)
  })
})

describe('PostgreSqlQuestionRepository', () => {
  let context: ApplicationDbContext
  let repository: PostgreSqlQuestionRepository

  beforeEach(() => {
    context = new ApplicationDbContext({ connectionString: 'memory://tests' })
    repository = new PostgreSqlQuestionRepository(context, [])
  })

  describe('getByIdAsync', () => {
    it('returns undefined when the question does not exist', async () => {
      const question = await repository.getByIdAsync('missing-id')
      expect(question).toBeUndefined()
    })

    it('throws for an empty id', async () => {
      await expect(repository.getByIdAsync('')).rejects.toThrow('id is required')
    })

    it('returns a created question by id', async () => {
      const created = buildQuestion()
      await repository.createAsync(created)

      const found = await repository.getByIdAsync(created.id)
      expect(found?.id).toBe(created.id)
    })
  })

  describe('getPagedAsync', () => {
    it('returns a paginated list with defaults', async () => {
      await repository.createAsync(buildQuestion({ statement: 'Paged A' }))

      const page = await repository.getPagedAsync(undefined, {})

      expect(page.pageNumber).toBe(1)
      expect(page.pageSize).toBe(10)
      expect(page.items.length).toBeGreaterThanOrEqual(1)
      expect(page.totalItems).toBeGreaterThanOrEqual(page.items.length)
      expect(page.totalPages).toBeGreaterThanOrEqual(1)
      expect(page.hasPreviousPage).toBe(false)
    })

    it('paginates through questions', async () => {
      for (let index = 0; index < 3; index += 1) {
        await repository.createAsync(buildQuestion({ statement: `Paged ${index}` }))
      }

      const pageOne = await repository.getPagedAsync(undefined, {}, 1, 2)
      expect(pageOne.items).toHaveLength(2)
      expect(pageOne.hasNextPage).toBe(true)

      const pageTwo = await repository.getPagedAsync(undefined, {}, 2, 2)
      expect(pageTwo.items.length).toBeGreaterThanOrEqual(1)
      expect(pageTwo.hasPreviousPage).toBe(true)
    })

    it('filters by certification exam identifier', async () => {
      await repository.createAsync(buildQuestion({ certificationExamId: 'saa-c03' }))
      await repository.createAsync(buildQuestion({ certificationExamId: 'saa-c03', externalCode: 'ext-second' }))

      const page = await repository.getPagedAsync('saa-c03', {}, 1, 50)
      expect(page.items.every((item) => item.certificationExamId === 'saa-c03')).toBe(true)
    })

    it('filters by status', async () => {
      await repository.createAsync(buildQuestion({ status: QuestionStatusValues.Active, isActive: true }))
      await repository.createAsync(buildQuestion({ status: QuestionStatusValues.Draft, externalCode: 'ext-draft' }))

      const page = await repository.getPagedAsync(undefined, { status: QuestionStatusValues.Active }, 1, 50)
      expect(page.items.every((item) => item.status === QuestionStatusValues.Active)).toBe(true)
    })

    it('filters by isActive', async () => {
      await repository.createAsync(buildQuestion({ isActive: true, status: QuestionStatusValues.Active }))
      await repository.createAsync(buildQuestion({ isActive: false, status: QuestionStatusValues.Draft, externalCode: 'ext-inactive' }))

      const page = await repository.getPagedAsync(undefined, { isActive: true }, 1, 50)
      expect(page.items.every((item) => item.isActive)).toBe(true)
    })

    it('filters by topicId', async () => {
      await repository.createAsync(buildQuestion({ topicId: 'Compute' }))
      await repository.createAsync(buildQuestion({ topicId: 'Databases', externalCode: 'ext-databases' }))

      const page = await repository.getPagedAsync(undefined, { topicId: 'Compute' }, 1, 50)
      expect(page.items.every((item) => item.topicId === 'Compute')).toBe(true)
    })

    it('filters by examDomainId', async () => {
      await repository.createAsync(buildQuestion({ examDomainId: 'DomainA' }))
      await repository.createAsync(buildQuestion({ examDomainId: 'DomainB', externalCode: 'ext-b' }))

      const page = await repository.getPagedAsync(undefined, { examDomainId: 'DomainA' }, 1, 50)
      expect(page.items.every((item) => item.examDomainId === 'DomainA')).toBe(true)
    })

    it('filters by tagId', async () => {
      await repository.createAsync(buildQuestion({ tagIds: ['tag-1', 'tag-2'] }))
      await repository.createAsync(buildQuestion({ tagIds: ['tag-3'], externalCode: 'ext-tag-3' }))

      const page = await repository.getPagedAsync(undefined, { tagId: 'tag-1' }, 1, 50)
      expect(page.items.every((item) => item.tagIds.includes('tag-1'))).toBe(true)
    })

    it('filters by search text case-insensitively', async () => {
      await repository.createAsync(buildQuestion({ statement: 'UNIQUE SEARCH TEXT' }))

      const page = await repository.getPagedAsync(undefined, { searchText: 'unique search' }, 1, 50)
      expect(page.items.some((item) => item.statement.includes('UNIQUE SEARCH TEXT'))).toBe(true)
    })

    it('filters by creation date range', async () => {
      const before = new Date().toISOString()
      await repository.createAsync(buildQuestion())
      const after = new Date().toISOString()

      const page = await repository.getPagedAsync(undefined, { createdFrom: before, createdTo: after }, 1, 50)
      expect(page.items.length).toBeGreaterThanOrEqual(1)
    })

    it('excludes deleted questions by default', async () => {
      const question = buildQuestion()
      await repository.createAsync(question)
      await repository.softDeleteAsync(question.id)

      const page = await repository.getPagedAsync(undefined, {}, 1, 50)
      expect(page.items.some((item) => item.id === question.id)).toBe(false)
    })

    it('includes deleted questions when includeDeleted is true', async () => {
      const question = buildQuestion()
      await repository.createAsync(question)
      await repository.softDeleteAsync(question.id)

      const page = await repository.getPagedAsync(undefined, { includeDeleted: true }, 1, 50)
      expect(page.items.some((item) => item.id === question.id)).toBe(true)
    })

    it('sorts by createdAt, updatedAt and displayOrder without crashing', async () => {
      for (let index = 0; index < 3; index += 1) {
        await repository.createAsync(buildQuestion())
      }

      const byCreated = await repository.getPagedAsync(undefined, { sortBy: 'createdAt', sortDirection: 'asc' }, 1, 50)
      expect(byCreated.items).toHaveLength(3)

      const byUpdated = await repository.getPagedAsync(undefined, { sortBy: 'updatedAt', sortDirection: 'desc' }, 1, 50)
      expect(byUpdated.items).toHaveLength(3)

      const byDisplayOrder = await repository.getPagedAsync(
        undefined,
        { sortBy: 'displayOrder', sortDirection: 'asc' },
        1,
        50,
      )
      expect(byDisplayOrder.items).toHaveLength(3)
    })

    it('rejects invalid pagination', async () => {
      await expect(repository.getPagedAsync(undefined, {}, 0, 10)).rejects.toThrow('page must be a positive integer')
      await expect(repository.getPagedAsync(undefined, {}, 1, 0)).rejects.toThrow('pageSize must be a positive integer')
      await expect(repository.getPagedAsync(undefined, {}, 1, 51)).rejects.toThrow('pageSize must be a positive integer')
    })
  })

  describe('createAsync', () => {
    it('creates a question and assigns timestamps from the context', async () => {
      const question = buildQuestion({ createdAt: 'ignore', updatedAt: 'ignore' })

      const created = await repository.createAsync(question)

      expect(created.id).toBe(question.id)
      expect(created.createdAt).toMatch(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      expect(created.updatedAt).toBe(created.createdAt)
    })

    it('rejects a question for a non-existent certification', async () => {
      const question = buildQuestion({ certificationExamId: 'unknown-cert' })
      await expect(repository.createAsync(question)).rejects.toThrow(InvalidCertificationError)
    })

    it('rejects a duplicate external code within the same certification', async () => {
      const first = buildQuestion({ externalCode: 'shared-code' })
      await repository.createAsync(first)

      const second = buildQuestion({ externalCode: 'shared-code' })
      await expect(repository.createAsync(second)).rejects.toThrow(DuplicateExternalCodeError)
    })

    it('rejects a single_choice question without exactly one correct option', async () => {
      const question = buildQuestion({
        type: QuestionTypeValues.SingleChoice,
        options: [
          { id: 'opt-1', questionId: 'q-1', text: 'A', isCorrect: true, displayOrder: 0 },
          { id: 'opt-2', questionId: 'q-1', text: 'B', isCorrect: true, displayOrder: 1 },
        ],
      })
      await expect(repository.createAsync(question)).rejects.toThrow('single_choice questions must have exactly one correct option')
    })

    it('rejects a multiple_choice question with fewer than two correct options', async () => {
      const question = buildQuestion({
        type: QuestionTypeValues.MultipleChoice,
        options: [
          { id: 'opt-1', questionId: 'q-1', text: 'A', isCorrect: true, displayOrder: 0 },
          { id: 'opt-2', questionId: 'q-1', text: 'B', isCorrect: false, displayOrder: 1 },
        ],
      })
      await expect(repository.createAsync(question)).rejects.toThrow('multiple_choice questions must have at least two correct options')
    })
  })

  describe('updateAsync', () => {
    it('rejects an update with a stale concurrency token', async () => {
      const created = await repository.createAsync(buildQuestion())

      await expect(
        repository.updateAsync({
          ...created,
          statement: 'Stale update',
          updatedAt: '2020-01-01T00:00:00.000Z',
        }),
      ).rejects.toThrow(QuestionConcurrencyError)
    })

    it('updates an existing question and refreshes updatedAt', async () => {
      const created = await repository.createAsync(buildQuestion())

      await new Promise((resolve) => setTimeout(resolve, 5))

      const updated = await repository.updateAsync({
        ...created,
        statement: 'Updated statement',
      })

      expect(updated.statement).toBe('Updated statement')
      expect(updated.updatedAt).not.toBe(created.createdAt)
      expect(updated.createdAt).toBe(created.createdAt)
    })

    it('rejects an update for a non-existent question', async () => {
      const question = buildQuestion()
      await expect(repository.updateAsync(question)).rejects.toThrow(QuestionNotFoundError)
    })

    it('rejects an update for a deleted question', async () => {
      const created = await repository.createAsync(buildQuestion())
      await repository.softDeleteAsync(created.id)

      await expect(repository.updateAsync({ ...created, statement: 'Updated' })).rejects.toThrow(QuestionNotFoundError)
    })

    it('rejects an external code duplicated within the same certification', async () => {
      await repository.createAsync(buildQuestion({ externalCode: 'first' }))
      const second = await repository.createAsync(buildQuestion({ externalCode: 'second' }))

      await expect(
        repository.updateAsync({ ...second, externalCode: 'first' }),
      ).rejects.toThrow(DuplicateExternalCodeError)
    })
  })

  describe('updateStatusAsync', () => {
    it('activates a question with valid options', async () => {
      const created = await repository.createAsync(buildQuestion({ status: QuestionStatusValues.Draft, isActive: false }))

      const updated = await repository.updateStatusAsync(created.id, QuestionStatusValues.Active, true)

      expect(updated.status).toBe(QuestionStatusValues.Active)
      expect(updated.isActive).toBe(true)
    })

    it('throws for a non-existent question', async () => {
      await expect(
        repository.updateStatusAsync('missing-id', QuestionStatusValues.Active, true),
      ).rejects.toThrow(QuestionNotFoundError)
    })

    it('rejects activating a question without valid correct options', async () => {
      const invalidSeedQuestion = buildQuestion({
        status: QuestionStatusValues.Draft,
        isActive: false,
        options: [
          { id: 'opt-1', questionId: 'q-invalid', text: 'Only', isCorrect: true, displayOrder: 0 },
        ],
      })
      const seededRepository = new PostgreSqlQuestionRepository(context, [invalidSeedQuestion])

      await expect(
        seededRepository.updateStatusAsync(invalidSeedQuestion.id, QuestionStatusValues.Active, true),
      ).rejects.toThrow('questions must have at least two options')
    })
  })

  describe('softDeleteAsync', () => {
    it('deletes a question logically', async () => {
      const created = await repository.createAsync(buildQuestion())

      const deleted = await repository.softDeleteAsync(created.id)

      expect(deleted.status).toBe(QuestionStatusValues.Archived)
      expect(deleted.isActive).toBe(false)

      const found = await repository.getByIdAsync(created.id)
      expect(found?.status).toBe(QuestionStatusValues.Archived)
    })

    it('throws for a non-existent question', async () => {
      await expect(repository.softDeleteAsync('missing-id')).rejects.toThrow(QuestionNotFoundError)
    })
  })

  describe('existsByExternalCodeAsync', () => {
    it('returns true when the external code exists in the certification', async () => {
      const created = await repository.createAsync(buildQuestion({ externalCode: 'exists' }))

      const exists = await repository.existsByExternalCodeAsync(created.certificationExamId, 'exists')
      expect(exists).toBe(true)
    })

    it('excludes the provided question id', async () => {
      const created = await repository.createAsync(buildQuestion({ externalCode: 'exclude' }))

      const exists = await repository.existsByExternalCodeAsync(created.certificationExamId, 'exclude', created.id)
      expect(exists).toBe(false)
    })

    it('returns false when the external code does not exist', async () => {
      const exists = await repository.existsByExternalCodeAsync('saa-c03', 'missing')
      expect(exists).toBe(false)
    })
  })
})
