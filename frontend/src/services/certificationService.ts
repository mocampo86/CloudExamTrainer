import type { CertificationExam } from '@/models/CertificationExam'
import type { Provider } from '@/models/Provider'
import type { CertificationDetailDto, CertificationListItemDto } from '@/models/CertificationDto'
import { certifications, providers } from '@/data/certifications'

function findProvider(providerId: string): Provider | undefined {
  return providers.find((provider) => provider.id === providerId)
}

function toCertificationDto(certification: CertificationExam): CertificationListItemDto {
  const provider = findProvider(certification.providerId)

  return {
    id: certification.id,
    code: certification.code,
    name: certification.name,
    description: certification.description,
    version: certification.version,
    difficulty: certification.difficulty,
    imageUrl: certification.imageUrl,
    isActive: certification.isActive,
    provider: {
      id: provider?.id ?? certification.providerId,
      name: provider?.name ?? certification.providerId,
    },
  }
}

/**
 * Returns all active certifications sorted by name ascending.
 */
export async function getAvailableCertifications(): Promise<CertificationListItemDto[]> {
  return certifications
    .filter((certification) => certification.isActive)
    .map(toCertificationDto)
    .sort((a, b) => a.name.localeCompare(b.name))
}

/**
 * Finds an active certification by its id.
 */
export async function getCertificationById(id: string): Promise<CertificationDetailDto | null> {
  const certification = certifications.find(
    (certification) => certification.id === id && certification.isActive,
  )
  return certification ? toCertificationDto(certification) : null
}

/**
 * Finds an active certification by its code.
 */
export async function getCertificationByCode(code: string): Promise<CertificationDetailDto | null> {
  const certification = certifications.find(
    (certification) => certification.code === code && certification.isActive,
  )
  return certification ? toCertificationDto(certification) : null
}
