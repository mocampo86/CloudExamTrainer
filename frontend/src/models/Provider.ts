/**
 * Represents a technology vendor that offers certification exams.
 *
 * A provider is intentionally generic and does not depend on any
 * specific cloud vendor, allowing the platform to support multiple
 * providers without modifying the model.
 */
export interface Provider {
  /** Unique identifier of the provider. */
  id: string
  /** Display name of the provider (e.g. "Amazon Web Services"). */
  name: string
  /** URL or path to the provider's logo image. */
  logo: string
  /** Brand color used for UI theming (CSS color value). */
  color: string
}
