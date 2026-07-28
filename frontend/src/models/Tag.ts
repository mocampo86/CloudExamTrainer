/**
 * Represents a tag used to classify questions.
 *
 * Tags are global and can be reused across different certification exams.
 * They are intentionally generic and not limited to any specific cloud
 * provider or service.
 */
export interface Tag {
  /** Unique identifier of the tag. */
  id: string
  /** Display name of the tag. */
  name: string
  /** Normalized URL-friendly identifier. Stored in lowercase. */
  slug: string
  /** Optional description of the tag. */
  description?: string
  /** Whether the tag is active and available for new content. */
  isActive: boolean
}
