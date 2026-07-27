export type QuizSessionStatus = 'not_started' | 'in_progress' | 'completed'

export interface QuizSession {
  id: string
  topic: string
  questionIds: string[]
  currentIndex: number
  answers: Record<string, string[]>
  status: QuizSessionStatus
  startedAt: string
  finishedAt?: string
}

function generateSessionId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

export function createQuizSession(topic: string, questionIds: string[]): QuizSession {
  return {
    id: generateSessionId(),
    topic,
    questionIds,
    currentIndex: 0,
    answers: {},
    status: 'in_progress',
    startedAt: new Date().toISOString(),
  }
}
