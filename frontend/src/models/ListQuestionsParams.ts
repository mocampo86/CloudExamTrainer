import type { QuestionDifficulty, QuestionType } from './QuestionBank'

/**
 * Query parameters for the paginated list of questions.
 */
export interface ListQuestionsParams {
  /** One-based page number. */
  pageNumber?: number
  /** Number of items per page. */
  pageSize?: number
  /** Filter by certification exam identifier. */
  certificationExamId?: string
  /** Filter by exam domain / category identifier. */
  examDomainId?: string
  /** Filter by question type. */
  type?: QuestionType
  /** Filter by difficulty level. */
  difficulty?: QuestionDifficulty
  /** Filter by active flag. */
  isActive?: boolean
  /** Partial text search on the statement. */
  searchText?: string
  /** ISO 8601 lower bound for creation date (inclusive). */
  createdFrom?: string
  /** ISO 8601 upper bound for creation date (inclusive). */
  createdTo?: string
  /** Include logically deleted questions when administrative strategy allows. */
  includeDeleted?: boolean
  /** Field to sort by. */
  sortBy?: string
  /** Sort direction. */
  sortDirection?: 'asc' | 'desc'
}
