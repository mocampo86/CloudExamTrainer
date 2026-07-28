import { describe, it, expect } from 'vitest'
import { migrateQuestionBankContent } from './questionBankContentMigration'

const validSingleChoice = {
  id: 'v001',
  certificationExamId: 'saa-c03',
  topic: 'Compute',
  difficulty: 'easy',
  type: 'single_choice',
  question: 'Which Azure service lets you run containers without managing servers?',
  options: [
    { id: 'a', text: 'Azure Container Instances' },
    { id: 'b', text: 'Azure Virtual Machines' },
  ],
  correctAnswers: ['a'],
  explanation: 'Azure Container Instances runs containers without server management.',
}

const validMultipleChoice = {
  id: 'v002',
  certificationExamId: 'saa-c03',
  topic: 'Storage',
  difficulty: 'medium',
  type: 'multiple_choice',
  question: 'Which of the following are Azure Storage services?',
  options: [
    { id: 'a', text: 'Blob Storage' },
    { id: 'b', text: 'Queue Storage' },
    { id: 'c', text: 'SQL Database' },
  ],
  correctAnswers: ['a', 'b'],
  explanation: 'Blob and Queue Storage are Azure Storage services; SQL Database is not.',
}

describe('migrateQuestionBankContent', () => {
  it('migrates multiple legacy files and preserves counts', () => {
    const result = migrateQuestionBankContent(
      [
        { fileName: 'compute.json', content: [validSingleChoice] },
        { fileName: 'storage.json', content: [validMultipleChoice] },
      ],
      'saa-c03',
    )

    expect(result.success).toBe(true)
    expect(result.report.totalFiles).toBe(2)
    expect(result.report.totalQuestionsBefore).toBe(2)
    expect(result.report.totalQuestionsAfter).toBe(2)
    expect(result.report.migratedQuestions).toBe(2)
    expect(result.report.invalidQuestions).toBe(0)
    expect(result.report.omittedQuestions).toBe(0)
    expect(result.questionBanks).toHaveLength(2)
  })

  it('handles an empty source file list', () => {
    const result = migrateQuestionBankContent([], 'saa-c03')

    expect(result.success).toBe(true)
    expect(result.questionBanks).toEqual([])
    expect(result.report.totalQuestionsBefore).toBe(0)
    expect(result.report.totalQuestionsAfter).toBe(0)
  })

  it('migrates a single choice and a multiple choice question', () => {
    const result = migrateQuestionBankContent(
      [
        { fileName: 'single.json', content: [validSingleChoice] },
        { fileName: 'multi.json', content: [validMultipleChoice] },
      ],
      'saa-c03',
    )

    expect(result.success).toBe(true)

    const single = result.questionBanks.find((q) => q.id === 'v001')
    const multi = result.questionBanks.find((q) => q.id === 'v002')

    expect(single?.type).toBe('single_choice')
    expect(single?.options.filter((o) => o.isCorrect)).toHaveLength(1)
    expect(multi?.type).toBe('multiple_choice')
    expect(multi?.options.filter((o) => o.isCorrect)).toHaveLength(2)
  })

  it('reports an invalid file and does not include its questions', () => {
    const result = migrateQuestionBankContent(
      [
        { fileName: 'valid.json', content: [validSingleChoice] },
        { fileName: 'invalid.json', content: [{ id: 'bad' }] },
      ],
      'saa-c03',
    )

    expect(result.success).toBe(false)
    expect(result.report.totalQuestionsBefore).toBe(2)
    expect(result.report.totalQuestionsAfter).toBe(1)
    expect(result.report.entries.some((e) => e.fileName === 'invalid.json' && e.status === 'invalid')).toBe(true)
    expect(result.questionBanks).toHaveLength(1)
  })

  it('detects and omits duplicate question ids across files', () => {
    const result = migrateQuestionBankContent(
      [
        { fileName: 'a.json', content: [validSingleChoice] },
        { fileName: 'b.json', content: [{ ...validMultipleChoice, id: 'v001' }] },
      ],
      'saa-c03',
    )

    expect(result.success).toBe(true)
    expect(result.report.duplicateQuestionIds).toContain('v001')
    expect(result.report.totalQuestionsAfter).toBe(1)
    expect(result.questionBanks).toHaveLength(1)
  })

  it('fails when the target certification does not exist', () => {
    const result = migrateQuestionBankContent(
      [{ fileName: 'valid.json', content: [validSingleChoice] }],
      'non-existent-cert',
    )

    expect(result.success).toBe(false)
    expect(result.report.certificationMissing).toBe(true)
    expect(result.questionBanks).toHaveLength(0)
  })

  it('omits questions whose certification does not match the target', () => {
    const otherCert = { ...validSingleChoice, certificationExamId: 'other-cert' }

    const result = migrateQuestionBankContent(
      [
        { fileName: 'valid.json', content: [validSingleChoice] },
        { fileName: 'other.json', content: [otherCert] },
      ],
      'saa-c03',
    )

    expect(result.success).toBe(true)
    expect(result.questionBanks).toHaveLength(1)
    expect(result.questionBanks[0].certificationExamId).toBe('saa-c03')
  })
})
