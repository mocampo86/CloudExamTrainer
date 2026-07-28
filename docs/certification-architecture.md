# Arquitectura de gestión de certificaciones y exámenes

Este documento describe la arquitectura base implementada en **Feature 01.07 - Gestión base de certificaciones y exámenes** para soportar múltiples certificaciones en Cloud Exam Trainer sin acoplar la aplicación a un examen específico.

## Objetivo

- Desacoplar la aplicación de una certificación específica.
- Permitir agregar nuevas certificaciones y proveedores mediante configuración y datos.
- Asegurar que temas, preguntas, cuestionarios y resultados se mantengan dentro del contexto de una certificación.

## Principios arquitectónicos

- **Generidad**: el modelo no depende de AWS ni de ningún proveedor concreto.
- **Configuración sobre código**: las certificaciones se definen en `frontend/src/data/certifications/index.ts`, no en componentes.
- **Separación de responsabilidades**: modelos, esquemas, servicios, API y UI tienen capas claras.
- **Referencias estables**: las relaciones se establecen por `id` de certificación, no por el nombre visible.

## Entidades y relaciones

El contrato del dominio se define en `docs/certification-model.md` y se implementa en:

- `frontend/src/models/Provider.ts`
- `frontend/src/models/CertificationExam.ts`
- `frontend/src/models/Topic.ts`
- `frontend/src/models/Question.ts`

Relaciones principales:

- Un `Provider` tiene muchos `CertificationExam`.
- Un `CertificationExam` tiene muchos `Topic` y muchas `Question`.
- Cada `Question` y cada `Topic` pertenecen a exactamente un `CertificationExam`.
- `Topic` → `Question` se mantiene a través del campo `topic` de `Question`.

## Flujo de datos

```
Página de inicio
   │
   ├─ GET /api/certifications ──> certificationService
   │                                     │
   │                                     ▼
   │                           data/certifications/index.ts
   │
   ▼
Selector de certificación
   │
   ├─ topic depende de certificationExamId
   │
   ▼
POST /api/quiz-sessions (startQuizSession)
   │
   ├─ valida certificación activa
   ├─ valida que el tema pertenezca a la certificación
   └─ selecciona preguntas filtradas por certificationExamId y topic
   │
   ▼
QuizPage (session.certificationExamId)
   │
   ▼
POST /api/attempt-results (createAttemptResult)
   │
   ├─ resuelve la certificación desde la sesión validada
   ├─ calcula puntaje y topicResults
   └─ devuelve QuizAttemptResult con certificationSummary
   │
   ▼
ResultsPage (muestra certificación, puntaje y desempeño por tema)
```

## APIs

- **Certificaciones**: `docs/certification-api.md`
  - `GET /api/certifications`
  - `GET /api/certifications/:id`
  - `GET /api/certifications/code/:code`
- **Cuestionarios**: `docs/quiz-api.md`
  - `POST /api/quiz-sessions`
- **Resultados**: `docs/result-api.md`
  - `POST /api/attempt-results`

La especificación OpenAPI completa se encuentra en `frontend/public/openapi.json`.

## Capas del frontend

| Capa | Responsabilidad | Archivos relevantes |
| ---- | --------------- | ------------------- |
| Modelos | Contratos TypeScript | `frontend/src/models/*.ts` |
| Esquemas | Validación Zod | `frontend/src/schemas/*Schema.ts` |
| Datos | Contenido estático versionado | `frontend/src/data/certifications/index.ts`, `frontend/src/data/questions/*.json` |
| Servicios | Lógica de negocio y mapeo a DTOs | `frontend/src/services/certificationService.ts`, `frontend/src/services/questionService.ts`, `frontend/src/services/resultService.ts` |
| API | Adaptadores de endpoints | `frontend/src/api/certifications.ts` |
| Páginas | UI y flujo de usuario | `frontend/src/pages/HomePage.tsx`, `frontend/src/pages/QuizPage.tsx`, `frontend/src/pages/ResultsPage.tsx` |

## Integración con preguntas

Cada pregunta en los archivos JSON incluye el campo `certificationExamId` para filtrar el banco de preguntas por certificación. Ver `docs/question-format.md`.

## Extensibilidad

Para agregar una nueva certificación:

1. Añadir el proveedor en `frontend/src/data/certifications/index.ts` si aún no existe.
2. Añadir el examen en `frontend/src/data/certifications/index.ts`.
3. Asegurar que las preguntas y temas asociados incluyan el `certificationExamId` correspondiente.
4. No se requieren cambios en componentes, servicios ni lógica de cuestionario.

## Alcance actual

- Se soporta una única certificación activa inicial: **AWS Certified Solutions Architect - Associate** (`saa-c03`).
- La arquitectura está preparada para múltiples certificaciones.
- No se implementan migraciones, panel administrativo, ni endpoints de escritura.
