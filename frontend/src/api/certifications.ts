import type {
  CertificationDetailDto,
  CertificationListItemDto,
} from '@/models/CertificationDto'
import {
  getAvailableCertifications,
  getCertificationByCode,
  getCertificationById,
} from '@/services/certificationService'

export type ApiResponse<T> =
  | { status: 200; body: T }
  | { status: 400; body: { error: string } }
  | { status: 404; body: { error: string } }
  | { status: 500; body: { error: string } }

function isValidIdentifier(value: string): boolean {
  return value.trim().length > 0
}

/**
 * GET /api/certifications
 *
 * Returns the list of active certifications ordered by name ascending.
 */
export async function getCertifications(): Promise<ApiResponse<CertificationListItemDto[]>> {
  try {
    const certifications = await getAvailableCertifications()
    return { status: 200, body: certifications }
  } catch {
    return { status: 500, body: { error: 'Failed to retrieve certifications' } }
  }
}

/**
 * GET /api/certifications/:id
 *
 * Returns an active certification by id. Responds with 404 when the
 * certification does not exist or is inactive.
 */
export async function getCertification(id: string): Promise<ApiResponse<CertificationDetailDto>> {
  if (!isValidIdentifier(id)) {
    return { status: 400, body: { error: 'Invalid certification identifier' } }
  }

  try {
    const certification = await getCertificationById(id)
    if (!certification) {
      return { status: 404, body: { error: 'Certification not found' } }
    }
    return { status: 200, body: certification }
  } catch {
    return { status: 500, body: { error: 'Failed to retrieve certification' } }
  }
}

/**
 * GET /api/certifications/code/:code
 *
 * Returns an active certification by code.
 */
export async function getCertificationByCodeEndpoint(
  code: string,
): Promise<ApiResponse<CertificationDetailDto>> {
  if (!isValidIdentifier(code)) {
    return { status: 400, body: { error: 'Invalid certification code' } }
  }

  try {
    const certification = await getCertificationByCode(code)
    if (!certification) {
      return { status: 404, body: { error: 'Certification not found' } }
    }
    return { status: 200, body: certification }
  } catch {
    return { status: 500, body: { error: 'Failed to retrieve certification' } }
  }
}
