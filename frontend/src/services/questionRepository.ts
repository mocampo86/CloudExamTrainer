/**
 * Repositorio de preguntas adaptado al MVP frontend.
 *
 * La historia US-042 pide un repositorio de PostgreSQL con EF Core. Dado que el
 * MVP es una SPA React + TypeScript sin backend ni base de datos real (ver
 * AGENTS.md y architecture-rules.md), esta capa actua como el equivalente
 * frontend: expone la interfaz `IQuestionRepository` y una implementacion
 * `PostgreSqlQuestionRepository` que utiliza `ApplicationDbContext` para las
 * convenciones de persistencia, timestamps y health check, pero almacena los
 * datos en memoria y en el `questionBank` precargado desde JSON.
 */

import type { QuestionBank, QuestionStatus, QuestionType, QuestionDifficulty } from '@/models/QuestionBank'
import type { ApplicationDbContext } from './applicationDbContext'
import { applicationDbContext } from './applicationDbContext'
import questionBanks from '@/data/questionBanks'
import { certifications } from '@/data/certifications'

export interface QuestionRepositoryFilters {
  /** Filtra por estado del ciclo de vida. */
  status?: QuestionStatus
  /** Filtra por el flag de activo. */
  isActive?: boolean
  /** Filtra por identificador de tema. */
  topicId?: string
  /** Filtra por identificador de dominio del examen. */
  examDomainId?: string
  /** Filtra por identificador de etiqueta asociada. */
  tagId?: string
  /** Filtra por tipo de pregunta. */
  type?: QuestionType
  /** Filtra por dificultad. */
  difficulty?: QuestionDifficulty
  /** Busqueda textual parcial en el enunciado. */
  searchText?: string
  /** Fecha minima de creacion en ISO 8601 (inclusive). */
  createdFrom?: string
  /** Fecha maxima de creacion en ISO 8601 (inclusive). */
  createdTo?: string
  /** Incluye preguntas eliminadas logicamente. */
  includeDeleted?: boolean
  /** Campo de ordenamiento. */
  sortBy?: 'createdAt' | 'updatedAt' | 'id' | 'statement' | string
  /** Direccion de ordenamiento. */
  sortDirection?: 'asc' | 'desc'
}

export interface PagedQuestions {
  /** Elementos de la pagina actual. */
  items: QuestionBank[]
  /** Numero de pagina, comienza en 1. */
  pageNumber: number
  /** Tamaño de pagina solicitado. */
  pageSize: number
  /** Total de elementos que coinciden con los filtros. */
  totalItems: number
  /** Total de paginas. */
  totalPages: number
  /** Indica si existe pagina anterior. */
  hasPreviousPage: boolean
  /** Indica si existe pagina siguiente. */
  hasNextPage: boolean
}

export class QuestionNotFoundError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QuestionNotFoundError'
  }
}

export class DuplicateExternalCodeError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'DuplicateExternalCodeError'
  }
}

export class InvalidCertificationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'InvalidCertificationError'
  }
}

export class QuestionConcurrencyError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'QuestionConcurrencyError'
  }
}

/**
 * Interfaz de repositorio de preguntas.
 *
 * No depende de `DbContext` ni de tipos de infraestructura: solo conoce el
 * modelo de dominio `QuestionBank` y los DTOs de filtro y paginacion.
 */
export interface IQuestionRepository {
  /** Obtiene una pregunta por su identificador unico. */
  getByIdAsync(id: string): Promise<QuestionBank | undefined>

  /** Obtiene un listado paginado de preguntas aplicando filtros y ordenamiento. */
  getPagedAsync(
    certificationExamId: string | undefined,
    filters: QuestionRepositoryFilters,
    page: number,
    pageSize: number,
  ): Promise<PagedQuestions>

  /** Crea una nueva pregunta junto con sus opciones, etiquetas y referencias. */
  createAsync(question: QuestionBank): Promise<QuestionBank>

  /** Actualiza una pregunta existente en una unica transaccion. */
  updateAsync(question: QuestionBank): Promise<QuestionBank>

  /** Actualiza el estado activo/inactivo y el ciclo de vida de la pregunta. */
  updateStatusAsync(id: string, status: QuestionStatus, isActive: boolean): Promise<QuestionBank>

  /** Elimina logicamente una pregunta. */
  softDeleteAsync(id: string): Promise<QuestionBank>

  /** Indica si ya existe una pregunta con el codigo externo en la certificacion. */
  existsByExternalCodeAsync(certificationExamId: string, externalCode: string, excludeId?: string): Promise<boolean>

  /** Limpia las preguntas migradas administrativamente, simulando un reset de tabla. */
  resetAsync(): Promise<void>
}

const DEFAULT_PAGE_NUMBER = 1
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 50
const ALLOWED_SORT_FIELDS = ['createdAt', 'updatedAt', 'displayOrder', 'id', 'statement']

function assertCertificationExists(certificationExamId: string): void {
  const exists = certifications.some((certification) => certification.id === certificationExamId)
  if (!exists) {
    throw new InvalidCertificationError(`Certification "${certificationExamId}" does not exist`)
  }
}

function assertDomainBelongsToCertification(certificationExamId: string, examDomainId?: string): void {
  if (!examDomainId) return
  // En el MVP los dominios se infieren del catalogo actual; si no hay datos,
  // se permite cualquier dominio dentro de la certificacion.
  const domainIds = new Set(
    questionBanks
      .filter((question) => question.certificationExamId === certificationExamId && question.examDomainId)
      .map((question) => question.examDomainId as string),
  )
  if (domainIds.size > 0 && !domainIds.has(examDomainId)) {
    throw new InvalidCertificationError(
      `Domain "${examDomainId}" does not belong to certification "${certificationExamId}"`,
    )
  }
}

function assertTopicBelongsToCertification(certificationExamId: string, topicId?: string): void {
  if (!topicId) return
  const topicIds = new Set(
    questionBanks
      .filter((question) => question.certificationExamId === certificationExamId && question.topicId)
      .map((question) => question.topicId as string),
  )
  if (topicIds.size > 0 && !topicIds.has(topicId)) {
    throw new InvalidCertificationError(
      `Topic "${topicId}" does not belong to certification "${certificationExamId}"`,
    )
  }
}

function validateCorrectOptions(question: QuestionBank): void {
  if (question.options.length < 2) {
    throw new Error(`questions must have at least two options, found ${question.options.length}`)
  }

  const correctCount = question.options.filter((option) => option.isCorrect).length

  if (question.type === 'single_choice' && correctCount !== 1) {
    throw new Error(`single_choice questions must have exactly one correct option, found ${correctCount}`)
  }

  if (question.type === 'multiple_choice' && correctCount < 2) {
    throw new Error(`multiple_choice questions must have at least two correct options, found ${correctCount}`)
  }

  if (question.type === 'multiple_choice' && correctCount === question.options.length) {
    throw new Error('multiple_choice questions must have at least one incorrect option')
  }
}

/**
 * Implementacion del repositorio de preguntas para el MVP.
 *
 * Recibe un `ApplicationDbContext` que proporciona la abstraccion de conexion,
 * convenciones de nombres, mapeo de enums y timestamps. La persistencia es en
 * memoria, complementada con el `questionBank` precargado desde JSON, lo que
 * evita introducir Npgsql, EF Core o un backend .NET.
 */
export class PostgreSqlQuestionRepository implements IQuestionRepository {
  private readonly dbContext: ApplicationDbContext
  private readonly adminQuestions: QuestionBank[]
  private readonly seedQuestions: QuestionBank[]

  constructor(
    dbContext: ApplicationDbContext = applicationDbContext,
    seedQuestions: QuestionBank[] = questionBanks,
  ) {
    this.dbContext = dbContext
    this.seedQuestions = seedQuestions
    this.adminQuestions = []
  }

  private get allQuestions(): QuestionBank[] {
    return [...this.adminQuestions, ...this.seedQuestions]
  }

  private findQuestionById(id: string): QuestionBank | undefined {
    const fromAdmin = this.adminQuestions.find((question) => question.id === id)
    if (fromAdmin) return fromAdmin

    return this.seedQuestions.find((question) => question.id === id)
  }

  private filterQuestions(
    certificationExamId: string | undefined,
    filters: QuestionRepositoryFilters,
  ): QuestionBank[] {
    return this.allQuestions.filter((question) => {
      if (certificationExamId !== undefined && question.certificationExamId !== certificationExamId) {
        return false
      }

      if (filters.status !== undefined && question.status !== filters.status) {
        return false
      }

      if (filters.isActive !== undefined && question.isActive !== filters.isActive) {
        return false
      }

      if (filters.topicId !== undefined && question.topicId !== filters.topicId) {
        return false
      }

      if (filters.examDomainId !== undefined && question.examDomainId !== filters.examDomainId) {
        return false
      }

      if (filters.tagId !== undefined && !question.tagIds.includes(filters.tagId)) {
        return false
      }

      if (filters.type !== undefined && question.type !== filters.type) {
        return false
      }

      if (filters.difficulty !== undefined && question.difficulty !== filters.difficulty) {
        return false
      }

      if (filters.searchText !== undefined && filters.searchText.trim().length > 0) {
        const needle = filters.searchText.toLowerCase()
        if (!question.statement.toLowerCase().includes(needle)) {
          return false
        }
      }

      if (filters.createdFrom !== undefined && question.createdAt < filters.createdFrom) {
        return false
      }

      if (filters.createdTo !== undefined && question.createdAt > filters.createdTo) {
        return false
      }

      if (!(filters.includeDeleted ?? false) && question.status === 'archived') {
        return false
      }

      return true
    })
  }

  private sortQuestions(questions: QuestionBank[], filters: QuestionRepositoryFilters): QuestionBank[] {
    const requestedSortBy = ALLOWED_SORT_FIELDS.includes(filters.sortBy ?? '') ? filters.sortBy ?? 'updatedAt' : 'updatedAt'
    const sortDirection = filters.sortDirection ?? 'desc'
    // QuestionBank no tiene displayOrder a nivel pregunta; se usa id como fallback estable.
    const sortBy = requestedSortBy === 'displayOrder' ? 'id' : requestedSortBy

    const sorted = [...questions].sort((a, b) => {
      const aValue = a[sortBy as keyof QuestionBank]
      const bValue = b[sortBy as keyof QuestionBank]

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
        return sortDirection === 'asc' ? comparison : -comparison
      }

      return a.id.localeCompare(b.id)
    })

    return sorted
  }

  private validateQuestion(question: QuestionBank): void {
    assertCertificationExists(question.certificationExamId)
    assertDomainBelongsToCertification(question.certificationExamId, question.examDomainId)
    assertTopicBelongsToCertification(question.certificationExamId, question.topicId)
    validateCorrectOptions(question)
  }

  private validatePage(page: number, pageSize: number): void {
    if (!Number.isInteger(page) || page <= 0) {
      throw new Error('page must be a positive integer')
    }

    if (!Number.isInteger(pageSize) || pageSize <= 0 || pageSize > MAX_PAGE_SIZE) {
      throw new Error(`pageSize must be a positive integer not greater than ${MAX_PAGE_SIZE}`)
    }
  }

  async getByIdAsync(id: string): Promise<QuestionBank | undefined> {
    if (!id || id.trim().length === 0) {
      throw new Error('id is required')
    }

    return this.findQuestionById(id)
  }

  async getPagedAsync(
    certificationExamId: string | undefined,
    filters: QuestionRepositoryFilters,
    page: number = DEFAULT_PAGE_NUMBER,
    pageSize: number = DEFAULT_PAGE_SIZE,
  ): Promise<PagedQuestions> {
    this.validatePage(page, pageSize)

    const filtered = this.filterQuestions(certificationExamId, filters)
    const sorted = this.sortQuestions(filtered, filters)

    const totalItems = sorted.length
    const totalPages = totalItems === 0 ? 0 : Math.ceil(totalItems / pageSize)
    const skip = (page - 1) * pageSize
    const items = sorted.slice(skip, skip + pageSize)

    return {
      items,
      pageNumber: page,
      pageSize,
      totalItems,
      totalPages,
      hasPreviousPage: page > 1,
      hasNextPage: page < totalPages,
    }
  }

  async createAsync(question: QuestionBank): Promise<QuestionBank> {
    this.validateQuestion(question)

    if (question.externalCode) {
      const exists = await this.existsByExternalCodeAsync(
        question.certificationExamId,
        question.externalCode,
      )
      if (exists) {
        throw new DuplicateExternalCodeError(
          `External code "${question.externalCode}" already exists in certification "${question.certificationExamId}"`,
        )
      }
    }

    const now = this.dbContext.now()
    const created: QuestionBank = {
      ...question,
      createdAt: now,
      updatedAt: now,
    }

    this.adminQuestions.push(created)

    return created
  }

  async updateAsync(question: QuestionBank): Promise<QuestionBank> {
    if (!question.id || question.id.trim().length === 0) {
      throw new Error('question id is required')
    }

    const index = this.adminQuestions.findIndex((q) => q.id === question.id)
    if (index === -1) {
      throw new QuestionNotFoundError(`Question "${question.id}" not found`)
    }

    const existing = this.adminQuestions[index]
    if (existing.status === 'archived') {
      throw new QuestionNotFoundError(`Question "${question.id}" not found`)
    }

    if (question.updatedAt !== existing.updatedAt) {
      throw new QuestionConcurrencyError(
        `Concurrency conflict: expected ${question.updatedAt}, found ${existing.updatedAt}`,
      )
    }

    this.validateQuestion(question)

    if (question.externalCode) {
      const exists = await this.existsByExternalCodeAsync(
        question.certificationExamId,
        question.externalCode,
        question.id,
      )
      if (exists) {
        throw new DuplicateExternalCodeError(
          `External code "${question.externalCode}" already exists in certification "${question.certificationExamId}"`,
        )
      }
    }

    const now = this.dbContext.now()
    const updated: QuestionBank = {
      ...existing,
      ...question,
      createdAt: existing.createdAt,
      updatedAt: now,
    }

    this.adminQuestions[index] = updated

    return updated
  }

  async updateStatusAsync(id: string, status: QuestionStatus, isActive: boolean): Promise<QuestionBank> {
    if (!id || id.trim().length === 0) {
      throw new Error('id is required')
    }

    const question = this.findQuestionById(id)
    if (!question || question.status === 'archived') {
      throw new QuestionNotFoundError(`Question "${id}" not found`)
    }

    if (isActive && status === 'active') {
      validateCorrectOptions(question)
    }

    const now = this.dbContext.now()
    const updated: QuestionBank = {
      ...question,
      status,
      isActive,
      updatedAt: now,
    }

    const adminIndex = this.adminQuestions.findIndex((q) => q.id === id)
    if (adminIndex >= 0) {
      this.adminQuestions[adminIndex] = updated
    } else {
      const seedIndex = this.seedQuestions.findIndex((q) => q.id === id)
      if (seedIndex >= 0) {
        this.seedQuestions[seedIndex] = updated
      } else {
        this.adminQuestions.push(updated)
      }
    }

    return updated
  }

  async softDeleteAsync(id: string): Promise<QuestionBank> {
    if (!id || id.trim().length === 0) {
      throw new Error('id is required')
    }

    const question = this.findQuestionById(id)
    if (!question) {
      throw new QuestionNotFoundError(`Question "${id}" not found`)
    }

    const now = this.dbContext.now()
    const deleted: QuestionBank = {
      ...question,
      status: 'archived',
      isActive: false,
      updatedAt: now,
    }

    const adminIndex = this.adminQuestions.findIndex((q) => q.id === id)
    if (adminIndex >= 0) {
      this.adminQuestions[adminIndex] = deleted
    } else {
      const seedIndex = this.seedQuestions.findIndex((q) => q.id === id)
      if (seedIndex >= 0) {
        this.seedQuestions[seedIndex] = deleted
      } else {
        this.adminQuestions.push(deleted)
      }
    }

    return deleted
  }

  async existsByExternalCodeAsync(
    certificationExamId: string,
    externalCode: string,
    excludeId?: string,
  ): Promise<boolean> {
    return this.allQuestions.some(
      (question) =>
        question.certificationExamId === certificationExamId &&
        question.externalCode === externalCode &&
        question.id !== excludeId,
    )
  }

  async resetAsync(): Promise<void> {
    this.adminQuestions.length = 0
  }
}

/**
 * Instancia registrada del repositorio de preguntas.
 *
 * Equivale a registrar `IQuestionRepository` en el contenedor de dependencias
 * del backend, pero en el MVP se resuelve directamente contra la adaptacion
 * frontend.
 */
export const questionRepository = new PostgreSqlQuestionRepository()
