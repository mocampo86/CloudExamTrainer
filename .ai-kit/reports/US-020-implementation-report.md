# Implementation Report

## Historia

- ID: US-020
- Título: Asociar temas y preguntas a una certificación

## Resumen

Se asoció cada pregunta y cada tema a un `CertificationExam` mediante `certificationExamId`. Se actualizaron el modelo, el esquema Zod, los archivos JSON de preguntas, el servicio de consultas y las pruebas. El contenido existente se migró al examen `saa-c03`. No se modificó la lógica de evaluación ni la UI.

## Acceptance Criteria

- [x] **Cada Topic pertenece a una CertificationExam** — `Topic` define `certificationExamId`; `questionService` filtra temas por certificación.
- [x] **Cada Question pertenece a una CertificationExam** — `Question` incluye `certificationExamId` requerido; `questionSchema` lo valida.
- [x] **Relación Topic → Question se mantiene** — `Question.topic` permanece; el tema se deriva de las preguntas asociadas a la certificación.
- [x] **No existen preguntas sin certificación** — `certificationExamId` es obligatorio en el esquema.
- [x] **No existen temas sin certificación** — los temas se obtienen de las preguntas filtradas por `certificationExamId`.
- [x] **Una pregunta solo pertenece a una certificación** — `Question.certificationExamId` es un único string.
- [x] **Un tema solo pertenece a una certificación** — la identidad del tema es `(certificationExamId, name)`.
- [x] **Evita mezclar preguntas de diferentes certificaciones** — `questionService` filtra por `certificationExamId`.
- [x] **Consultas permiten filtrar por CertificationExamId** — `getQuestionsByTopic`, `getRandomQuestions`, `getTopics`, `getQuestionCountByTopic` y `getQuestionById` aceptan `certificationExamId`.
- [x] **Migración del contenido actual** — todas las preguntas JSON existentes quedaron asociadas a `saa-c03`.
- [x] **No se pierde información existente** — campos y datos originales se preservaron.
- [x] **No cambia la lógica de evaluación** — `scoringService` no se modificó.
- [x] **Compila sin errores** — `npm run build` exitoso.
- [x] **Pruebas de relaciones** — se agregaron tests en `questionService.test.ts` y `questionValidation.test.ts`.

## Archivos modificados

- `frontend/src/models/Question.ts`: agregado `certificationExamId`.
- `frontend/src/models/Topic.ts`: nuevo modelo `Topic`.
- `frontend/src/schemas/questionSchema.ts`: `certificationExamId` requerido; unicidad de `id` por certificación.
- `frontend/src/services/questionService.ts`: filtrado por `certificationExamId` y constante `DEFAULT_CERTIFICATION_EXAM_ID`.
- `frontend/src/services/questionService.test.ts`: pruebas de filtrado por certificación.
- `frontend/src/services/scoringService.test.ts`: actualización de fixtures `Question`.
- `frontend/src/utils/questionValidation.test.ts`: `certificationExamId` en fixture y prueba de ausencia.
- `frontend/src/data/questions/*.json`: migración de preguntas a `saa-c03`.
- `frontend/public/sample-questions.json`: migración a `saa-c03`.
- `frontend/src/schemas/__fixtures__/valid-questions.json`: agregado `certificationExamId`.
- `frontend/src/schemas/__fixtures__/invalid-questions.json`: agregado `certificationExamId`.
- `docs/certification-model.md`: documentación de `Topic`, `Question` y relaciones.

## Pruebas agregadas o modificadas

- `questionService.test.ts`: filtrado por `certificationExamId`, resultados vacíos para certificación inexistente, búsqueda por id filtrada.
- `questionValidation.test.ts`: rechazo de pregunta sin `certificationExamId`.
- Tests existentes actualizados para incluir `certificationExamId` en objetos `Question`.

## Validaciones ejecutadas

- [x] `npm run lint`
- [x] `npm run validate:questions`
- [ ] `npm run validate:certifications` (no existe aún en el proyecto)
- [x] `npm run test`
- [x] `npm run build`

## Riesgos o limitaciones

- `getQuestionById` sin `certificationExamId` busca en todas las preguntas. Cuando se agreguen certificaciones con posibles `id` duplicados, `QuizSession` deberá incluir `certificationExamId` (US-023/024).
- Los temas se derivan de las preguntas; no hay archivo de temas independiente todavía.

## Fuera de alcance confirmado

- Selector de certificación, endpoints públicos, cambios visuales, resultados, historial y persistencia no fueron implementados.
