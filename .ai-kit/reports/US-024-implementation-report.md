# Implementation Report

## Historia

- ID: US-024
- Título: Asociar resultados a la certificación realizada

## Resumen

Se actualizó el flujo de finalización de cuestionarios para que cada resultado quede asociado a la certificación con la que se generó. Se creó el modelo `QuizAttemptResult`, el servicio `resultService` resuelve la certificación desde la fuente validada, y la página de resultados muestra el nombre del proveedor y la certificación. Los contratos y la documentación OpenAPI reflejan la nueva estructura.

## Acceptance Criteria

- [x] **Asociación del resultado** — todo resultado nuevo incluye `certification` con `id`, `code`, `name` y `provider`.
- [x] **Coincidencia con cuestionario** — `createAttemptResult` toma `certificationExamId` desde la sesión y resuelve la certificación validada.
- [x] **Sin certificación no se guarda** — `createAttemptResult` rechaza sesiones sin `certificationExamId`.
- [x] **No se modifica la certificación** — el servicio ignora cualquier certificación enviada externamente y resuelve desde `certificationService`.
- [x] **Identificador estable** — se usa `certificationExamId` y el DTO correspondiente.
- [x] **Modelo de resultado** — `QuizAttemptResult` incluye referencia `certification`, `session`, `result`, `topicResults`, `recommendations`.
- [x] **Validación** — `createAttemptResult` valida certificación activa antes de persistir el resultado.
- [x] **Página de resultados** — `ResultSummary` muestra `Certificación: Proveedor — Nombre`.
- [x] **Sin valor por defecto incorrecto** — si la certificación no se resuelve, se rechaza el resultado; no se usa un fallback.
- [x] **Contrato de respuesta** — `AttemptResultDto` en OpenAPI incluye `certification` con id, code, name y provider.
- [x] **Historial** — `filterAttemptResultsByCertification` permite filtrar resultados por certificación.
- [x] **Migración histórica** — documentada en `docs/result-api.md`: resultados históricos sin certificación se asocian a `saa-c03` cuando sus preguntas pertenezcan a ella; en caso contrario se define tratamiento explícito.
- [x] **No se modifica corrección/puntaje** — `scoringService` permanece igual.
- [x] **Pruebas** — `resultService.test.ts` cubre creación, coincidencia, rechazo sin certificación, rechazo con certificación inexistente y filtrado por certificación. `ResultsPage.test.tsx` y `QuizPage.test.tsx` actualizados.
- [x] **Calidad técnica** — `npm run lint`, `npm run validate:questions`, `npm run test` y `npm run build` exitosos.

## Archivos modificados y creados

- `frontend/src/models/QuizAttemptResult.ts` (creado): modelo de resultado con referencia a certificación.
- `frontend/src/services/resultService.ts` (creado): `createAttemptResult` y `filterAttemptResultsByCertification`.
- `frontend/src/services/resultService.test.ts` (creado): pruebas del servicio de resultados.
- `frontend/src/pages/QuizPage.tsx`: al finalizar, `finishQuiz` crea `QuizAttemptResult` y navega con él.
- `frontend/src/pages/QuizPage.test.tsx`: ajustes por `QuizAttemptResult` y asincronía de `createAttemptResult`.
- `frontend/src/pages/ResultsPage.tsx`: consume `QuizAttemptResult` y muestra la certificación.
- `frontend/src/pages/ResultsPage.test.tsx`: fixtures actualizados a `QuizAttemptResult` y prueba de certificación.
- `frontend/src/components/ResultSummary.tsx`: acepta y muestra `certification`.
- `frontend/src/styles/globals.css`: estilo `.result-summary__certification`.
- `frontend/public/openapi.json`: endpoint `/attempt-results` y esquemas `AttemptResultDto`, `CertificationSummaryDto`, `QuizResultDto`, `TopicResultDto`.
- `docs/result-api.md` (creado): documentación del endpoint y contratos de resultados.
- `.ai-kit/reports/US-024-implementation-report.md`: este reporte.

## Validaciones ejecutadas

- [x] `npm run lint` — OK.
- [x] `npm run validate:questions` — OK.
- [x] `npm run test` — 104 tests passed.
- [x] `npm run build` — OK.

## Fuera de alcorte confirmado

- No se implementaron estadísticas avanzadas, gráficos históricos, dashboards, recomendaciones automáticas, exportación, certificados, ranking, filtros visuales avanzados ni eliminación de resultados.
- No se modificó la lógica de corrección ni el cálculo de puntaje.
- No se crearon nuevas certificaciones.
