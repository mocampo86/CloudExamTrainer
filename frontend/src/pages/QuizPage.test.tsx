import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/app/router'
import type { QuizAttemptResult } from '@/models/QuizAttemptResult'
import type { QuizSession } from '@/models/QuizSession'

function renderWithSession(session: QuizSession) {
  const router = createMemoryRouter(routes, {
    initialEntries: [{ pathname: '/quiz', state: { session } }],
  })
  const user = userEvent.setup()
  return { router, user, ...render(<RouterProvider router={router} />) }
}

const testSession: QuizSession = {
  id: 'test-session',
  topic: 'Mixed',
  certificationExamId: 'saa-c03',
  questionIds: ['sec001', 'db001'],
  currentIndex: 0,
  answers: {},
  status: 'in_progress',
  startedAt: '2026-07-26T00:00:00.000Z',
}

describe('QuizPage', () => {
  it('shows a message when there is no active session', () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/quiz'] })
    render(<RouterProvider router={router} />)
    expect(screen.getByText('No hay un cuestionario activo.')).toBeInTheDocument()
  })

  it('displays the first question and its options', () => {
    renderWithSession(testSession)
    expect(screen.getByText('Which Azure service helps protect web applications from common exploits?')).toBeInTheDocument()
    expect(screen.getByLabelText('Azure Firewall')).toBeInTheDocument()
    expect(screen.getByLabelText('Azure WAF')).toBeInTheDocument()
    expect(screen.getByLabelText('Azure Sentinel')).toBeInTheDocument()
    expect(screen.getByText('Pregunta 1 de 2')).toBeInTheDocument()
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '50')
  })

  it('registers a single choice answer and preserves it when returning', async () => {
    const { user } = renderWithSession(testSession)

    await user.click(screen.getByLabelText('Azure WAF'))
    expect(screen.getByLabelText('Azure WAF')).toBeChecked()

    await user.click(screen.getByRole('button', { name: /siguiente/i }))
    expect(screen.getByText('Which of the following are Azure database services?')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /anterior/i }))
    expect(screen.getByLabelText('Azure WAF')).toBeChecked()
  })

  it('registers multiple choice answers and preserves them when returning', async () => {
    const { user } = renderWithSession({ ...testSession, currentIndex: 1 })

    await user.click(screen.getByLabelText('Azure SQL Database'))
    await user.click(screen.getByLabelText('Azure Cosmos DB'))

    expect(screen.getByLabelText('Azure SQL Database')).toBeChecked()
    expect(screen.getByLabelText('Azure Cosmos DB')).toBeChecked()

    await user.click(screen.getByRole('button', { name: /anterior/i }))
    await user.click(screen.getByRole('button', { name: /siguiente/i }))

    expect(screen.getByLabelText('Azure SQL Database')).toBeChecked()
    expect(screen.getByLabelText('Azure Cosmos DB')).toBeChecked()
  })

  it('disables the Previous button on the first question', () => {
    renderWithSession(testSession)
    expect(screen.getByRole('button', { name: /anterior/i })).toBeDisabled()
  })

  it('shows the Finish button on the last question', () => {
    renderWithSession({ ...testSession, currentIndex: 1 })
    expect(screen.getByRole('button', { name: /finalizar$/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /siguiente/i })).not.toBeInTheDocument()
  })

  it('shows a confirmation with the number of pending questions when finishing', async () => {
    const { user } = renderWithSession({ ...testSession, currentIndex: 1 })

    await user.click(screen.getByRole('button', { name: /finalizar$/i }))

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Quedan 2 preguntas sin responder.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /cancelar/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /confirmar y finalizar/i })).toBeInTheDocument()
  })

  it('can cancel the finish confirmation and continue answering', async () => {
    const { user } = renderWithSession({ ...testSession, currentIndex: 1 })

    await user.click(screen.getByRole('button', { name: /finalizar$/i }))
    await user.click(screen.getByRole('button', { name: /cancelar/i }))

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /finalizar$/i })).toBeInTheDocument()
  })

  it('finishes directly and navigates to results when all questions are answered', async () => {
    const { user, router } = renderWithSession(testSession)

    await user.click(screen.getByLabelText('Azure WAF'))
    await user.click(screen.getByRole('button', { name: /siguiente/i }))
    await user.click(screen.getByLabelText('Azure SQL Database'))
    await user.click(screen.getByLabelText('Azure Cosmos DB'))

    await user.click(screen.getByRole('button', { name: /finalizar$/i }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/results'))

    const state = router.state.location.state as { attempt: QuizAttemptResult } | undefined
    expect(state?.attempt.session.status).toBe('completed')
    expect(state?.attempt.session.finishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    expect(state?.attempt.session.startedAt).toBe(testSession.startedAt)
    expect(state?.attempt.session.topic).toBe('Mixed')
    expect(state?.attempt.session.questionIds).toEqual(['sec001', 'db001'])
    expect(state?.attempt.session.answers).toEqual({
      sec001: ['opt2'],
      db001: ['opt1', 'opt2'],
    })
    expect(state?.attempt.certification.id).toBe('saa-c03')
    expect(state?.attempt.result.totalQuestions).toBe(2)
  })

  it('confirms finishing when there are pending questions and navigates to results', async () => {
    const { user, router } = renderWithSession({ ...testSession, currentIndex: 1 })

    await user.click(screen.getByRole('button', { name: /finalizar$/i }))
    await user.click(screen.getByRole('button', { name: /confirmar y finalizar/i }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/results'))

    const state = router.state.location.state as { attempt: QuizAttemptResult } | undefined
    expect(state?.attempt.session.status).toBe('completed')
    expect(state?.attempt.session.finishedAt).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)
    expect(state?.attempt.session.answers).toEqual({})
    expect(state?.attempt.certification.id).toBe('saa-c03')
  })
})
