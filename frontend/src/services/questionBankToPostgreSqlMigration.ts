import { questionBankSchema } from '@/schemas/questionBankSchema'
import { certifications } from '@/data/certifications'
import type { QuestionBank } from '@/models/QuestionBank'
import type { IQuestionRepository } from './questionRepository'
import { generateUuidV5, isUuid } from './uuid'

const DEFAULT_CERTIFICATION_EXAM_ID = 'saa-c03'
const ALLOWED_URL_SCHEMES = ['http:', 'https:']

export interface QuestionBankPostgreSqlMigrationOptions {
  /** If true, only reports what would be migrated without writing to the repository. */
  dryRun?: boolean
  /** If true and the repository supports it, clears existing migrated questions before importing. */
  reset?: boolean
  /** Certification used when a question does not declare one. */
  defaultCertificationExamId?: string
}

export interface MigrationReport {
  success: boolean
  totalQuestions: number
  migratedQuestions: number
  skippedQuestions: number
  invalidQuestions: number
  duplicateQuestionIds: string[]
  invalidReferenceUrls: string[]
  warnings: string[]
  errors: string[]
}

function isValidReferenceUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    return ALLOWED_URL_SCHEMES.includes(parsed.protocol)
  } catch {
    return false
  }
}

function normalizeSourceQuestions(
  source: unknown,
  defaultCertificationExamId: string,
  warnings: string[],
  invalidReferenceUrls: string[],
): unknown[] {
  if (!Array.isArray(source)) {
    return []
  }

  return source.map((item) => {
    if (!item || typeof item !== 'object') {
      return item
    }

    const question: Record<string, unknown> = { ...(item as Record<string, unknown>) }

    if (typeof question.certificationExamId !== 'string' || question.certificationExamId.trim().length === 0) {
      question.certificationExamId = defaultCertificationExamId
    }

    const references = question.references
    if (Array.isArray(references)) {
      const kept: unknown[] = []

      for (const reference of references) {
        if (reference && typeof reference === 'object' && typeof (reference as Record<string, unknown>).url === 'string') {
          const url = String((reference as Record<string, unknown>).url)
          const title = String((reference as Record<string, unknown>).title ?? 'unknown')

          if (isValidReferenceUrl(url)) {
            kept.push(reference)
          } else {
            const questionId = String(question.id ?? 'unknown')
            invalidReferenceUrls.push(url)
            warnings.push(`Invalid reference URL "${url}" for reference "${title}" in question "${questionId}"`)
          }
        } else {
          kept.push(reference)
        }
      }

      question.references = kept
    }

    return question
  })
}

function buildCrossReferenceSets(questions: QuestionBank[]) {
  const domains = new Map<string, Set<string>>()
  const topics = new Map<string, Set<string>>()

  for (const question of questions) {
    if (question.examDomainId) {
      const set = domains.get(question.certificationExamId) ?? new Set<string>()
      set.add(question.examDomainId)
      domains.set(question.certificationExamId, set)
    }

    if (question.topicId) {
      const set = topics.get(question.certificationExamId) ?? new Set<string>()
      set.add(question.topicId)
      topics.set(question.certificationExamId, set)
    }
  }

  return { domains, topics }
}

function validateCrossReferences(
  question: QuestionBank,
  domains: Map<string, Set<string>>,
  topics: Map<string, Set<string>>,
): string[] {
  const errors: string[] = []

  if (!certifications.some((certification) => certification.id === question.certificationExamId)) {
    errors.push(`certificationExamId "${question.certificationExamId}" does not exist`)
  }

  if (question.examDomainId && !domains.get(question.certificationExamId)?.has(question.examDomainId)) {
    errors.push(`examDomainId "${question.examDomainId}" does not belong to certification "${question.certificationExamId}"`)
  }

  if (question.topicId && !topics.get(question.certificationExamId)?.has(question.topicId)) {
    errors.push(`topicId "${question.topicId}" does not belong to certification "${question.certificationExamId}"`)
  }

  return errors
}

function buildMigratedQuestion(question: QuestionBank): QuestionBank {
  const originalId = question.id
  const stableId = isUuid(originalId)
    ? originalId
    : generateUuidV5(`${question.certificationExamId}:${originalId}`)

  return {
    ...question,
    id: stableId,
    externalCode: question.externalCode ?? originalId,
    options: question.options.map((option, index) => ({
      ...option,
      questionId: stableId,
      displayOrder: option.displayOrder ?? index,
    })),
    references: question.references.map((reference) => ({
      ...reference,
      questionId: stableId,
    })),
    tagIds: [...question.tagIds],
  }
}

export async function migrateQuestionBankToPostgreSql(
  source: unknown,
  repository: IQuestionRepository,
  options: QuestionBankPostgreSqlMigrationOptions = {},
): Promise<MigrationReport> {
  const report: MigrationReport = {
    success: true,
    totalQuestions: 0,
    migratedQuestions: 0,
    skippedQuestions: 0,
    invalidQuestions: 0,
    duplicateQuestionIds: [],
    invalidReferenceUrls: [],
    warnings: [],
    errors: [],
  }

  const defaultCertificationExamId = options.defaultCertificationExamId ?? DEFAULT_CERTIFICATION_EXAM_ID

  try {
    if (options.reset) {
      await repository.resetAsync()
    }
  } catch (error) {
    report.errors.push(`Failed to reset repository: ${error instanceof Error ? error.message : String(error)}`)
    report.success = false
    return report
  }

  if (!Array.isArray(source)) {
    report.errors.push('Source must be an array of question banks')
    report.success = false
    return report
  }

  report.totalQuestions = source.length

  const preprocessed = normalizeSourceQuestions(
    source,
    defaultCertificationExamId,
    report.warnings,
    report.invalidReferenceUrls,
  )

  const seenKeys = new Set<string>()
  const seenExternalCodeKeys = new Set<string>()
  const parsedQuestions: QuestionBank[] = []

  for (const item of preprocessed) {
    const parsed = questionBankSchema.safeParse(item)

    if (!parsed.success) {
      report.invalidQuestions += 1
      for (const issue of parsed.error.issues) {
        report.errors.push(`${issue.path.join('.')}: ${issue.message}`)
      }
      continue
    }

    const question = parsed.data
    const key = `${question.certificationExamId}:${question.id}`
    const externalCode = question.externalCode ?? question.id
    const externalCodeKey = `${question.certificationExamId}:${externalCode}`

    if (seenKeys.has(key)) {
      report.duplicateQuestionIds.push(question.id)
      report.warnings.push(`Duplicate question id "${question.id}" within certification "${question.certificationExamId}"`)
      report.skippedQuestions += 1
      continue
    }

    if (seenExternalCodeKeys.has(externalCodeKey)) {
      report.warnings.push(
        `Duplicate external code "${externalCode}" within certification "${question.certificationExamId}"`,
      )
      report.skippedQuestions += 1
      continue
    }

    seenKeys.add(key)
    seenExternalCodeKeys.add(externalCodeKey)
    parsedQuestions.push(question)
  }

  const migratedQuestions: QuestionBank[] = []

  for (const question of parsedQuestions) {
    try {
      migratedQuestions.push(buildMigratedQuestion(question))
    } catch (error) {
      report.invalidQuestions += 1
      report.errors.push(
        `Failed to generate stable identifier for question "${question.id}": ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  const { domains, topics } = buildCrossReferenceSets(migratedQuestions)

  for (const question of migratedQuestions) {
    const crossReferenceErrors = validateCrossReferences(question, domains, topics)

    if (crossReferenceErrors.length > 0) {
      report.invalidQuestions += 1
      report.errors.push(...crossReferenceErrors.map((message) => `Question "${question.id}": ${message}`))
      continue
    }

    if (options.dryRun) {
      report.migratedQuestions += 1
      continue
    }

    try {
      const exists = await repository.existsByExternalCodeAsync(
        question.certificationExamId,
        question.externalCode as string,
      )

      if (exists) {
        report.skippedQuestions += 1
        continue
      }

      await repository.createAsync(question)
      report.migratedQuestions += 1
    } catch (error) {
      report.invalidQuestions += 1
      report.errors.push(
        `Failed to migrate question "${question.id}": ${error instanceof Error ? error.message : String(error)}`,
      )
    }
  }

  if (report.errors.length > 0) {
    report.success = false
  }

  return report
}
