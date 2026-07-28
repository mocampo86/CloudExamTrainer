import { describe, it, expect } from 'vitest'
import {
  migrateLegacyQuestionsToQuestionBank,
  migrateQuestionBankToLegacy,
  QUESTION_BANK_VERSION,
} from './questionBankMigration'
import { QuestionTypeValues } from '@/models/QuestionBank'
import type { Question as LegacyQuestion } from '@/models/Question'

const legacySingleChoice: LegacyQuestion = {
  id: 'q001',
  certificationExamId: 'saa-c03',
  topic: 'Azure Compute',
  difficulty: 'easy',
  type: 'single_choice',
  question: 'Which Azure service lets you run containers without managing servers?',
  options: [
    { id: 'opt1', text: 'Azure Container Instances' },
    { id: 'opt2', text: 'Azure Virtual Machines' },
    { id: 'opt3', text: 'Azure App Service' },
  ],
  correctAnswers: ['opt1'],
  explanation: 'Azure Container Instances runs containers without requiring server management.',
}

const legacyMultipleChoice: LegacyQuestion = {
  id: 'q002',
  certificationExamId: 'saa-c03',
  topic: 'Azure Storage',
  difficulty: 'medium',
  type: 'multiple_choice',
  question: 'Which of the following are Azure Storage services?',
  options: [
    { id: 'opt1', text: 'Blob Storage' },
    { id: 'opt2', text: 'File Storage' },
    { id: 'opt3', text: 'SQL Database' },
    { id: 'opt4', text: 'Queue Storage' },
  ],
  correctAnswers: ['opt1', 'opt2', 'opt4'],
  explanation: 'Blob, File and Queue Storage are Azure Storage services; SQL Database is a relational database service.',
}

describe('migrateLegacyQuestionsToQuestionBank', () => {
  it('migrates a single choice question', () => {
    const result = migrateLegacyQuestionsToQuestionBank([legacySingleChoice])
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data).toHaveLength(1)
      const migrated = result.data[0]
      expect(migrated.id).toBe('q001')
      expect(migrated.statement).toBe(legacySingleChoice.question)
      expect(migrated.topicId).toBe('Azure Compute')
      expect(migrated.options).toHaveLength(3)
      expect(migrated.options.filter((o) => o.isCorrect)).toHaveLength(1)
      expect(migrated.options[1].isCorrect).toBe(false)
      expect(migrated.options[1].displayOrder).toBe(1)
    }
  })

  it('migrates a multiple choice question', () => {
    const result = migrateLegacyQuestionsToQuestionBank([legacyMultipleChoice])
    expect(result.success).toBe(true)

    if (result.success) {
      const migrated = result.data[0]
      expect(migrated.type).toBe(QuestionTypeValues.MultipleChoice)
      expect(migrated.options.filter((o) => o.isCorrect)).toHaveLength(3)
      expect(migrated.options.some((o) => !o.isCorrect)).toBe(true)
    }
  })

  it('migrates an empty array', () => {
    const result = migrateLegacyQuestionsToQuestionBank([])
    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data).toEqual([])
    }
  })

  it('rejects invalid legacy data', () => {
    const result = migrateLegacyQuestionsToQuestionBank([{ id: 'bad' }])
    expect(result.success).toBe(false)
  })

  it('rejects a multiple choice question with all correct answers', () => {
    const invalid = {
      ...legacyMultipleChoice,
      correctAnswers: ['opt1', 'opt2', 'opt3', 'opt4'],
    }
    const result = migrateLegacyQuestionsToQuestionBank([invalid])
    expect(result.success).toBe(false)
  })
})

describe('migrateQuestionBankToLegacy', () => {
  it('downgrades a migrated question back to legacy shape', () => {
    const up = migrateLegacyQuestionsToQuestionBank([legacySingleChoice])
    expect(up.success).toBe(true)

    if (up.success) {
      const down = migrateQuestionBankToLegacy(up.data[0])
      expect(down.id).toBe(legacySingleChoice.id)
      expect(down.question).toBe(legacySingleChoice.question)
      expect(down.options).toEqual(legacySingleChoice.options)
      expect(down.correctAnswers).toEqual(legacySingleChoice.correctAnswers)
    }
  })
})

describe('QUESTION_BANK_VERSION', () => {
  it('exposes the current question bank schema version', () => {
    expect(QUESTION_BANK_VERSION).toBe(2)
  })
})
