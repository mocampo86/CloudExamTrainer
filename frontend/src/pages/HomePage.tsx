import { useMemo, useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  createQuizSession,
  getQuestionCountByTopic,
  getTopics,
} from '@/services/questionService'

const DEFAULT_COUNTS = [5, 10, 20]

export function HomePage() {
  const navigate = useNavigate()
  const topics = useMemo(() => getTopics(), [])
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)

  const availableCount = topic ? getQuestionCountByTopic(topic) : 0

  const countOptions = useMemo(() => {
    const options = DEFAULT_COUNTS.filter((option) => option <= availableCount)
    if (options.length === 0 && availableCount > 0 && !DEFAULT_COUNTS.includes(availableCount)) {
      options.push(availableCount)
    }
    return options
  }, [availableCount])

  const handleTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTopic(event.target.value)
    setCount('')
    setError(null)
  }

  const handleCountChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCount(Number(event.target.value))
    setError(null)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!topic) {
      setError('Selecciona un tema.')
      return
    }

    if (!count || count <= 0) {
      setError('Selecciona una cantidad válida.')
      return
    }

    if (count > getQuestionCountByTopic(topic)) {
      setError('La cantidad seleccionada supera las preguntas disponibles.')
      return
    }

    const session = createQuizSession({ topic, count })
    navigate('/quiz', { state: { session } })
  }

  return (
    <section className="home-page" aria-labelledby="home-title">
      <div className="hero">
        <h1 id="home-title" className="hero-title">
          Prepara tu certificación cloud
        </h1>
        <p className="hero-description">
          Selecciona un tema y la cantidad de preguntas para comenzar a entrenar.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        aria-label="Configurar cuestionario"
        className="card quiz-form"
      >
        <div className="form-group">
          <label htmlFor="topic" className="form-label">
            Tema
          </label>
          <select
            id="topic"
            value={topic}
            onChange={handleTopicChange}
            className="form-control"
          >
            <option value="">Selecciona un tema</option>
            {topics.map((topicName) => (
              <option key={topicName} value={topicName}>
                {topicName}
              </option>
            ))}
          </select>
        </div>

        {topic && (
          <p className="info-text">
            {availableCount} pregunta{availableCount !== 1 ? 's' : ''} disponible{availableCount !== 1 ? 's' : ''}
          </p>
        )}

        <div className="form-group">
          <label htmlFor="count" className="form-label">
            Cantidad de preguntas
          </label>
          <select
            id="count"
            value={count}
            onChange={handleCountChange}
            disabled={!topic || countOptions.length === 0}
            className="form-control"
          >
            <option value="">Selecciona cantidad</option>
            {countOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {topic && countOptions.length === 0 && (
          <p className="info-text">No hay suficientes preguntas para este tema.</p>
        )}

        <button type="submit" className="btn btn-primary">
          Iniciar cuestionario
        </button>

        {error && (
          <p className="error-message" role="alert">
            {error}
          </p>
        )}
      </form>
    </section>
  )
}
