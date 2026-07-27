import { AnswerOption } from './AnswerOption'
import type { Question } from '@/models/Question'
import type { QuizAnswer } from '@/models/QuizAnswer'

interface QuestionCardProps {
  question: Question
  selectedAnswerIds: QuizAnswer
  onAnswerChange: (answerIds: QuizAnswer) => void
}

export function QuestionCard({ question, selectedAnswerIds, onAnswerChange }: QuestionCardProps) {
  const isMultiple = question.type === 'multiple_choice'

  const handleToggle = (optionId: string) => {
    if (isMultiple) {
      const selected = new Set(selectedAnswerIds)
      if (selected.has(optionId)) {
        selected.delete(optionId)
      } else {
        selected.add(optionId)
      }
      onAnswerChange([...selected])
    } else {
      onAnswerChange([optionId])
    }
  }

  return (
    <article aria-label="Pregunta">
      <h2>{question.question}</h2>
      <ul>
        {question.options.map((option) => (
          <li key={option.id}>
            <AnswerOption
              option={option}
              inputType={isMultiple ? 'checkbox' : 'radio'}
              name={question.id}
              checked={selectedAnswerIds.includes(option.id)}
              onChange={() => handleToggle(option.id)}
            />
          </li>
        ))}
      </ul>
    </article>
  )
}
