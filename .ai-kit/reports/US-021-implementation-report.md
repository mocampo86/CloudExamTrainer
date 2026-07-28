# Implementation Report

## Historia

- ID: US-021
- Título: Exponer certificaciones disponibles desde la API

## Resumen

Se implementó una API simulada en el frontend para consultar certificaciones disponibles, respetando la arquitectura sin backend del MVP. Se crearon DTOs, un servicio de aplicación, un módulo API con códigos de estado HTTP, datos de certificación/proveedor, pruebas y documentación OpenAPI.

## Acceptance Criteria

- [x] **Endpoint de listado** — `getCertifications()` en `src/api/certifications.ts` devuelve certificaciones activas con `200 OK`.
- [x] **Endpoint de detalle por id** — `getCertification(id)` devuelve `200 OK` o `404 Not Found`.
- [x] **Endpoint de detalle por código** — `getCertificationByCodeEndpoint(code)` devuelve `200 OK` o `404 Not Found`.
- [x] **Solo certificaciones activas** — el servicio filtra por `isActive === true`.
- [x] **Contratos DTO** — `CertificationListItemDto`, `CertificationDetailDto` y `ProviderSummaryDto` no exponen persistencia interna.
- [x] **Proveedor en la respuesta** — cada certificación incluye el proveedor con `id` y `name`.
- [x] **API genérica** — no asume AWS; lista preparada para múltiples proveedores.
- [x] **Servicio de aplicación** — `certificationService.ts` centraliza consultas y filtrado.
- [x] **Persistencia** — datos leídos desde `src/data/certifications/index.ts`.
- [x] **Certificación inicial** — `AWS Certified Solutions Architect - Associate` (`saa-c03`) activa.
- [x] **Validación y errores** — identificadores vacíos devuelven `400`; inexistentes `404`; errores inesperados `500`.
- [x] **Documentación de API** — `docs/certification-api.md` y `public/openapi.json`.
- [x] **Pruebas** — `certificationService.test.ts` y `certifications.test.ts` cubren listado, detalle, 404, inactivas y mapeo DTO.
- [x] **Calidad técnica** — lint, test y build exitosos.

## Archivos creados o modificados

- `frontend/src/data/certifications/index.ts`: proveedor AWS y certificación inicial.
- `frontend/src/models/CertificationDto.ts`: DTOs públicos.
- `frontend/src/services/certificationService.ts`: consultas y mapeo a DTOs.
- `frontend/src/services/certificationService.test.ts`: pruebas del servicio.
- `frontend/src/api/certifications.ts`: API simulada con códigos de estado.
- `frontend/src/api/certifications.test.ts`: pruebas de la API.
- `frontend/public/openapi.json`: especificación OpenAPI de los endpoints.
- `docs/certification-api.md`: documentación de la API.
- `.ai-kit/reports/US-021-implementation-report.md`: este reporte.

## Pruebas agregadas o modificadas

- `certificationService.test.ts`: listado activo ordenado, búsqueda por id y por código, casos nulos, mapeo a DTO.
- `certifications.test.ts`: respuestas `200 OK`, `404 Not Found`, `400 Bad Request`, inactivas filtradas.

## Validaciones ejecutadas

- [x] `npm run lint` — OK.
- [x] `npm run validate:questions` — OK.
- [ ] `npm run validate:certifications` — no existe aún.
- [x] `npm run test` — 86 tests passed.
- [x] `npm run build` — OK.

## Riesgos o limitaciones

- La API es una simulación en frontend; no hay servidor HTTP real, de acuerdo con el MVP sin backend.
- El token de cancelación (`CancellationToken`) no se implementó porque la arquitectura actual no lo utiliza.
- El inicio de cuestionarios, selector visual y asociación de resultados quedan fuera del alcance.

## Fuera de alcance confirmado

- Selector visual, modificación de la página de inicio, exposición de preguntas/temas, inicio de cuestionarios, resultados, paginación avanzada, búsqueda, filtros administrativos, CRUD de certificaciones, autenticación, APIs externas, caché distribuida y versionado histórico no fueron implementados.
