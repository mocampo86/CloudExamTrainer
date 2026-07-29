import type { QuestionListItemDto } from './QuestionListItemDto'

/**
 * Paginated response for the list of questions endpoint.
 *
 * The structure is intentionally concrete so it can be represented directly
 * in OpenAPI without relying on TypeScript generics.
 */
export interface QuestionListResponse {
  /** Items on the current page. */
  items: QuestionListItemDto[]
  /** Current one-based page number. */
  pageNumber: number
  /** Number of items per page. */
  pageSize: number
  /** Total number of items across all pages. */
  totalItems: number
  /** Total number of pages. */
  totalPages: number
  /** Whether a previous page exists. */
  hasPreviousPage: boolean
  /** Whether a next page exists. */
  hasNextPage: boolean
}
