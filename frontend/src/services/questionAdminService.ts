import type { QuestionBank } from '@/models/QuestionBank'
import type { CreateQuestionCommand } from '@/models/CreateQuestionCommand'
import type { CreateQuestionResponse } from '@/models/CreateQuestionResponse'
import type { UpdateQuestionCommand } from '@/models/UpdateQuestionCommand'
import type { UpdateQuestionResponse } from '@/models/UpdateQuestionResponse'
import type { QuestionDetailDto, QuestionDetailOptionDto } from '@/models/QuestionDetailDto'
import type { ListQuestionsParams } from '@/models/ListQuestionsParams'
import type { QuestionListItemDto } from '@/models/QuestionListItemDto'
import type { QuestionListResponse } from '@/models/QuestionListResponse'
import type { ChangeQuestionStatusCommand } from '@/models/ChangeQuestionStatusCommand'
import type { ChangeQuestionStatusResponse } from '@/models/ChangeQuestionStatusResponse'
import type { DuplicateQuestionResponse } from '@/models/DuplicateQuestionResponse'
import type { DeleteQuestionResponse } from '@/models/DeleteQuestionResponse'
import { QuestionStatusValues, QuestionTypeValues, QuestionDifficultyValues, type QuestionType, type QuestionDifficulty } from '@/models/QuestionBank'
import { createCreateQuestionCommandSchema } from '@/schemas/createQuestionCommandSchema'
import { createUpdateQuestionCommandSchema } from '@/schemas/updateQuestionCommandSchema'
import { certifications } from '@/data/certifications'
import questionBanks from '@/data/questionBanks'
import type { ZodIssue } from 'zod'

export interface CreateQuestionValidationContext {
  /** Known certification exam ids used as a foreign-key substitute. */
  certificationExamIds?: ReadonlySet<string>
  /** Map from certification exam id to the set of valid domain ids for that exam. */
  domainIdsByCertification?: ReadonlyMap<string, ReadonlySet<string>>
  /** Map from certification exam id to the set of valid topic ids for that exam. */
  topicIdsByCertification?: ReadonlyMap<string, ReadonlySet<string>>
}

export class CreateQuestionValidationError extends Error {
  readonly issues: ZodIssue[]

  constructor(message: string, issues: ZodIssue[]) {
    super(message)
    this.name = 'CreateQuestionValidationError'
    this.issues = issues
  }
}

export class UpdateQuestionValidationError extends Error {
  readonly issues: ZodIssue[]

  constructor(message: string, issues: ZodIssue[]) {
    super(message)
    this.name = 'UpdateQuestionValidationError'
    this.issues = issues
  }
}

export class QuestionNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QuestionNotFoundError'
  }
}

export class UpdateQuestionConcurrencyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'UpdateQuestionConcurrencyError'
  }
}

export class InvalidQuestionIdentifierError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidQuestionIdentifierError'
  }
}

export class ListQuestionsValidationError extends Error {
  readonly issues: ZodIssue[]

  constructor(message: string, issues: ZodIssue[]) {
    super(message)
    this.name = 'ListQuestionsValidationError'
    this.issues = issues
  }
}

export class QuestionStatusChangeValidationError extends Error {
  readonly issues: ZodIssue[]

  constructor(message: string, issues: ZodIssue[]) {
    super(message)
    this.name = 'QuestionStatusChangeValidationError'
    this.issues = issues
  }
}


const adminQuestions: QuestionBank[] = []

function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`
}

function buildTopicIdsByCertification(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()

  questionBanks.forEach((question) => {
    if (!question.topicId) return

    const ids = map.get(question.certificationExamId) ?? new Set<string>()
    ids.add(question.topicId)
    map.set(question.certificationExamId, ids)
  })

  return map
}

function buildDomainIdsByCertification(): Map<string, Set<string>> {
  const map = new Map<string, Set<string>>()

  questionBanks.forEach((question) => {
    if (!question.examDomainId) return

    const ids = map.get(question.certificationExamId) ?? new Set<string>()
    ids.add(question.examDomainId)
    map.set(question.certificationExamId, ids)
  })

  return map
}

function getDefaultValidationContext(): CreateQuestionValidationContext {
  return {
    certificationExamIds: new Set(certifications.map((certification) => certification.id)),
    domainIdsByCertification: new Map(),
    topicIdsByCertification: buildTopicIdsByCertification(),
  }
}

function getActivationValidationContext(): CreateQuestionValidationContext {
  return {
    certificationExamIds: new Set(
      certifications.filter((certification) => certification.isActive).map((certification) => certification.id),
    ),
    domainIdsByCertification: buildDomainIdsByCertification(),
    topicIdsByCertification: buildTopicIdsByCertification(),
  }
}

function buildQuestionBank(command: CreateQuestionCommand, questionId: string, now: string): QuestionBank {
  const options = command.options.map((option, index) => ({
    id: generateId(),
    questionId,
    text: option.text,
    isCorrect: option.isCorrect,
    displayOrder: index,
  }))

  return {
    id: questionId,
    certificationExamId: command.certificationExamId,
    examDomainId: command.examDomainId,
    topicId: command.topicId,
    externalCode: command.externalCode,
    statement: command.statement,
    explanation: command.explanation,
    type: command.type,
    difficulty: command.difficulty,
    status: QuestionStatusValues.Active,
    language: command.language ?? 'en',
    isActive: true,
    options,
    tagIds: command.tagIds ?? [],
    references: [],
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Creates a new question in the in-memory question bank.
 *
 * Validates the command against the current certification, domain and topic
 * catalog and throws a `CreateQuestionValidationError` when the command is
 * invalid. The question and its options are built atomically before being
 * persisted, ensuring no partial state is left behind.
 */
export async function createQuestion(
  command: CreateQuestionCommand,
  context: CreateQuestionValidationContext = getDefaultValidationContext(),
): Promise<CreateQuestionResponse> {
  const schema = createCreateQuestionCommandSchema(context)
  const result = schema.safeParse(command)

  if (!result.success) {
    throw new CreateQuestionValidationError('Create question command is invalid', result.error.issues)
  }

  const validated = result.data
  const questionId = generateId()
  const now = new Date().toISOString()
  const question = buildQuestionBank(validated, questionId, now)

  adminQuestions.push(question)

  return {
    id: question.id,
    certificationExamId: question.certificationExamId,
    statement: question.statement,
    type: question.type,
    difficulty: question.difficulty,
    createdAt: question.createdAt,
  }
}

function validateIdConsistency(command: UpdateQuestionCommand, pathId: string): void {
  if (command.id && command.id !== pathId) {
    throw new UpdateQuestionValidationError('Question identifier mismatch', [
      {
        code: 'custom',
        message: `command id "${command.id}" does not match path id "${pathId}"`,
        path: ['id'],
      } as ZodIssue,
    ])
  }
}

function assertQuestionCanBeUpdated(question: QuestionBank | undefined): asserts question is QuestionBank {
  if (!question) {
    throw new QuestionNotFoundError('Question not found')
  }

  if (question.status === QuestionStatusValues.Archived) {
    throw new QuestionNotFoundError('Question not found')
  }
}

function assertNoConcurrencyConflict(
  command: UpdateQuestionCommand,
  currentUpdatedAt: string,
): void {
  if (!command.concurrencyToken) return

  if (command.concurrencyToken !== currentUpdatedAt) {
    throw new UpdateQuestionConcurrencyError(
      `Concurrency conflict: expected ${command.concurrencyToken}, found ${currentUpdatedAt}`,
    )
  }
}

function buildUpdatedQuestionBank(
  existing: QuestionBank,
  command: UpdateQuestionCommand,
  now: string,
): QuestionBank {
  const options = command.options.map((option, index) => ({
    id: generateId(),
    questionId: existing.id,
    text: option.text,
    isCorrect: option.isCorrect,
    displayOrder: index,
  }))

  return {
    ...existing,
    certificationExamId: command.certificationExamId,
    examDomainId: command.examDomainId,
    topicId: command.topicId,
    externalCode: command.externalCode,
    statement: command.statement,
    explanation: command.explanation,
    type: command.type,
    difficulty: command.difficulty,
    language: command.language ?? 'en',
    options,
    tagIds: command.tagIds ?? [],
    updatedAt: now,
  }
}

/**
 * Updates an existing question in the in-memory question bank.
 *
 * Validates the command, preserves the original identifier and creation date,
 * updates the modification timestamp in UTC and replaces the answer options
 * atomically. Throws `QuestionNotFoundError` when the question does not exist
 * or is archived, `UpdateQuestionValidationError` for validation failures and
 * `UpdateQuestionConcurrencyError` when the concurrency token does not match.
 */
export async function updateQuestion(
  id: string,
  command: UpdateQuestionCommand,
  context: CreateQuestionValidationContext = getDefaultValidationContext(),
): Promise<UpdateQuestionResponse> {
  validateIdConsistency(command, id)

  const schema = createUpdateQuestionCommandSchema(context)
  const result = schema.safeParse(command)

  if (!result.success) {
    throw new UpdateQuestionValidationError('Update question command is invalid', result.error.issues)
  }

  const validated = result.data
  const index = adminQuestions.findIndex((question) => question.id === id)
  const existing = adminQuestions[index]

  assertQuestionCanBeUpdated(existing)
  assertNoConcurrencyConflict(validated, existing.updatedAt)

  const now = new Date().toISOString()
  const updated = buildUpdatedQuestionBank(existing, validated, now)

  adminQuestions[index] = updated

  return {
    id: updated.id,
    certificationExamId: updated.certificationExamId,
    statement: updated.statement,
    type: updated.type,
    difficulty: updated.difficulty,
    createdAt: updated.createdAt,
    updatedAt: updated.updatedAt,
  }
}

function findQuestionById(id: string): QuestionBank | undefined {
  const fromAdmin = adminQuestions.find((question) => question.id === id)
  if (fromAdmin) return fromAdmin

  return questionBanks.find((question) => question.id === id)
}

function toQuestionDetailDto(question: QuestionBank): QuestionDetailDto {
  const certification = certifications.find((c) => c.id === question.certificationExamId)

  const options: QuestionDetailOptionDto[] = [...question.options]
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((option) => ({
      id: option.id,
      text: option.text,
      isCorrect: option.isCorrect,
      displayOrder: option.displayOrder,
    }))

  return {
    id: question.id,
    certificationExamId: question.certificationExamId,
    certificationExamName: certification?.name ?? question.certificationExamId,
    examDomainId: question.examDomainId,
    topicId: question.topicId,
    externalCode: question.externalCode,
    statement: question.statement,
    explanation: question.explanation,
    type: question.type,
    difficulty: question.difficulty,
    status: question.status,
    language: question.language,
    isActive: question.isActive,
    options,
    tagIds: question.tagIds,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  }
}

/**
 * Finds a question by its identifier and returns a read-only detail DTO.
 *
 * Searches first the questions created through the admin service and then the
 * preloaded question bank JSON. Throws `InvalidQuestionIdentifierError` when
 * the supplied id is empty and `QuestionNotFoundError` when no question is found.
 */
export async function getQuestionById(id: string): Promise<QuestionDetailDto> {
  if (!id || id.trim().length === 0) {
    throw new InvalidQuestionIdentifierError('Question identifier is required')
  }

  const question = findQuestionById(id)
  if (!question) {
    throw new QuestionNotFoundError('Question not found')
  }

  return toQuestionDetailDto(question)
}

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50
const ALLOWED_SORT_FIELDS = ['id', 'statement', 'type', 'difficulty', 'status', 'createdAt', 'updatedAt']

function toZodIssue(message: string, path: string[]): ZodIssue {
  return {
    code: 'custom',
    message,
    path,
  } as ZodIssue
}

function isValidQuestionType(value: string): value is QuestionType {
  return Object.values(QuestionTypeValues).includes(value as QuestionType)
}

function isValidQuestionDifficulty(value: string): value is QuestionDifficulty {
  return Object.values(QuestionDifficultyValues).includes(value as QuestionDifficulty)
}

function isValidIsoDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z?)?$/.test(value) && !isNaN(Date.parse(value))
}

function validateListQuestionsParams(params: ListQuestionsParams): ListQuestionsParams {
  const issues: ZodIssue[] = []

  const pageNumberValue = params.pageNumber ?? DEFAULT_PAGE_NUMBER
  if (typeof pageNumberValue !== 'number' || !Number.isInteger(pageNumberValue) || pageNumberValue <= 0) {
    issues.push(toZodIssue('pageNumber must be a positive integer', ['pageNumber']))
  }

  const pageSizeValue = params.pageSize ?? DEFAULT_PAGE_SIZE
  if (typeof pageSizeValue !== 'number' || !Number.isInteger(pageSizeValue) || pageSizeValue <= 0) {
    issues.push(toZodIssue('pageSize must be a positive integer', ['pageSize']))
  } else if (pageSizeValue > MAX_PAGE_SIZE) {
    issues.push(toZodIssue(`pageSize must not exceed ${MAX_PAGE_SIZE}`, ['pageSize']))
  }

  if (params.certificationExamId !== undefined && params.certificationExamId.trim().length === 0) {
    issues.push(toZodIssue('certificationExamId must not be empty when provided', ['certificationExamId']))
  }

  if (params.examDomainId !== undefined && params.examDomainId.trim().length === 0) {
    issues.push(toZodIssue('examDomainId must not be empty when provided', ['examDomainId']))
  }

  if (params.type !== undefined && !isValidQuestionType(params.type)) {
    issues.push(toZodIssue(`type must be one of ${Object.values(QuestionTypeValues).join(', ')}`, ['type']))
  }

  if (params.difficulty !== undefined && !isValidQuestionDifficulty(params.difficulty)) {
    issues.push(toZodIssue(`difficulty must be one of ${Object.values(QuestionDifficultyValues).join(', ')}`, ['difficulty']))
  }

  if (params.createdFrom !== undefined && !isValidIsoDate(params.createdFrom)) {
    issues.push(toZodIssue('createdFrom must be a valid ISO 8601 date', ['createdFrom']))
  }

  if (params.createdTo !== undefined && !isValidIsoDate(params.createdTo)) {
    issues.push(toZodIssue('createdTo must be a valid ISO 8601 date', ['createdTo']))
  }

  if (params.createdFrom && params.createdTo && params.createdFrom > params.createdTo) {
    issues.push(toZodIssue('createdFrom must not be later than createdTo', ['createdFrom']))
  }

  if (params.sortBy !== undefined && !ALLOWED_SORT_FIELDS.includes(params.sortBy)) {
    issues.push(toZodIssue(`sortBy must be one of ${ALLOWED_SORT_FIELDS.join(', ')}`, ['sortBy']))
  }

  if (params.sortDirection !== undefined && params.sortDirection !== 'asc' && params.sortDirection !== 'desc') {
    issues.push(toZodIssue('sortDirection must be "asc" or "desc"', ['sortDirection']))
  }

  if (issues.length > 0) {
    throw new ListQuestionsValidationError('List questions parameters are invalid', issues)
  }

  return {
    ...params,
    pageNumber: pageNumberValue,
    pageSize: pageSizeValue,
  }
}

function toQuestionListItemDto(question: QuestionBank): QuestionListItemDto {
  const certification = certifications.find((c) => c.id === question.certificationExamId)

  return {
    id: question.id,
    statement: question.statement,
    certificationExamId: question.certificationExamId,
    certificationExamName: certification?.name ?? question.certificationExamId,
    examDomainId: question.examDomainId,
    type: question.type,
    difficulty: question.difficulty,
    status: question.status,
    optionsCount: question.options.length,
    createdAt: question.createdAt,
    updatedAt: question.updatedAt,
  }
}

function listAllQuestions(includeDeleted: boolean): QuestionBank[] {
  if (includeDeleted) {
    return [...adminQuestions, ...questionBanks]
  }

  const fromAdmin = adminQuestions.filter((question) => question.status !== QuestionStatusValues.Archived)
  const fromBank = questionBanks.filter((question) => question.status !== QuestionStatusValues.Archived)

  return [...fromAdmin, ...fromBank]
}

function matchesFilters(question: QuestionBank, params: ListQuestionsParams): boolean {
  if (params.certificationExamId && question.certificationExamId !== params.certificationExamId) {
    return false
  }

  if (params.examDomainId && question.examDomainId !== params.examDomainId) {
    return false
  }

  if (params.type && question.type !== params.type) {
    return false
  }

  if (params.difficulty && question.difficulty !== params.difficulty) {
    return false
  }

  if (params.isActive !== undefined && question.isActive !== params.isActive) {
    return false
  }

  if (params.searchText && params.searchText.trim().length > 0) {
    const needle = params.searchText.toLowerCase()
    if (!question.statement.toLowerCase().includes(needle)) {
      return false
    }
  }

  if (params.createdFrom && question.createdAt < params.createdFrom) {
    return false
  }

  if (params.createdTo && question.createdAt > params.createdTo) {
    return false
  }

  return true
}

function compareValues(aValue: string, bValue: string, direction: 'asc' | 'desc'): number {
  const comparison = aValue.localeCompare(bValue)
  return direction === 'asc' ? comparison : -comparison
}

function sortFilteredQuestions(a: QuestionBank, b: QuestionBank, params: ListQuestionsParams): number {
  const sortBy = params.sortBy ?? 'updatedAt'
  const sortDirection = params.sortDirection ?? 'desc'
  const field = ALLOWED_SORT_FIELDS.includes(sortBy) ? sortBy : 'updatedAt'

  const aValue = field === 'id' ? a.id : a[field as keyof QuestionBank]
  const bValue = field === 'id' ? b.id : b[field as keyof QuestionBank]

  if (typeof aValue === 'string' && typeof bValue === 'string') {
    const comparison = compareValues(aValue.toLowerCase(), bValue.toLowerCase(), sortDirection)
    if (comparison !== 0) return comparison
  }

  return a.id.localeCompare(b.id)
}

/**
 * Returns a paginated list of questions.
 *
 * Validates the pagination and filter parameters, applies stable ordering by
 * the requested field (default updatedAt descending) and id ascending, filters
 * out archived questions unless includeDeleted is true, and projects each
 * question to a summary DTO.
 */
export async function listQuestions(
  params: ListQuestionsParams = {},
): Promise<QuestionListResponse> {
  const validated = validateListQuestionsParams(params)
  const pageNumber = validated.pageNumber ?? DEFAULT_PAGE_NUMBER
  const pageSize = validated.pageSize ?? DEFAULT_PAGE_SIZE

  const allQuestions = listAllQuestions(validated.includeDeleted ?? false)
    .filter((question) => matchesFilters(question, validated))
    .sort((a, b) => sortFilteredQuestions(a, b, validated))

  const totalItems = allQuestions.length
  const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)
  const skip = (pageNumber - 1) * pageSize

  const pageItems = allQuestions.slice(skip, skip + pageSize).map(toQuestionListItemDto)

  return {
    items: pageItems,
    pageNumber,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage: pageNumber > 1,
    hasNextPage: pageNumber < totalPages,
  }
}

function buildActivationCommandFromQuestion(question: QuestionBank): CreateQuestionCommand {
  return {
    certificationExamId: question.certificationExamId,
    examDomainId: question.examDomainId,
    topicId: question.topicId,
    externalCode: question.externalCode,
    statement: question.statement,
    explanation: question.explanation,
    type: question.type,
    difficulty: question.difficulty,
    language: question.language,
    options: question.options.map((option) => ({
      text: option.text,
      isCorrect: option.isCorrect,
    })),
    tagIds: question.tagIds,
  }
}

function assertQuestionCanBeActivated(question: QuestionBank): void {
  const context = getActivationValidationContext()
  const schema = createCreateQuestionCommandSchema(context)
  const command = buildActivationCommandFromQuestion(question)
  const result = schema.safeParse(command)

  if (!result.success) {
    throw new QuestionStatusChangeValidationError('Question cannot be activated', result.error.issues)
  }
}

function updateQuestionInPlace(question: QuestionBank, now: string, isActive: boolean): QuestionBank {
  const status = isActive ? QuestionStatusValues.Active : QuestionStatusValues.Draft

  return {
    ...question,
    isActive,
    status,
    updatedAt: now,
  }
}

/**
 * Activates or deactivates a question.
 *
 * Validates that the question exists and is not archived. When activating, it
 * checks the question structure, options, and cross-references. The operation
 * is idempotent and updates the modification timestamp in UTC.
 */
export async function changeQuestionStatus(
  id: string,
  command: ChangeQuestionStatusCommand,
): Promise<ChangeQuestionStatusResponse> {
  if (!id || id.trim().length === 0) {
    throw new InvalidQuestionIdentifierError('Question identifier is required')
  }

  const adminIndex = adminQuestions.findIndex((question) => question.id === id)
  const bankIndex = questionBanks.findIndex((question) => question.id === id)

  const question = adminIndex >= 0 ? adminQuestions[adminIndex] : questionBanks[bankIndex]

  if (!question || question.status === QuestionStatusValues.Archived) {
    throw new QuestionNotFoundError('Question not found')
  }

  if (command.isActive) {
    assertQuestionCanBeActivated(question)
  }

  const now = new Date().toISOString()
  const updated = updateQuestionInPlace(question, now, command.isActive)

  if (adminIndex >= 0) {
    adminQuestions[adminIndex] = updated
  } else if (bankIndex >= 0) {
    questionBanks[bankIndex] = updated
  }

  return {
    id: updated.id,
    isActive: updated.isActive,
    status: updated.status,
    updatedAt: updated.updatedAt,
  }
}

/**
 * Deletes a question logically.
 *
 * Validates the identifier and that the question exists and is not already
 * deleted. Sets the status to archived, marks it as inactive and updates the
 * modification timestamp in UTC. The operation is idempotent for an already
 * deleted question.
 */
export async function deleteQuestion(id: string): Promise<DeleteQuestionResponse> {
  if (!id || id.trim().length === 0) {
    throw new InvalidQuestionIdentifierError('Question identifier is required')
  }

  const adminIndex = adminQuestions.findIndex((question) => question.id === id)
  const bankIndex = questionBanks.findIndex((question) => question.id === id)

  const question = adminIndex >= 0 ? adminQuestions[adminIndex] : questionBanks[bankIndex]

  if (!question) {
    throw new QuestionNotFoundError('Question not found')
  }

  const now = new Date().toISOString()
  const updated: QuestionBank = {
    ...question,
    status: QuestionStatusValues.Archived,
    isActive: false,
    updatedAt: now,
  }

  if (adminIndex >= 0) {
    adminQuestions[adminIndex] = updated
  } else if (bankIndex >= 0) {
    questionBanks[bankIndex] = updated
  }

  return {
    id: updated.id,
    isActive: updated.isActive,
    deletedAt: updated.updatedAt,
  }
}

function duplicateOptions(options: QuestionBank['options']): QuestionBank['options'] {
  return options.map((option, index) => ({
    ...option,
    id: generateId(),
    displayOrder: option.displayOrder ?? index,
  }))
}

/**
 * Duplicates an existing question creating a new inactive draft copy.
 *
 * Validates that the source question exists and is not archived. The new
 * question receives a new id, new option ids, initial draft status, is marked
 * as inactive and retains no historical references from the source. The
 * source question is not modified.
 */
export async function duplicateQuestion(id: string): Promise<DuplicateQuestionResponse> {
  if (!id || id.trim().length === 0) {
    throw new InvalidQuestionIdentifierError('Question identifier is required')
  }

  const question = findQuestionById(id)

  if (!question) {
    throw new QuestionNotFoundError('Question not found')
  }

  if (question.status === QuestionStatusValues.Archived) {
    throw new QuestionNotFoundError('Question not found')
  }

  const now = new Date().toISOString()
  const duplicated: QuestionBank = {
    ...question,
    id: generateId(),
    isActive: false,
    status: QuestionStatusValues.Draft,
    createdAt: now,
    updatedAt: now,
    options: duplicateOptions(question.options),
  }

  adminQuestions.push(duplicated)

  return {
    id: duplicated.id,
    sourceQuestionId: question.id,
    isActive: duplicated.isActive,
  }
}

/**
 * Returns all questions created through the admin service.
 */
export function getAdminQuestions(): QuestionBank[] {
  return [...adminQuestions]
}
