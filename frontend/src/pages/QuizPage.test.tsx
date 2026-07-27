import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/app/router'
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
  questionIds: ['sec001', 'db001'],
  currentIndex: 0,
  answers: {},
  status: 'in_progress',
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
})
