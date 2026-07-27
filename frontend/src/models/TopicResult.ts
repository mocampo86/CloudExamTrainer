export type TopicClassification = 'high_attention' | 'needs_review' | 'good_level' | 'mastered'

export interface TopicResult {
  topic: string
  correctCount: number
  totalQuestions: number
  percentage: number
  classification: TopicClassification
}
