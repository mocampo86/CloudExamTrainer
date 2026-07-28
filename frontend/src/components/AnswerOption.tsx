import type { QuestionOption } from '@/models/Question'

interface AnswerOptionProps {
  option: QuestionOption
  inputType: 'radio' | 'checkbox'
  name: string
  checked: boolean
  onChange: () => void
}

export function AnswerOption({ option, inputType, name, checked, onChange }: AnswerOptionProps) {
  const inputId = `${name}-${option.id}`

  return (
    <label
      htmlFor={inputId}
      className={`answer-option ${checked ? 'answer-option--selected' : ''}`}
    >
      <input
        id={inputId}
        type={inputType}
        name={name}
        value={option.id}
        checked={checked}
        onChange={onChange}
        className="answer-option__input"
      />
      <span className="answer-option__indicator" aria-hidden="true" />
      <span className="answer-option__text">{option.text}</span>
    </label>
  )
}
