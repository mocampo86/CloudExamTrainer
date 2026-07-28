# Implementation Report

## Historia

- ID: US-019
- Título: Crear modelo base de certificaciones y exámenes

## Resumen

Se crearon las entidades de dominio `Provider` y `CertificationExam`, junto con sus esquemas Zod y pruebas unitarias. Se documentó el modelo en `docs/certification-model.md`. No se agregó UI, persistencia, migraciones, endpoints ni asociaciones con preguntas o temas.

## Acceptance Criteria

- [x] **Modelo** — Se definen `CertificationExam` y `Provider` en `frontend/src/models/`.
- [x] **Campos de CertificationExam** — `id`, `providerId`, `code`, `name`, `description`, `version`, `difficulty`, `isActive`, `imageUrl`.
- [x] **Campos de Provider** — `id`, `name`, `logo`, `color`.
- [x] **Código de examen único** — `certificationExamsSchema` rechaza códigos duplicados.
- [x] **Relación 1:N Provider → CertificationExam** — `CertificationExam` incluye `providerId`.
- [x] **Sin acoplamiento a AWS** — Nombres genéricos; ninguna referencia a AWS en el modelo.
- [x] **Extensible** — Agregar nuevos proveedores o exámenes solo requiere datos, no cambios en el modelo.
- [x] **Documentación** — JSDoc en cada entidad y documento `docs/certification-model.md`.
- [x] **Compilación** — `npm run build` ejecutado sin errores.
- [x] **Pruebas** — Se agregaron `providerSchema.test.ts` y `certificationExamSchema.test.ts`.
- [x] **Sin regresiones** — Todos los tests existentes continúan pasando.

## Archivos modificados

- `frontend/src/models/Provider.ts`: contrato TypeScript de proveedor.
- `frontend/src/models/CertificationExam.ts`: contrato TypeScript de examen.
- `frontend/src/schemas/providerSchema.ts`: validación Zod de proveedor.
- `frontend/src/schemas/certificationExamSchema.ts`: validación Zod de examen y unicidad de `code`.
- `frontend/src/schemas/providerSchema.test.ts`: pruebas del esquema de proveedor.
- `frontend/src/schemas/certificationExamSchema.test.ts`: pruebas del esquema de examen.
- `docs/certification-model.md`: documentación del dominio.

## Pruebas agregadas o modificadas

- `providerSchema.test.ts`: validación de proveedor completo, rechazo de `id` vacío y rechazo de `name` vacío.
- `certificationExamSchema.test.ts`: validación de examen completo, rechazo de `code` vacío, rechazo de dificultad inválida, detección de códigos duplicados y permiso de exámenes distintos para el mismo proveedor.

## Validaciones ejecutadas

- [x] `npm run lint`
- [x] `npm run validate:questions`
- [ ] `npm run validate:certifications` (no existe aún en el proyecto)
- [x] `npm run test`
- [x] `npm run build`

## Riesgos o limitaciones

- Ninguno identificado para el alcance de US-019.
- La unicidad del `code` se valida dentro de un array de exámenes; la garantía global dependerá de la futura capa de persistencia/servicio.

## Fuera de alcance confirmado

- Persistencia, migraciones, endpoints, UI, selector de certificaciones, asociación con preguntas y asociación con temas no fueron implementados.
