import { describe, it, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from '@/app/router'

describe('Quiz setup', () => {
  it('creates a session and navigates to the quiz page with a valid configuration', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    const user = userEvent.setup()

    render(<RouterProvider router={router} />)

    await user.selectOptions(screen.getByLabelText(/tema/i), 'Security')

    const countSelect = screen.getByLabelText(/cantidad de preguntas/i)
    await waitFor(() => expect(countSelect).toBeEnabled())
    await user.selectOptions(countSelect, '2')

    await user.click(screen.getByRole('button', { name: /iniciar cuestionario/i }))

    expect(router.state.location.pathname).toBe('/quiz')

    const state = router.state.location.state as { session: { topic: string; questionIds: string[]; currentIndex: number; status: string } } | undefined
    expect(state?.session).toMatchObject({
      topic: 'Security',
      currentIndex: 0,
      status: 'in_progress',
    })
    expect(state?.session.questionIds).toHaveLength(2)
  })

  it('shows an error when no topic is selected', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    const user = userEvent.setup()

    render(<RouterProvider router={router} />)

    await user.click(screen.getByRole('button', { name: /iniciar cuestionario/i }))

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona un tema.')
  })

  it('shows an error when no question count is selected', async () => {
    const router = createMemoryRouter(routes, { initialEntries: ['/'] })
    const user = userEvent.setup()

    render(<RouterProvider router={router} />)

    await user.selectOptions(screen.getByLabelText(/tema/i), 'Security')

    await user.click(screen.getByRole('button', { name: /iniciar cuestionario/i }))

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona una cantidad válida.')
  })

  it('displays the number of available questions for the selected topic', async () => {
    render(<RouterProvider router={createMemoryRouter(routes, { initialEntries: ['/'] })} />)

    const user = userEvent.setup()
    await user.selectOptions(screen.getByLabelText(/tema/i), 'Security')

    expect(screen.getByText('2 preguntas disponibles')).toBeInTheDocument()
  })
})
