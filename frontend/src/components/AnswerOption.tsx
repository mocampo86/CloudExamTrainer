import type { QuestionOption } from '@/models/Question'

interface AnswerOptionProps {
  option: QuestionOption
  inputType: 'radio' | 'checkbox'
  name: string
  checked: boolean
  onChange: () => void
}

export function AnswerOption({ option, inputType, name, checked, onChange }: AnswerOptionProps) {
  return (
    <label>
      <input
        type={inputType}
        name={name}
        value={option.id}
        checked={checked}
        onChange={onChange}
      />
      {option.text}
    </label>
  )
}
