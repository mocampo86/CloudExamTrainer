import type { CreateQuestionCommand } from '@/models/CreateQuestionCommand'
import type { CreateQuestionResponse } from '@/models/CreateQuestionResponse'
import type { UpdateQuestionCommand } from '@/models/UpdateQuestionCommand'
import type { UpdateQuestionResponse } from '@/models/UpdateQuestionResponse'
import type { QuestionDetailDto } from '@/models/QuestionDetailDto'
import type { ListQuestionsParams } from '@/models/ListQuestionsParams'
import type { QuestionListResponse } from '@/models/QuestionListResponse'
import type { ChangeQuestionStatusCommand } from '@/models/ChangeQuestionStatusCommand'
import type { ChangeQuestionStatusResponse } from '@/models/ChangeQuestionStatusResponse'
import type { DuplicateQuestionResponse } from '@/models/DuplicateQuestionResponse'
import type { DeleteQuestionResponse } from '@/models/DeleteQuestionResponse'
import {
  createQuestion as createQuestionInService,
  CreateQuestionValidationError,
  updateQuestion as updateQuestionInService,
  UpdateQuestionValidationError,
  getQuestionById,
  listQuestions as listQuestionsInService,
  changeQuestionStatus as changeQuestionStatusInService,
  deleteQuestion as deleteQuestionInService,
  duplicateQuestion as duplicateQuestionInService,
  QuestionNotFoundError,
  UpdateQuestionConcurrencyError,
  InvalidQuestionIdentifierError,
  ListQuestionsValidationError,
  QuestionStatusChangeValidationError,
} from '@/services/questionAdminService'

export type CreateQuestionApiResponse =
  | { status: 201; body: CreateQuestionResponse }
  | { status: 400; body: { error: string; details: string[] } }
  | { status: 404; body: { error: string } }
  | { status: 500; body: { error: string } }

export type UpdateQuestionApiResponse =
  | { status: 200; body: UpdateQuestionResponse }
  | { status: 400; body: { error: string; details: string[] } }
  | { status: 404; body: { error: string } }
  | { status: 409; body: { error: string } }
  | { status: 500; body: { error: string } }

export type GetQuestionByIdApiResponse =
  | { status: 200; body: QuestionDetailDto }
  | { status: 400; body: { error: string } }
  | { status: 404; body: { error: string } }
  | { status: 500; body: { error: string } }

export type ListQuestionsApiResponse =
  | { status: 200; body: QuestionListResponse }
  | { status: 400; body: { error: string; details: string[] } }
  | { status: 500; body: { error: string } }

export type ChangeQuestionStatusApiResponse =
  | { status: 200; body: ChangeQuestionStatusResponse }
  | { status: 400; body: { error: string; details: string[] } }
  | { status: 404; body: { error: string } }
  | { status: 409; body: { error: string } }
  | { status: 500; body: { error: string } }

export type DeleteQuestionApiResponse =
  | { status: 200; body: DeleteQuestionResponse }
  | { status: 204 }
  | { status: 400; body: { error: string } }
  | { status: 404; body: { error: string } }
  | { status: 409; body: { error: string } }
  | { status: 500; body: { error: string } }

export type DuplicateQuestionApiResponse =
  | { status: 201; body: DuplicateQuestionResponse }
  | { status: 400; body: { error: string } }
  | { status: 404; body: { error: string } }
  | { status: 409; body: { error: string } }
  | { status: 500; body: { error: string } }

function isNotFoundIssue(issue: { path: (string | number)[]; message: string }): boolean {
  const path = issue.path
  if (path.length !== 1) return false

  const field = path[0]
  if (field !== 'certificationExamId' && field !== 'examDomainId' && field !== 'topicId') {
    return false
  }

  return issue.message.includes('does not exist') || issue.message.includes('does not belong')
}

/**
 * GET /api/questions
 *
 * Returns a paginated list of active questions. Returns 200 with an empty page
 * when no questions exist, 400 for invalid pagination parameters and 500 for
 * unexpected failures.
 */
export async function listQuestionsEndpoint(
  params: ListQuestionsParams = {},
): Promise<ListQuestionsApiResponse> {
  try {
    const response = await listQuestionsInService(params)
    return { status: 200, body: response }
  } catch (error) {
    if (error instanceof ListQuestionsValidationError) {
      const details = error.issues.map((issue) => issue.message)
      return { status: 400, body: { error: 'Validation failed', details } }
    }

    const message = error instanceof Error ? error.message : 'Failed to list questions'
    return { status: 500, body: { error: message } }
  }
}

/**
 * PATCH /api/questions/:id/status
 *
 * Activates or deactivates a question. Returns 200 when the status changes,
 * 400 when the question cannot be activated, 404 when the question is not found
 * or is archived, 409 for functional conflicts and 500 for unexpected failures.
 */
export async function changeQuestionStatusEndpoint(
  id: string,
  command: ChangeQuestionStatusCommand,
): Promise<ChangeQuestionStatusApiResponse> {
  try {
    const response = await changeQuestionStatusInService(id, command)
    return { status: 200, body: response }
  } catch (error) {
    if (error instanceof InvalidQuestionIdentifierError) {
      return { status: 400, body: { error: error.message, details: [error.message] } }
    }

    if (error instanceof QuestionNotFoundError) {
      return { status: 404, body: { error: 'Question not found' } }
    }

    if (error instanceof QuestionStatusChangeValidationError) {
      const details = error.issues.map((issue) => issue.message)
      return { status: 400, body: { error: 'Activation validation failed', details } }
    }

    const message = error instanceof Error ? error.message : 'Failed to change question status'
    return { status: 500, body: { error: message } }
  }
}

/**
 * DELETE /api/questions/:id
 *
 * Logically deletes a question by setting its status to archived and marking
 * it as inactive. Returns 200 with the deletion details, 400 for an invalid
 * identifier, 404 when the question is not found and 500 for unexpected
 * failures.
 */
export async function deleteQuestionEndpoint(id: string): Promise<DeleteQuestionApiResponse> {
  try {
    const response = await deleteQuestionInService(id)
    return { status: 200, body: response }
  } catch (error) {
    if (error instanceof InvalidQuestionIdentifierError) {
      return { status: 400, body: { error: error.message } }
    }

    if (error instanceof QuestionNotFoundError) {
      return { status: 404, body: { error: 'Question not found' } }
    }

    const message = error instanceof Error ? error.message : 'Failed to delete question'
    return { status: 500, body: { error: message } }
  }
}

/**
 * POST /api/questions/:id/duplicate
 *
 * Duplicates an existing question creating a new inactive draft copy. Returns
 * 201 with the new question identifier, 400 for an invalid identifier, 404 when
 * the source question is not found or is archived, 409 for functional conflicts
 * and 500 for unexpected failures.
 */
export async function duplicateQuestionEndpoint(id: string): Promise<DuplicateQuestionApiResponse> {
  try {
    const response = await duplicateQuestionInService(id)
    return { status: 201, body: response }
  } catch (error) {
    if (error instanceof InvalidQuestionIdentifierError) {
      return { status: 400, body: { error: error.message } }
    }

    if (error instanceof QuestionNotFoundError) {
      return { status: 404, body: { error: 'Question not found' } }
    }

    const message = error instanceof Error ? error.message : 'Failed to duplicate question'
    return { status: 500, body: { error: message } }
  }
}

/**
 * GET /api/questions/:id
 *
 * Returns the full detail of a question. Returns 200 when the question exists,
 * 400 for an invalid identifier, 404 when the question is not found and 500 for
 * unexpected failures.
 */
export async function getQuestionByIdEndpoint(id: string): Promise<GetQuestionByIdApiResponse> {
  try {
    const response = await getQuestionById(id)
    return { status: 200, body: response }
  } catch (error) {
    if (error instanceof InvalidQuestionIdentifierError) {
      return { status: 400, body: { error: error.message } }
    }

    if (error instanceof QuestionNotFoundError) {
      return { status: 404, body: { error: 'Question not found' } }
    }

    const message = error instanceof Error ? error.message : 'Failed to get question'
    return { status: 500, body: { error: message } }
  }
}

/**
 * POST /api/questions
 *
 * Creates a new question in the question bank. Returns 201 when the question
 * is created, 400 for validation errors, 404 when the exam or domain/topic do
 * not exist, and 500 for unexpected failures.
 */
export async function createQuestionEndpoint(
  command: CreateQuestionCommand,
): Promise<CreateQuestionApiResponse> {
  try {
    const response = await createQuestionInService(command)
    return { status: 201, body: response }
  } catch (error) {
    if (error instanceof CreateQuestionValidationError) {
      const details = error.issues.map((issue) => issue.message)

      if (error.issues.some(isNotFoundIssue)) {
        return { status: 404, body: { error: 'Exam or category not found' } }
      }

      return { status: 400, body: { error: 'Validation failed', details } }
    }

    const message = error instanceof Error ? error.message : 'Failed to create question'
    return { status: 500, body: { error: message } }
  }
}

/**
 * PUT /api/questions/:id
 *
 * Updates an existing question in the question bank. Returns 200 when the
 * question is updated, 400 for validation errors, 404 when the question, exam
 * or domain/topic do not exist, 409 for concurrency conflicts and 500 for
 * unexpected failures.
 */
export async function updateQuestionEndpoint(
  id: string,
  command: UpdateQuestionCommand,
): Promise<UpdateQuestionApiResponse> {
  try {
    const response = await updateQuestionInService(id, command)
    return { status: 200, body: response }
  } catch (error) {
    if (error instanceof UpdateQuestionValidationError) {
      const details = error.issues.map((issue) => issue.message)

      if (error.issues.some(isNotFoundIssue)) {
        return { status: 404, body: { error: 'Exam or category not found' } }
      }

      return { status: 400, body: { error: 'Validation failed', details } }
    }

    if (error instanceof QuestionNotFoundError) {
      return { status: 404, body: { error: 'Question not found' } }
    }

    if (error instanceof UpdateQuestionConcurrencyError) {
      return { status: 409, body: { error: 'Concurrency conflict' } }
    }

    const message = error instanceof Error ? error.message : 'Failed to update question'
    return { status: 500, body: { error: message } }
  }
}
