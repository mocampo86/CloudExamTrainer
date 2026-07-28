import { migrateLegacyQuestionsToQuestionBank, QUESTION_BANK_VERSION } from './questionBankMigration'
import { questionBanksSchema } from '../schemas/questionBankSchema'
import { certifications } from '../data/certifications'
import type { QuestionBank } from '../models/QuestionBank'

export interface SourceFileInput {
  fileName: string
  content: unknown
}

export interface ContentMigrationEntry {
  fileName: string
  status: 'migrated' | 'invalid'
  questionCount: number
  errors?: string[]
}

export interface ContentMigrationReport {
  version: number
  certificationExamId: string
  totalFiles: number
  totalQuestionsBefore: number
  totalQuestionsAfter: number
  entries: ContentMigrationEntry[]
  duplicateQuestionIds: string[]
  certificationMissing: boolean
  invalidQuestions: number
  migratedQuestions: number
  omittedQuestions: number
}

export interface ContentMigrationResult {
  success: boolean
  report: ContentMigrationReport
  questionBanks: QuestionBank[]
}

function countQuestions(content: unknown): number {
  if (!Array.isArray(content)) return 0
  return content.filter((item) => item && typeof item === 'object' && !Array.isArray(item)).length
}

/**
 * Migrates a set of legacy question files into a single `QuestionBank` array.
 *
 * The function validates the target certification, migrates each file,
 * detects cross-file duplicates by `certificationExamId:id`, validates
 * the final array and returns a detailed report.
 */
export function migrateQuestionBankContent(
  files: SourceFileInput[],
  certificationExamId: string = 'saa-c03',
): ContentMigrationResult {
  const certificationMissing = !certifications.some(
    (certification) => certification.id === certificationExamId && certification.isActive,
  )

  const entries: ContentMigrationEntry[] = []
  const allMigrated: QuestionBank[] = []
  let totalQuestionsBefore = 0

  if (certificationMissing) {
    return {
      success: false,
      questionBanks: [],
      report: {
        version: QUESTION_BANK_VERSION,
        certificationExamId,
        totalFiles: files.length,
        totalQuestionsBefore: 0,
        totalQuestionsAfter: 0,
        entries,
        duplicateQuestionIds: [],
        certificationMissing: true,
        invalidQuestions: 0,
        migratedQuestions: 0,
        omittedQuestions: 0,
      },
    }
  }

  let invalidQuestions = 0
  let omittedByCertification = 0

  for (const file of files) {
    const beforeCount = countQuestions(file.content)
    totalQuestionsBefore += beforeCount

    const migration = migrateLegacyQuestionsToQuestionBank(file.content)

    if (!migration.success) {
      invalidQuestions += beforeCount
      entries.push({
        fileName: file.fileName,
        status: 'invalid',
        questionCount: beforeCount,
        errors: migration.errors,
      })
      continue
    }

    const compatible: QuestionBank[] = []
    const incompatible: QuestionBank[] = []

    for (const question of migration.data) {
      if (question.certificationExamId === certificationExamId) {
        compatible.push(question)
      } else {
        incompatible.push(question)
      }
    }

    omittedByCertification += incompatible.length

    entries.push({
      fileName: file.fileName,
      status: 'migrated',
      questionCount: compatible.length,
    })

    allMigrated.push(...compatible)
  }

  const seenKeys = new Set<string>()
  const duplicateKeys = new Set<string>()
  const questionBanks: QuestionBank[] = []

  for (const question of allMigrated) {
    const key = `${question.certificationExamId}:${question.id}`
    if (seenKeys.has(key)) {
      duplicateKeys.add(key)
      continue
    }
    seenKeys.add(key)
    questionBanks.push(question)
  }

  const duplicateQuestionIds = [...duplicateKeys].map((key) => key.split(':')[1] ?? key)
  const omittedByDuplicate = allMigrated.length - questionBanks.length
  const omittedQuestions = omittedByCertification + omittedByDuplicate

  const hasInvalidEntries = entries.some((entry) => entry.status === 'invalid')
  const validated = questionBanksSchema.safeParse(questionBanks)

  if (!validated.success || hasInvalidEntries) {
    return {
      success: false,
      questionBanks,
      report: {
        version: QUESTION_BANK_VERSION,
        certificationExamId,
        totalFiles: files.length,
        totalQuestionsBefore,
        totalQuestionsAfter: questionBanks.length,
        entries,
        duplicateQuestionIds,
        certificationMissing: false,
        invalidQuestions,
        migratedQuestions: questionBanks.length,
        omittedQuestions,
      },
    }
  }

  return {
    success: true,
    questionBanks: validated.data,
    report: {
      version: QUESTION_BANK_VERSION,
      certificationExamId,
      totalFiles: files.length,
      totalQuestionsBefore,
      totalQuestionsAfter: questionBanks.length,
      entries,
      duplicateQuestionIds,
      certificationMissing: false,
      invalidQuestions,
      migratedQuestions: questionBanks.length,
      omittedQuestions,
    },
  }
}
