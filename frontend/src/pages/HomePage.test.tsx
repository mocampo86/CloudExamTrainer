import { describe, it, expect, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { getCertifications } from '@/api/certifications'
import { routes } from '@/app/router'

vi.mock('@/api/certifications', () => ({
  getCertifications: vi.fn(),
}))

const awsCertification = {
  id: 'saa-c03',
  code: 'SAA-C03',
  name: 'AWS Certified Solutions Architect - Associate',
  description: '',
  version: 'SAA-C03',
  difficulty: 'medium',
  imageUrl: '',
  isActive: true,
  provider: { id: 'aws', name: 'Amazon Web Services' },
}

function successResponse(body = [awsCertification]) {
  return { status: 200 as const, body }
}

function errorResponse() {
  return { status: 500 as const, body: { error: 'Failed' } }
}

function mockCertifications(response: { status: number; body: unknown }) {
  vi.mocked(getCertifications).mockResolvedValue(response as Awaited<ReturnType<typeof getCertifications>>)
}

function setupRouter() {
  return createMemoryRouter(routes, { initialEntries: ['/'] })
}

describe('Quiz setup', () => {
  it('creates a session and navigates to the quiz page with a valid configuration', async () => {
    mockCertifications(successResponse())
    const router = setupRouter()
    const user = userEvent.setup()

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(screen.getByLabelText('Tema')).toBeEnabled())
    await user.selectOptions(screen.getByLabelText('Tema'), 'Security')

    const countSelect = screen.getByLabelText('Cantidad de preguntas')
    await waitFor(() => expect(countSelect).toBeEnabled())
    await user.selectOptions(countSelect, '2')

    await user.click(screen.getByRole('button', { name: /iniciar cuestionario/i }))

    await waitFor(() => expect(router.state.location.pathname).toBe('/quiz'))

    const state = router.state.location.state as {
      session: {
        topic: string
        certificationExamId?: string
        questionIds: string[]
        currentIndex: number
        status: string
      }
    } | undefined
    await waitFor(() =>
      expect(state?.session).toMatchObject({
        topic: 'Security',
        certificationExamId: 'saa-c03',
        currentIndex: 0,
        status: 'in_progress',
      }),
    )
    expect(state?.session.questionIds).toHaveLength(2)
  })

  it('shows an error when no certification is selected', async () => {
    mockCertifications(successResponse([{ ...awsCertification, id: 'unset' }]))
    const router = setupRouter()

    render(<RouterProvider router={router} />)

    const form = await screen.findByRole('form', { name: /configurar cuestionario/i })
    fireEvent.submit(form)

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona una certificación.')
  })

  it('shows an error when no topic is selected', async () => {
    mockCertifications(successResponse())
    const router = setupRouter()

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(screen.getByLabelText('Tema')).toBeEnabled())

    const form = screen.getByRole('form', { name: 'Configurar cuestionario' })
    fireEvent.submit(form)

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona un tema.')
  })

  it('shows an error when no question count is selected', async () => {
    mockCertifications(successResponse())
    const router = setupRouter()
    const user = userEvent.setup()

    render(<RouterProvider router={router} />)

    await waitFor(() => expect(screen.getByLabelText('Tema')).toBeEnabled())
    await user.selectOptions(screen.getByLabelText('Tema'), 'Security')

    const form = screen.getByRole('form', { name: 'Configurar cuestionario' })
    fireEvent.submit(form)

    expect(router.state.location.pathname).toBe('/')
    expect(screen.getByRole('alert')).toHaveTextContent('Selecciona una cantidad válida.')
  })

  it('displays the number of available questions for the selected topic', async () => {
    mockCertifications(successResponse())

    render(<RouterProvider router={setupRouter()} />)

    const user = userEvent.setup()
    await waitFor(() => expect(screen.getByLabelText('Tema')).toBeEnabled())
    await user.selectOptions(screen.getByLabelText('Tema'), 'Security')

    expect(screen.getByText('2 preguntas disponibles')).toBeInTheDocument()
  })

  it('loads multiple certifications and allows selecting one', async () => {
    const secondCertification = {
      ...awsCertification,
      id: 'saa-c02',
      code: 'SAA-C02',
      name: 'AWS Certified Solutions Architect - Associate (legacy)',
      provider: { id: 'aws', name: 'Amazon Web Services' },
    }
    mockCertifications(successResponse([awsCertification, secondCertification]))

    render(<RouterProvider router={setupRouter()} />)

    const certificationSelect = await screen.findByLabelText(/certificación/i)
    expect(certificationSelect).toBeEnabled()
    expect(screen.getAllByRole('option').some((option) => option.textContent?.includes('AWS'))).toBe(true)
  })

  it('shows an error message when the API fails', async () => {
    mockCertifications(errorResponse())

    render(<RouterProvider router={setupRouter()} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('No se pudieron cargar las certificaciones')
  })

  it('shows a message when there are no active certifications', async () => {
    mockCertifications(successResponse([]))

    render(<RouterProvider router={setupRouter()} />)

    expect(await screen.findByText('No hay certificaciones disponibles.')).toBeInTheDocument()
  })

  it('clears topic and count when the certification changes', async () => {
    const secondCertification = {
      ...awsCertification,
      id: 'saa-c02',
      code: 'SAA-C02',
      name: 'AWS Certified Solutions Architect - Associate (legacy)',
      provider: { id: 'aws', name: 'Amazon Web Services' },
    }
    mockCertifications(successResponse([awsCertification, secondCertification]))
    const user = userEvent.setup()

    render(<RouterProvider router={setupRouter()} />)

    const certificationSelect = await screen.findByLabelText('Certificación')
    await user.selectOptions(certificationSelect, 'saa-c03')

    await waitFor(() => expect(screen.getByLabelText('Tema')).toBeEnabled())
    await user.selectOptions(screen.getByLabelText('Tema'), 'Security')

    const countSelect = screen.getByLabelText('Cantidad de preguntas')
    await waitFor(() => expect(countSelect).toBeEnabled())
    await user.selectOptions(countSelect, '2')

    await user.selectOptions(certificationSelect, 'saa-c02')

    expect((screen.getByLabelText('Tema') as HTMLSelectElement).value).toBe('')
    expect((countSelect as HTMLSelectElement).value).toBe('')
  })

  it('disables the start button until a valid selection is made', async () => {
    mockCertifications(successResponse())

    render(<RouterProvider router={setupRouter()} />)

    const startButton = screen.getByRole('button', { name: /iniciar cuestionario/i })
    expect(startButton).toBeDisabled()

    await waitFor(() => expect(screen.getByLabelText('Tema')).toBeEnabled())
    expect(startButton).toBeDisabled()
  })
})
