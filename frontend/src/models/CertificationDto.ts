/**
 * Summary representation of a Provider exposed by the certifications API.
 */
export interface ProviderSummaryDto {
  id: string
  name: string
}

/**
 * DTO for a certification in the public certifications list.
 */
export interface CertificationListItemDto {
  id: string
  code: string
  name: string
  description: string
  version: string
  difficulty: string
  imageUrl: string
  isActive: boolean
  provider: ProviderSummaryDto
}

/**
 * DTO for the public certification detail endpoint.
 *
 * Currently it matches the list item, but it is kept as a separate
 * contract so the API can evolve without affecting the list response.
 */
export type CertificationDetailDto = CertificationListItemDto
