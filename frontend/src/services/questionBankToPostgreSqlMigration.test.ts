import { describe, it, expect, beforeEach } from 'vitest'
import { migrateQuestionBankToPostgreSql } from './questionBankToPostgreSqlMigration'
import { PostgreSqlQuestionRepository } from './questionRepository'
import { ApplicationDbContext } from './applicationDbContext'
import { QuestionStatusValues, QuestionTypeValues, QuestionDifficultyValues } from '@/models/QuestionBank'
import type { QuestionBank } from '@/models/QuestionBank'
import { isUuid } from './uuid'

function buildContext(): ApplicationDbContext {
  return new ApplicationDbContext({ connectionString: 'memory://tests' })
}

function buildQuestion(overrides: Partial<QuestionBank> = {}): QuestionBank {
  const id = overrides.id ?? `q-${Date.now()}-${Math.random().toString(36).slice(2)}`
  const now = new Date().toISOString()

  const base: QuestionBank = {
    id,
    certificationExamId: 'saa-c03',
    topicId: 'Compute',
    statement: `Migration test ${id}`,
    explanation: 'Explanation',
    type: QuestionTypeValues.SingleChoice,
    difficulty: QuestionDifficultyValues.Easy,
    status: QuestionStatusValues.Active,
    language: 'en',
    isActive: true,
    options: [
      { id: `${id}-opt-1`, questionId: id, text: 'Option A', isCorrect: true, displayOrder: 0 },
      { id: `${id}-opt-2`, questionId: id, text: 'Option B', isCorrect: false, displayOrder: 1 },
    ],
    tagIds: [],
    references: [],
    createdAt: now,
    updatedAt: now,
  }

  return { ...base, ...overrides }
}

describe('migrateQuestionBankToPostgreSql', () => {
  let repository: PostgreSqlQuestionRepository

  beforeEach(() => {
    repository = new PostgreSqlQuestionRepository(buildContext(), [])
  })

  it('rejects a non-array source', async () => {
    const report = await migrateQuestionBankToPostgreSql({}, repository)
    expect(report.success).toBe(false)
    expect(report.errors).toContain('Source must be an array of question banks')
  })

  it('migrates a valid question and assigns a stable UUID v5 identifier', async () => {
    const question = buildQuestion({ id: 'legacy-001' })

    const report = await migrateQuestionBankToPostgreSql([question], repository)

    expect(report.success).toBe(true)
    expect(report.totalQuestions).toBe(1)
    expect(report.migratedQuestions).toBe(1)
    expect(report.invalidQuestions).toBe(0)

    const page = await repository.getPagedAsync('saa-c03', {}, 1, 10)
    expect(page.items).toHaveLength(1)
    expect(isUuid(page.items[0].id)).toBe(true)
    expect(page.items[0].externalCode).toBe('legacy-001')
  })

  it('defaults certificationExamId to saa-c03 when missing', async () => {
    const question = buildQuestion({ id: 'legacy-002' })
    const source = { ...question, certificationExamId: undefined }

    const report = await migrateQuestionBankToPostgreSql([source], repository)

    expect(report.success).toBe(true)
    expect(report.migratedQuestions).toBe(1)

    const page = await repository.getPagedAsync('saa-c03', {}, 1, 10)
    expect(page.items[0].certificationExamId).toBe('saa-c03')
  })

  it('skips duplicate external codes on a second run', async () => {
    const question = buildQuestion({ id: 'legacy-003' })

    const first = await migrateQuestionBankToPostgreSql([question], repository)
    expect(first.migratedQuestions).toBe(1)
    expect(first.skippedQuestions).toBe(0)

    const second = await migrateQuestionBankToPostgreSql([question], repository)
    expect(second.migratedQuestions).toBe(0)
    expect(second.skippedQuestions).toBe(1)
    expect(second.success).toBe(true)

    const page = await repository.getPagedAsync('saa-c03', {}, 1, 10)
    expect(page.totalItems).toBe(1)
  })

  it('supports dry-run mode without writing', async () => {
    const question = buildQuestion({ id: 'legacy-004' })

    const report = await migrateQuestionBankToPostgreSql([question], repository, { dryRun: true })

    expect(report.success).toBe(true)
    expect(report.migratedQuestions).toBe(1)

    const page = await repository.getPagedAsync('saa-c03', {}, 1, 10)
    expect(page.totalItems).toBe(0)
  })

  it('supports reset mode by clearing the repository before migration', async () => {
    const firstQuestion = buildQuestion({ id: 'legacy-005', externalCode: 'first' })
    const secondQuestion = buildQuestion({ id: 'legacy-006', externalCode: 'second' })

    await repository.createAsync(firstQuestion)

    const report = await migrateQuestionBankToPostgreSql([secondQuestion], repository, { reset: true })

    expect(report.success).toBe(true)
    expect(report.migratedQuestions).toBe(1)

    const page = await repository.getPagedAsync('saa-c03', {}, 1, 10)
    expect(page.items).toHaveLength(1)
    expect(page.items[0].externalCode).toBe('second')
  })

  it('reports invalid business rules without stopping the batch', async () => {
    const validQuestion = buildQuestion({ id: 'legacy-007' })
    const invalidQuestion = buildQuestion({
      id: 'legacy-008',
      type: QuestionTypeValues.SingleChoice,
      options: [
        { id: 'opt-1', questionId: 'legacy-008', text: 'A', isCorrect: true, displayOrder: 0 },
      ],
    })

    const report = await migrateQuestionBankToPostgreSql([validQuestion, invalidQuestion], repository)

    expect(report.success).toBe(false)
    expect(report.migratedQuestions).toBe(1)
    expect(report.invalidQuestions).toBe(1)
  })

  it('warns about invalid reference URLs and continues', async () => {
    const question = buildQuestion({
      id: 'legacy-009',
      references: [
        { id: 'ref-1', questionId: 'legacy-009', title: 'Valid', url: 'https://example.com', referenceType: 'other', displayOrder: 0 },
        { id: 'ref-2', questionId: 'legacy-009', title: 'Invalid', url: 'not-a-url', referenceType: 'other', displayOrder: 1 },
      ],
    })

    const report = await migrateQuestionBankToPostgreSql([question], repository)

    expect(report.success).toBe(true)
    expect(report.migratedQuestions).toBe(1)
    expect(report.warnings.length).toBeGreaterThan(0)
    expect(report.invalidReferenceUrls).toContain('not-a-url')

    const page = await repository.getPagedAsync('saa-c03', {}, 1, 10)
    expect(page.items[0].references).toHaveLength(1)
    expect(page.items[0].references[0].url).toBe('https://example.com')
  })

  it('skips duplicate ids within the source and reports them', async () => {
    const question = buildQuestion({ id: 'duplicate-id' })

    const report = await migrateQuestionBankToPostgreSql([question, question], repository)

    expect(report.success).toBe(true)
    expect(report.migratedQuestions).toBe(1)
    expect(report.skippedQuestions).toBe(1)
    expect(report.duplicateQuestionIds).toContain('duplicate-id')
  })

  it('reports unknown certifications', async () => {
    const question = buildQuestion({ id: 'legacy-010', certificationExamId: 'unknown-cert' })

    const report = await migrateQuestionBankToPostgreSql([question], repository)

    expect(report.success).toBe(false)
    expect(report.errors.some((error) => error.includes('certificationExamId'))).toBe(true)
  })
})
