import type { Question } from '@/models/Question'
import type { QuizResult } from '@/models/QuizResult'

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

function isAnswerCorrect(question: Question, selectedAnswers: string[]): boolean {
  if (selectedAnswers.length !== question.correctAnswers.length) {
    return false
  }

  const selectedSet = new Set(selectedAnswers)
  return question.correctAnswers.every((correctAnswer) => selectedSet.has(correctAnswer))
}
