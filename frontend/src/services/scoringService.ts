import type { Question } from '@/models/Question'
import type { QuizResult } from '@/models/QuizResult'
import type { TopicClassification, TopicResult } from '@/models/TopicResult'

export function calculateQuizResult(
  questions: Question[],
  answers: Record<string, string[]>,
): QuizResult {
  const totalQuestions = questions.length
  let correctCount = 0

  for (const question of questions) {
    const selectedAnswers = answers[question.id] ?? []
    if (isAnswerCorrect(question, selectedAnswers)) {
      correctCount++
    }
  }

  const incorrectCount = totalQuestions - correctCount
  const percentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  return { correctCount, incorrectCount, percentage, totalQuestions }
}

export function calculateTopicResults(
  questions: Question[],
  answers: Record<string, string[]>,
): TopicResult[] {
  const topicStats = new Map<string, { correctCount: number; totalQuestions: number }>()

  for (const question of questions) {
    const selectedAnswers = answers[question.id] ?? []
    const stats = topicStats.get(question.topic) ?? { correctCount: 0, totalQuestions: 0 }
    stats.totalQuestions++
    if (isAnswerCorrect(question, selectedAnswers)) {
      stats.correctCount++
    }
    topicStats.set(question.topic, stats)
  }

  const results: TopicResult[] = []
  for (const [topic, stats] of topicStats) {
    const percentage = stats.totalQuestions > 0
      ? Math.round((stats.correctCount / stats.totalQuestions) * 100)
      : 0
    results.push({
      topic,
      correctCount: stats.correctCount,
      totalQuestions: stats.totalQuestions,
      percentage,
      classification: classifyTopic(percentage),
    })
  }

  return results.sort((a, b) => a.percentage - b.percentage || a.topic.localeCompare(b.topic))
}

function classifyTopic(percentage: number): TopicClassification {
  if (percentage < 50) return 'high_attention'
  if (percentage < 70) return 'needs_review'
  if (percentage < 85) return 'good_level'
  return 'mastered'
}

function isAnswerCorrect(question: Question, selectedAnswers: string[]): boolean {
  if (selectedAnswers.length !== question.correctAnswers.length) {
    return false
  }

  const selectedSet = new Set(selectedAnswers)
  return question.correctAnswers.every((correctAnswer) => selectedSet.has(correctAnswer))
}
