import { useEffect, useMemo, useState, type FormEvent, type ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCertifications } from '@/api/certifications'
import type { CertificationListItemDto } from '@/models/CertificationDto'
import {
  getQuestionCountByTopic,
  getTopics,
  startQuizSession,
} from '@/services/questionService'

const DEFAULT_COUNTS = [5, 10, 20]

function formatCertificationLabel(certification: CertificationListItemDto): string {
  return `${certification.provider.name} — ${certification.name}`
}

export function HomePage() {
  const navigate = useNavigate()

  const [certifications, setCertifications] = useState<CertificationListItemDto[]>([])
  const [isLoadingCertifications, setIsLoadingCertifications] = useState(true)
  const [certificationError, setCertificationError] = useState<string | null>(null)
  const [certificationExamId, setCertificationExamId] = useState('')
  const [topic, setTopic] = useState('')
  const [count, setCount] = useState<number | ''>('')
  const [error, setError] = useState<string | null>(null)

  const loadCertifications = async () => {
    setIsLoadingCertifications(true)
    setCertificationError(null)
    const response = await getCertifications()

    if (response.status === 200) {
      setCertifications(response.body)
    } else {
      setCertificationError('No se pudieron cargar las certificaciones. Intenta de nuevo.')
    }

    setIsLoadingCertifications(false)
  }

  useEffect(() => {
    loadCertifications()
  }, [])

  useEffect(() => {
    if (certifications.length === 1 && !certificationExamId) {
      setCertificationExamId(certifications[0].id)
    }
  }, [certifications, certificationExamId])

  const topics = useMemo(() => {
    if (!certificationExamId) return []
    return getTopics(certificationExamId)
  }, [certificationExamId])

  const availableCount = topic
    ? getQuestionCountByTopic(topic, certificationExamId)
    : 0

  const countOptions = useMemo(() => {
    const options = DEFAULT_COUNTS.filter((option) => option <= availableCount)
    if (
      options.length === 0 &&
      availableCount > 0 &&
      !DEFAULT_COUNTS.includes(availableCount)
    ) {
      options.push(availableCount)
    }
    return options
  }, [availableCount])

  const handleCertificationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCertificationExamId(event.target.value)
    setTopic('')
    setCount('')
    setError(null)
  }

  const handleTopicChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTopic(event.target.value)
    setCount('')
    setError(null)
  }

  const handleCountChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setCount(Number(event.target.value))
    setError(null)
  }

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setError(null)

    if (!certificationExamId) {
      setError('Selecciona una certificación.')
      return
    }

    if (!topic) {
      setError('Selecciona un tema.')
      return
    }

    if (!count || count <= 0) {
      setError('Selecciona una cantidad válida.')
      return
    }

    const response = await startQuizSession({
      certificationExamId,
      topic,
      count,
    })

    if (response.status !== 200) {
      setError(response.body.error)
      return
    }

    navigate('/quiz', { state: { session: response.body } })
  }

  const canStart =
    certificationExamId && topic && count && count > 0 && count <= availableCount

  const hasCertifications = !isLoadingCertifications && certifications.length > 0

  return (
    <section className="home-page" aria-labelledby="home-title">
      <div className="hero">
        <h1 id="home-title" className="hero-title">
          Prepara tu certificación cloud
        </h1>
        <p className="hero-description">
          Selecciona una certificación, un tema y la cantidad de preguntas para comenzar a entrenar.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        aria-label="Configurar cuestionario"
        className="card quiz-form"
      >
        <div className="form-group">
          <label htmlFor="certification" className="form-label">
            Certificación
          </label>
          {isLoadingCertifications ? (
            <p className="info-text" role="status">
              Cargando certificaciones…
            </p>
          ) : certificationError ? (
            <div className="form-error">
              <p className="error-message" role="alert">
                {certificationError}
              </p>
              <button
                type="button"
                onClick={loadCertifications}
                className="btn btn-secondary"
              >
                Reintentar
              </button>
            </div>
          ) : !hasCertifications ? (
            <p className="info-text" role="status">
              No hay certificaciones disponibles.
            </p>
          ) : (
            <select
              id="certification"
              value={certificationExamId}
              onChange={handleCertificationChange}
              disabled={certifications.length === 1}
              className="form-control"
            >
              <option value="" disabled>
                Selecciona una certificación
              </option>
              {certifications.map((certification) => (
                <option key={certification.id} value={certification.id}>
                  {formatCertificationLabel(certification)}
                </option>
              ))}
            </select>
          )}
        </div>

        {hasCertifications && (
          <>
            <div className="form-group">
              <label htmlFor="topic" className="form-label">
                Tema
              </label>
              <select
                id="topic"
                value={topic}
                onChange={handleTopicChange}
                disabled={!certificationExamId}
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
                {availableCount} pregunta{availableCount !== 1 ? 's' : ''} disponible
                {availableCount !== 1 ? 's' : ''}
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
          </>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={!canStart}
        >
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
