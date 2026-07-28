export type QuestionType = 'single_choice' | 'multiple_choice'

export type QuestionDifficulty = 'easy' | 'medium' | 'hard'

export interface QuestionOption {
  id: string
  text: string
}

export interface Question {
  id: string
  /** Reference to the certification exam this question belongs to. */
  certificationExamId: string
  topic: string
  difficulty: QuestionDifficulty
  type: QuestionType
  question: string
  options: QuestionOption[]
  correctAnswers: string[]
  explanation: string
}
