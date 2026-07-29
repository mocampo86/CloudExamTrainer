# US-043 - Migrar preguntas JSON a PostgreSQL

## Descripción

Como administrador, quiero migrar el contenido actual del banco de preguntas desde el archivo JSON a PostgreSQL para conservar las preguntas existentes y dejar de depender exclusivamente de archivos estáticos.

## Objetivo

Crear un proceso de migración idempotente y trazable que lea `frontend/src/data/questionBanks/questionBanks.json` (o su equivalente actual) y cargue las preguntas, opciones, etiquetas y referencias en PostgreSQL.

## Acceptance Criteria

### Proceso de migración

- Se crea un script o endpoint de migración capaz de leer el JSON de preguntas y escribirlo en PostgreSQL.
- Se mapean correctamente todos los campos de `QuestionBank`, `AnswerOption`, `QuestionReference` y `Tag`.
- Se generan identificadores estables (UUID v5 basado en `id` original o se reutiliza el `id` si es UUID).
- Se normalizan duplicados y se reportan conflictos sin detener el proceso completo.
- Se asocian todas las preguntas a la certificación AWS Certified Solutions Architect - Associate por defecto, salvo que el JSON ya indique otra.

### Validaciones

- Se valida que cada pregunta cumpla las reglas de negocio (`single_choice`/`multiple_choice`, opciones no duplicadas, al menos una correcta, etc.).
- Se valida la unicidad de `ExternalCode` dentro de cada certificación.
- Se valida que `certificationExamId`, `topicId` y `examDomainId` correspondan a entidades existentes.
- Las referencias con URL inválidas se registran con advertencia, no se omiten silenciosamente.

### Idempotencia y seguridad

- La migración admite un modo "dry-run" que reporta sin escribir.
- La migración admite un modo "reset" que limpia previamente las tablas del banco de preguntas (opcional y explícito).
- Se ejecuta dentro de una transacción o batch controlado.

### Pruebas y calidad

- Se prueba la migración con un subconjunto del JSON real.
- Se verifica que el número de preguntas migradas coincide con el archivo fuente.
- Se prueba que las opciones, etiquetas y referencias se asocian correctamente.
- Se prueba que una segunda ejecución no duplica registros en el modo por defecto.
- La solución compila y los tests pasan.

## Out of Scope

- No implementar UI para ejecutar la migración.
- No programar la migración como parte del arranque automático en producción.
- No modificar el archivo JSON fuente.
- No implementar rollback automatizado.
