# Implementation Report

## Historia

- ID: US-043
- Título: Migrar preguntas JSON a PostgreSQL

## Resumen

Se implementó el proceso de migración de `questionBanks.json` hacia el repositorio `PostgreSqlQuestionRepository`, que actúa como capa de persistencia simulada dentro del frontend React + TypeScript/Zod del MVP. La migración genera identificadores UUID v5 estables, valida reglas de negocio, detecta duplicados y ofrece modos `dry-run` y `reset`. Se dejó un script ejecutable (`npm run migrate:postgresql`) que corre el proceso sobre el JSON real y produce un reporte trazable. Dado que el MVP no tiene backend ni base de datos real, los requisitos de persistencia se adaptaron al modelo en memoria del frontend, reutilizando `IQuestionRepository`.

## Acceptance Criteria

### Proceso de migración

- [x] **Script o endpoint de migración** — `frontend/scripts/migrateQuestionBankToPostgreSql.ts` lee `src/data/questionBanks/questionBanks.json` y escribe en una instancia de `PostgreSqlQuestionRepository`. Comando: `npm run migrate:postgresql`.
- [x] **Mapeo de campos** — `buildMigratedQuestion` en `frontend/src/services/questionBankToPostgreSqlMigration.ts` asigna `QuestionBank`, `AnswerOption`, `QuestionReference`, `tagIds` y preserva `createdAt`/`updatedAt`, además de propagar el nuevo `id` generado a hijos.
- [x] **Identificadores estables** — `frontend/src/services/uuid.ts` implementa `generateUuidV5` basado en SHA-1. Si el `id` original ya es UUID se reutiliza; de lo contrario se genera un UUID v5 determinista a partir de `${certificationExamId}:${idOriginal}`.
- [x] **Normalización de duplicados** — se detectan duplicados locales por `id` y `externalCode` dentro de cada certificación, se reportan en `MigrationReport.duplicateQuestionIds` y `warnings`, y el proceso continúa.
- [x] **Asociación por defecto a AWS SAA-C03** — `DEFAULT_CERTIFICATION_EXAM_ID = 'saa-c03'` se aplica cuando una pregunta no tiene `certificationExamId`.

### Validaciones

- [x] **Reglas de negocio** — cada pregunta se valida con `questionBankSchema` (incluyendo `single_choice` exactamente una correcta, `multiple_choice` al menos dos correctas y al menos una incorrecta, opciones sin texto duplicado, etc.).
- [x] **Unicidad de ExternalCode** — `PostgreSqlQuestionRepository.existsByExternalCodeAsync` y la deduplicación local garantizan unicidad dentro de cada certificación.
- [x] **Existencia de entidades relacionadas** — se valida que `certificationExamId` exista en `frontend/src/data/certifications` y que `examDomainId`/`topicId` pertenezcan al conjunto de identificadores presentes en el lote migrado (equivalente frontend a FK).
- [x] **Referencias con URL inválida** — se registran advertencias en `MigrationReport.warnings` e `invalidReferenceUrls`, se descartan del objeto migrado (con advertencia explícita) y el proceso continúa.

### Idempotencia y seguridad

- [x] **Modo dry-run** — `migrateQuestionBankToPostgreSql(..., { dryRun: true })` reporta sin llamar `repository.createAsync`.
- [x] **Modo reset** — `migrateQuestionBankToPostgreSql(..., { reset: true })` invoca `repository.resetAsync()` antes de importar; `PostgreSqlQuestionRepository.resetAsync()` limpia `adminQuestions`.
- [x] **Batch controlado** — se valida todo el lote antes de escribir y se capturan errores por pregunta sin detener la migración completa.

### Pruebas y calidad

- [x] **Pruebas con subconjunto real** — `questionBankToPostgreSqlMigration.test.ts` cubre migración válida, default de certificación, duplicados, dry-run, reset, reglas de negocio inválidas, URLs inválidas y certificaciones desconocidas.
- [x] **Coincidencia de conteos** — el script `npm run migrate:postgresql` reportó 6 preguntas en el archivo fuente y 6 migradas.
- [x] **Asociación de opciones, etiquetas y referencias** — los tests verifican que los objetos hijos quedan ligados al nuevo `id` y que las referencias válidas se conservan.
- [x] **Idempotencia** — el test de segunda ejecución verifica que no se duplican registros.
- [x] **Compilación y tests** — `npm run lint`, `npm run validate:questions`, `npm run test` y `npm run build` finalizan correctamente.

## Archivos modificados y creados

- `frontend/src/services/uuid.ts` (creado): generador determinista UUID v5 puro JS, sin depender de Web Crypto, para compatibilidad con Node/Vitest/jsdom y navegadores.
- `frontend/src/services/questionBankToPostgreSqlMigration.ts` (creado): servicio `migrateQuestionBankToPostgreSql` con normalización, validación, reporte y modos `dry-run`/`reset`.
- `frontend/src/services/questionBankToPostgreSqlMigration.test.ts` (creado): cobertura de escenarios principales.
- `frontend/src/services/questionRepository.ts`: se agregó `resetAsync()` a `IQuestionRepository` y a `PostgreSqlQuestionRepository` para soportar el modo reset.
- `frontend/src/services/applicationDbContext.ts`: fallback a objeto vacío cuando `import.meta.env` no está definido (scripts `tsx` en Node).
- `frontend/scripts/migrateQuestionBankToPostgreSql.ts` (creado): script CLI que ejecuta la migración sobre `questionBanks.json`.
- `frontend/package.json`: script `migrate:postgresql`.
- `.ai-kit/reports/US-043-implementation-report.md` (creado): este reporte.

## Pruebas agregadas o modificadas

- `frontend/src/services/questionBankToPostgreSqlMigration.test.ts`: 10 tests que cubren exito, UUID v5, certificación por defecto, idempotencia, dry-run, reset, reglas inválidas, referencias inválidas, duplicados y certificación inexistente.

## Validaciones ejecutadas

- [x] `npm run lint` — OK.
- [x] `npm run validate:questions` — OK (6 questions validadas).
- [x] `npm run test` — 374 tests passed.
- [x] `npm run build` — OK.
- [x] `npm run migrate:postgresql` — OK (6/6 migradas).

## Riesgos o limitaciones

- El repositorio `PostgreSqlQuestionRepository` persiste en memoria, por lo que el script no escribe en una base de datos PostgreSQL real. Esto es consistente con la arquitectura MVP sin backend ni DB real, documentada en `AGENTS.md` y `architecture-rules.md`.
- `examDomainId` y `topicId` se validan contra el conjunto de valores que aparecen en el propio lote, no contra un catálogo externo de dominios/temas, dado que el MVP no dispone de ese catálogo.
- El script no realiza rollback automático; una falla parcial deja el reporte con los errores correspondientes.

## Fuera de alcance confirmado

- No se implementó UI para ejecutar la migración.
- No se programó la migración como parte del arranque automático en producción.
- No se modificó `frontend/src/data/questionBanks/questionBanks.json`.
- No se implementó rollback automatizado.
