import { beforeAll, describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/app/router'
import { createAttemptResult } from '@/services/resultService'
import type { QuizAttemptResult } from '@/models/QuizAttemptResult'
import type { QuizSession } from '@/models/QuizSession'

const completedSession: QuizSession = {
  id: 'test-session',
  topic: 'Mixed',
  certificationExamId: 'saa-c03',
  questionIds: ['sec001', 'db001'],
  currentIndex: 1,
  answers: {
    sec001: ['opt2'],
    db001: ['opt1', 'opt2'],
  },
  status: 'completed',
  startedAt: '2026-07-26T00:00:00.000Z',
  finishedAt: '2026-07-26T00:05:00.000Z',
}

const securitySession: QuizSession = {
  id: 'test-session-security',
  topic: 'Security',
  certificationExamId: 'saa-c03',
  questionIds: ['sec001', 'sec002'],
  currentIndex: 1,
  answers: {
    sec001: ['opt2'],
    sec002: ['opt1'],
  },
  status: 'completed',
  startedAt: '2026-07-26T00:00:00.000Z',
  finishedAt: '2026-07-26T00:05:00.000Z',
}

let completedAttempt: QuizAttemptResult
let securityAttempt: QuizAttemptResult

beforeAll(async () => {
  completedAttempt = await createAttemptResult(completedSession)
  securityAttempt = await createAttemptResult(securitySession)
})

function renderWithAttempt(attempt?: QuizAttemptResult) {
  const initialEntries = attempt
    ? [{ pathname: '/results', state: { attempt } }]
    : ['/results']
  const router = createMemoryRouter(routes, { initialEntries })
  const user = userEvent.setup()
  return { router, user, ...render(<RouterProvider router={router} />) }
}

describe('ResultsPage', () => {
  it('shows a message when there is no attempt', () => {
    renderWithAttempt()
    expect(screen.getByText('No hay resultados disponibles.')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /volver al inicio/i })).toBeInTheDocument()
  })

  it('renders the score and percentage', () => {
    renderWithAttempt(completedAttempt)
    expect(screen.getByText(/puntaje:/i)).toHaveTextContent('Puntaje: 2 de 2')
    expect(screen.getByText(/porcentaje:/i)).toHaveTextContent('Porcentaje: 100%')
    expect(screen.getByText(/correctas: 2 \| incorrectas: 0/i)).toBeInTheDocument()
  })

  it('renders the certification name and provider', () => {
    renderWithAttempt(completedAttempt)
    expect(screen.getByText(/certificación:/i)).toHaveTextContent(
      'Certificación: Amazon Web Services — AWS Certified Solutions Architect - Associate',
    )
  })

  it('renders topic results sorted by percentage', () => {
    renderWithAttempt(completedAttempt)
    expect(screen.getByText(/desempeño por tema/i)).toBeInTheDocument()
    const listItems = screen.getAllByRole('listitem')
    expect(listItems.some((item) => item.textContent === 'Databases: 1 de 1 (100%)')).toBe(true)
    expect(listItems.some((item) => item.textContent === 'Security: 1 de 1 (100%)')).toBe(true)
  })

  it('renders recommendations based on the score', () => {
    renderWithAttempt(completedAttempt)
    expect(screen.getByText(/recomendaciones/i)).toBeInTheDocument()
    expect(screen.getByText(/excelente desempeño/i)).toBeInTheDocument()
  })

  it('navigates to home when clicking "Volver al inicio"', async () => {
    const { user } = renderWithAttempt(completedAttempt)
    await user.click(screen.getByRole('button', { name: /volver al inicio/i }))
    expect(screen.getByText('Cloud Exam Trainer')).toBeInTheDocument()
  })

  it('navigates to a new quiz when clicking "Repetir cuestionario"', async () => {
    const { user } = renderWithAttempt(securityAttempt)
    await user.click(screen.getByRole('button', { name: /repetir cuestionario/i }))
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /cuestionario/i })).toBeInTheDocument()
    })
    expect(
      screen.getByText((_, element) => element?.textContent === 'Pregunta 1 de 2'),
    ).toBeInTheDocument()
  })
})
