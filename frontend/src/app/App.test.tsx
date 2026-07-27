import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { routes } from './router'

describe('App navigation', () => {
  it('renders the home page by default', () => {
    const testRouter = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={testRouter} />)
    expect(screen.getByText('Cloud Exam Trainer')).toBeInTheDocument()
  })

  it('navigates to the quiz page without reloading', async () => {
    const testRouter = createMemoryRouter(routes, { initialEntries: ['/'] })
    render(<RouterProvider router={testRouter} />)
    await userEvent.click(screen.getByRole('link', { name: /cuestionario/i }))
    expect(screen.getByText('No hay un cuestionario activo.')).toBeInTheDocument()
  })

  it('renders Not Found for unknown routes', () => {
    const testRouter = createMemoryRouter(routes, { initialEntries: ['/unknown'] })
    render(<RouterProvider router={testRouter} />)
    expect(screen.getByText('Página no encontrada')).toBeInTheDocument()
  })
})
