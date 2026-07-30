/**
 * Adaptación del "DbContext" del MVP para el frontend.
 *
 * La historia US-040 pide configurar la conexión y DbContext de PostgreSQL.
 * Dado que el MVP es una SPA React + TypeScript + Vite sin backend ni base de
 * datos (ver project-context.md y architecture-rules.md), esta capa de
 * persistencia actúa como el equivalente frontend: abstrae el origen de datos,
 * expone opciones configurables, convenciones de nombres, mapeo de enums,
 * timestamps y un health check. No introduce Npgsql, EF Core ni un backend .NET.
 */

export type NamingConvention = 'snake_case' | 'camelCase'

export interface DbContextOptions {
  /** Cadena de conexión al origen de datos. Soporta `memory://` y `localstorage://<namespace>`. */
  connectionString: string
  /** Versión del esquema de datos. */
  schemaVersion?: string
  /** Convención de nombres para claves de almacenamiento. */
  namingConvention?: NamingConvention
  /** Si es `true`, las migraciones se aplican automáticamente al inicializar. */
  autoMigrate?: boolean
}

export interface PersistenceHealthCheckResult {
  status: 'healthy' | 'unhealthy'
  dataSource: string
  responseTimeMs: number
  message?: string
}

export interface MigrationResult {
  version: string
  applied: string[]
  appliedAutomatically: boolean
}

const DEFAULT_SCHEMA_VERSION = '1.0.0'
const DEFAULT_NAMING_CONVENTION: NamingConvention = 'snake_case'

function resolveOptions(options: DbContextOptions): Required<DbContextOptions> {
  return {
    connectionString: options.connectionString,
    schemaVersion: options.schemaVersion ?? DEFAULT_SCHEMA_VERSION,
    namingConvention: options.namingConvention ?? DEFAULT_NAMING_CONVENTION,
    autoMigrate: options.autoMigrate ?? false,
  }
}

export interface DbContextFactoryEnv {
  readonly [key: string]: string | boolean | undefined
}

function readEnvString(env: DbContextFactoryEnv, key: string): string | undefined {
  const value = env[key]
  return typeof value === 'string' ? value : undefined
}

function readEnvBoolean(env: DbContextFactoryEnv, key: string): boolean | undefined {
  const value = env[key]
  if (typeof value === 'boolean') return value
  if (typeof value === 'string') return value.toLowerCase() === 'true'
  return undefined
}

function parseNamingConvention(value: string | undefined): NamingConvention | undefined {
  if (value === 'snake_case' || value === 'camelCase') return value
  return undefined
}

interface ParsedConnectionString {
  scheme: string
  path: string
}

function parseConnectionString(connectionString: string): ParsedConnectionString {
  const separatorIndex = connectionString.indexOf('://')
  if (separatorIndex === -1 || separatorIndex === 0) {
    throw new Error(`Invalid connection string: ${connectionString}`)
  }

  const scheme = connectionString.slice(0, separatorIndex).toLowerCase()
  const path = connectionString.slice(separatorIndex + 3)

  if (path.length === 0) {
    throw new Error(`Connection string is missing a path: ${connectionString}`)
  }

  return { scheme, path }
}

/**
 * Contexto de persistencia del MVP.
 *
 * Encapsula la configuración de conexión, convenciones de nombres, mapeo de
 * enums, timestamps y un health check. No contiene lógica de negocio ni
 * repositorios; es la infraestructura que el resto de la aplicación usará en
 * historias posteriores para leer y escribir datos.
 */
export class ApplicationDbContext {
  readonly options: Required<DbContextOptions>
  private readonly connection: ParsedConnectionString

  constructor(options: DbContextOptions) {
    this.options = resolveOptions(options)
    this.connection = parseConnectionString(this.options.connectionString)
  }

  get dataSource(): string {
    return this.connection.scheme
  }

  get isReady(): boolean {
    return this.connection.scheme === 'memory' || this.connection.scheme === 'localstorage'
  }

  /** Devuelve la marca de tiempo actual en formato ISO 8601. */
  now(): string {
    return new Date().toISOString()
  }

  /**
   * Normaliza una clave de almacenamiento según la convención configurada.
   * Por defecto convierte camelCase a snake_case.
   */
  normalizeStorageKey(key: string): string {
    if (this.options.namingConvention === 'camelCase') {
      return key
    }

    return key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)
  }

  /**
   * Mapea un valor a un enum conocido.
   * Lanza un error si el valor no está dentro de los valores permitidos.
   */
  mapEnum<T extends string>(value: string, allowedValues: readonly T[]): T {
    if (allowedValues.includes(value as T)) {
      return value as T
    }

    throw new Error(
      `Invalid enum value "${value}". Allowed values: ${allowedValues.join(', ')}`,
    )
  }

  /**
   * Verifica que el origen de datos responde.
   * Para `localstorage` realiza una lectura/escritura de prueba.
   */
  healthCheck(): PersistenceHealthCheckResult {
    const start = Date.now()
    const { scheme, path } = this.connection

    const measure = (): number => Date.now() - start

    if (scheme === 'memory') {
      return {
        status: 'healthy',
        dataSource: this.options.connectionString,
        responseTimeMs: measure(),
      }
    }

    if (scheme === 'localstorage') {
      if (typeof localStorage === 'undefined') {
        return {
          status: 'unhealthy',
          dataSource: this.options.connectionString,
          responseTimeMs: measure(),
          message: 'localStorage is not available in this environment',
        }
      }

      const sentinelKey = `__persistence_health_${path}`

      try {
        localStorage.setItem(sentinelKey, 'ok')
        const value = localStorage.getItem(sentinelKey)
        localStorage.removeItem(sentinelKey)

        if (value === 'ok') {
          return {
            status: 'healthy',
            dataSource: this.options.connectionString,
            responseTimeMs: measure(),
          }
        }

        return {
          status: 'unhealthy',
          dataSource: this.options.connectionString,
          responseTimeMs: measure(),
          message: 'localStorage read/write mismatch',
        }
      } catch (error) {
        return {
          status: 'unhealthy',
          dataSource: this.options.connectionString,
          responseTimeMs: measure(),
          message: error instanceof Error ? error.message : 'localStorage access failed',
        }
      }
    }

    return {
      status: 'unhealthy',
      dataSource: this.options.connectionString,
      responseTimeMs: measure(),
      message: `Unsupported data source scheme: ${scheme}`,
    }
  }

  /**
   * Ejecuta la migración inicial vacía.
   *
   * No aplica migraciones automáticamente a menos que `autoMigrate` sea `true`.
   * Actualmente no hay transformaciones de esquema; solo se valida la versión.
   */
  migrate(): MigrationResult {
    const applied: string[] = []
    const appliedAutomatically = this.options.autoMigrate

    if (this.options.autoMigrate) {
      // Migración inicial vacía: el esquema JSON actual ya se encuentra
      // versionado a través de los datos y los esquemas Zod.
      applied.push('InitialCreate')
    }

    return {
      version: this.options.schemaVersion,
      applied,
      appliedAutomatically,
    }
  }
}

/**
 * Crea un ApplicationDbContext a partir de variables de entorno Vite,
 * permitiendo sobreescribir valores mediante `options`.
 */
export function createApplicationDbContext(
  options: Partial<DbContextOptions> = {},
  env: DbContextFactoryEnv = import.meta.env ?? {},
): ApplicationDbContext {
  return new ApplicationDbContext({
    connectionString:
      options.connectionString ?? readEnvString(env, 'VITE_DATA_SOURCE_URL') ?? 'memory://default',
    schemaVersion: options.schemaVersion ?? readEnvString(env, 'VITE_DATA_SCHEMA_VERSION'),
    namingConvention:
      options.namingConvention ??
      parseNamingConvention(readEnvString(env, 'VITE_DATA_NAMING_CONVENTION')),
    autoMigrate: options.autoMigrate ?? readEnvBoolean(env, 'VITE_DATA_AUTO_MIGRATE'),
  })
}

/**
 * Instancia registrada del contexto de persistencia.
 *
 * Actúa como el equivalente a registrar el DbContext en el contenedor de
 * dependencias. Se importa en `main.tsx` para garantizar que la aplicación
 * valide la configuración al arrancar.
 */
export const applicationDbContext = createApplicationDbContext()
