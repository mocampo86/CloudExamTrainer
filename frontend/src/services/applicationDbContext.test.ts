import { describe, it, expect, vi } from 'vitest'
import {
  ApplicationDbContext,
  createApplicationDbContext,
  type DbContextFactoryEnv,
} from './applicationDbContext'

describe('ApplicationDbContext', () => {
  describe('constructor and options resolution', () => {
    it('uses sensible defaults for schema version, naming convention and autoMigrate', () => {
      const context = new ApplicationDbContext({ connectionString: 'memory://default' })

      expect(context.options.connectionString).toBe('memory://default')
      expect(context.options.schemaVersion).toBe('1.0.0')
      expect(context.options.namingConvention).toBe('snake_case')
      expect(context.options.autoMigrate).toBe(false)
      expect(context.isReady).toBe(true)
    })

    it('allows custom options', () => {
      const context = new ApplicationDbContext({
        connectionString: 'localstorage://test',
        schemaVersion: '2.0.0',
        namingConvention: 'camelCase',
        autoMigrate: true,
      })

      expect(context.options.schemaVersion).toBe('2.0.0')
      expect(context.options.namingConvention).toBe('camelCase')
      expect(context.options.autoMigrate).toBe(true)
      expect(context.dataSource).toBe('localstorage')
    })

    it('throws when the connection string is invalid', () => {
      expect(() => new ApplicationDbContext({ connectionString: 'invalid' })).toThrow(
        'Invalid connection string: invalid',
      )
    })

    it('throws when the connection string has no path', () => {
      expect(() => new ApplicationDbContext({ connectionString: 'memory://' })).toThrow(
        'Connection string is missing a path: memory://',
      )
    })
  })

  describe('healthCheck', () => {
    it('reports healthy for the memory data source', () => {
      const context = new ApplicationDbContext({ connectionString: 'memory://default' })
      const result = context.healthCheck()

      expect(result.status).toBe('healthy')
      expect(result.dataSource).toBe('memory://default')
      expect(result.responseTimeMs).toBeGreaterThanOrEqual(0)
    })

    it('verifies localStorage read/write when configured', () => {
      class FakeStorage implements Storage {
        private readonly store = new Map<string, string>()

        get length(): number {
          return this.store.size
        }

        key(index: number): string | null {
          return Array.from(this.store.keys())[index] ?? null
        }

        getItem(key: string): string | null {
          return this.store.get(key) ?? null
        }

        setItem(key: string, value: string): void {
          this.store.set(key, value)
        }

        removeItem(key: string): void {
          this.store.delete(key)
        }

        clear(): void {
          this.store.clear()
        }
      }

      vi.stubGlobal('localStorage', new FakeStorage())

      try {
        const context = new ApplicationDbContext({ connectionString: 'localstorage://health-check' })
        const result = context.healthCheck()

        expect(result.status).toBe('healthy')
        expect(result.dataSource).toBe('localstorage://health-check')
      } finally {
        vi.unstubAllGlobals()
      }
    })

    it('reports unhealthy for unsupported data source schemes', () => {
      const context = new ApplicationDbContext({ connectionString: 'postgresql://localhost/db' })
      const result = context.healthCheck()

      expect(result.status).toBe('unhealthy')
      expect(result.message).toContain('postgresql')
    })

    it('reports unhealthy when localStorage is not available', () => {
      vi.stubGlobal('localStorage', undefined)

      try {
        const context = new ApplicationDbContext({ connectionString: 'localstorage://no-store' })
        const result = context.healthCheck()

        expect(result.status).toBe('unhealthy')
        expect(result.message).toContain('localStorage is not available')
      } finally {
        vi.unstubAllGlobals()
      }
    })
  })

  describe('naming conventions', () => {
    it('converts camelCase keys to snake_case by default', () => {
      const context = new ApplicationDbContext({ connectionString: 'memory://default' })

      expect(context.normalizeStorageKey('createdAt')).toBe('created_at')
      expect(context.normalizeStorageKey('certificationExamId')).toBe('certification_exam_id')
    })

    it('preserves camelCase keys when configured', () => {
      const context = new ApplicationDbContext({
        connectionString: 'memory://default',
        namingConvention: 'camelCase',
      })

      expect(context.normalizeStorageKey('createdAt')).toBe('createdAt')
    })
  })

  describe('enum mapping', () => {
    it('returns the value when it belongs to the allowed enum', () => {
      const context = new ApplicationDbContext({ connectionString: 'memory://default' })
      const values = ['single_choice', 'multiple_choice'] as const

      expect(context.mapEnum('single_choice', values)).toBe('single_choice')
    })

    it('throws when the value is not in the allowed enum', () => {
      const context = new ApplicationDbContext({ connectionString: 'memory://default' })
      const values = ['active', 'draft'] as const

      expect(() => context.mapEnum('archived', values)).toThrow('Invalid enum value')
    })
  })

  describe('timestamps', () => {
    it('returns the current timestamp in ISO 8601 format', () => {
      const context = new ApplicationDbContext({ connectionString: 'memory://default' })
      const now = context.now()

      expect(now).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/)
      expect(!Number.isNaN(Date.parse(now))).toBe(true)
    })
  })

  describe('migrations', () => {
    it('returns an empty initial migration and does not apply it by default', () => {
      const context = new ApplicationDbContext({ connectionString: 'memory://default' })
      const result = context.migrate()

      expect(result.version).toBe('1.0.0')
      expect(result.applied).toEqual([])
      expect(result.appliedAutomatically).toBe(false)
    })

    it('reports the initial migration as applied when autoMigrate is true', () => {
      const context = new ApplicationDbContext({
        connectionString: 'memory://default',
        autoMigrate: true,
      })
      const result = context.migrate()

      expect(result.applied).toEqual(['InitialCreate'])
      expect(result.appliedAutomatically).toBe(true)
    })
  })

  describe('createApplicationDbContext', () => {
    it('creates a context with default options when no overrides are provided', () => {
      const context = createApplicationDbContext()

      expect(context).toBeInstanceOf(ApplicationDbContext)
      expect(context.options.connectionString).toBe('memory://default')
    })

    it('overrides environment defaults with explicit options', () => {
      const env: DbContextFactoryEnv = {
        VITE_DATA_SOURCE_URL: 'localstorage://env',
        VITE_DATA_SCHEMA_VERSION: '3.0.0',
        VITE_DATA_NAMING_CONVENTION: 'camelCase',
        VITE_DATA_AUTO_MIGRATE: 'true',
      }

      const context = createApplicationDbContext({}, env)

      expect(context.options.connectionString).toBe('localstorage://env')
      expect(context.options.schemaVersion).toBe('3.0.0')
      expect(context.options.namingConvention).toBe('camelCase')
      expect(context.options.autoMigrate).toBe(true)
    })

    it('explicit options take precedence over environment variables', () => {
      const env: DbContextFactoryEnv = {
        VITE_DATA_SOURCE_URL: 'localstorage://env',
      }

      const context = createApplicationDbContext(
        { connectionString: 'memory://override' },
        env,
      )

      expect(context.options.connectionString).toBe('memory://override')
    })
  })
})
