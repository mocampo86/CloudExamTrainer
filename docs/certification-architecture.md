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
- `frontend/src/models/ExamDomain.ts`
- `frontend/src/models/Topic.ts`
- `frontend/src/models/Tag.ts`
- `frontend/src/models/QuestionTag.ts`
- `frontend/src/models/QuestionBank.ts`
- `frontend/src/models/AnswerOption.ts`
- `frontend/src/models/QuestionReference.ts`
- `frontend/src/models/CreateQuestionCommand.ts`
- `frontend/src/models/CreateQuestionResponse.ts`

Relaciones principales:

- Un `Provider` tiene muchos `CertificationExam`.
- Un `CertificationExam` tiene muchos `ExamDomain`, muchos `Topic` y muchas `QuestionBank`.
- Cada `ExamDomain`, cada `Topic` y cada `QuestionBank` pertenecen a exactamente un `CertificationExam`.
- Un `QuestionBank` puede referenciar opcionalmente un `ExamDomain` y un `Topic` de la misma certificación.
- Un `QuestionBank` tiene muchos `AnswerOption` y muchos `QuestionReference`.
- Un `QuestionBank` tiene muchas `Tag` a través de `QuestionTag`. En el MVP la relación se implementa mediante `tagIds: string[]` dentro de `QuestionBank`.
- `Tag` es global y puede reutilizarse entre certificaciones.

> **Nota sobre datos actuales:** los modelos `ExamDomain` y `Topic` están definidos, pero aún no existen archivos de datos separados. Los temas disponibles para cuestionarios se derivan del campo `topicId` de las preguntas migradas. Los dominios están preparados para futuro contenido.

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
   ├─ carga QuestionBank desde data/questionBanks/questionBanks.json
   ├─ filtra preguntas por certificationExamId, status active y topic
   └─ selecciona questionIds aleatorios
   │
   ▼
QuizPage (session.certificationExamId)
   │
   ▼
POST /api/attempt-results (createAttemptResult)
   │
   ├─ resuelve la certificación desde la sesión validada
   ├─ carga QuestionBank y calcula puntaje y topicResults
   └─ devuelve QuizAttemptResult con certificationSummary
   │
   ▼
ResultsPage (muestra certificación, puntaje y desempeño por tema)

POST /api/questions (createQuestion)
   │
   ├─ valida comando con createQuestionCommandSchema
   ├─ valida que la certificación exista y esté activa
   ├─ genera identificador, timestamps y opciones
   ├─ valida topic/domain contra la certificación
   └─ persiste en memoria (MVP) o en repositorio PostgreSQL (Feature 01.10) y devuelve CreateQuestionResponse
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
- **Preguntas (creación)**: `docs/questions-api.md`
  - `POST /api/questions` (US-032)

La especificación OpenAPI completa se encuentra en `frontend/public/openapi.json`.

## Capas del frontend

| Capa | Responsabilidad | Archivos relevantes |
| ---- | --------------- | ------------------- |
| Modelos | Contratos TypeScript | `frontend/src/models/*.ts` |
| Esquemas | Validación Zod | `frontend/src/schemas/*Schema.ts` |
| Datos | Contenido estático versionado | `frontend/src/data/certifications/index.ts`, `frontend/src/data/questionBanks/questionBanks.json` |
| Servicios | Lógica de negocio y mapeo a DTOs | `frontend/src/services/certificationService.ts`, `frontend/src/services/questionService.ts`, `frontend/src/services/resultService.ts`, `frontend/src/services/questionAdminService.ts`, `frontend/src/services/questionBankMigration.ts`, `frontend/src/services/questionBankContentMigration.ts` |
| Repositorio | Acceso a PostgreSQL para preguntas | `Infrastructure/Repositories/PostgreSqlQuestionRepository.ts` (Feature 01.10), `Domain/Repositories/IQuestionRepository.ts` |
| API | Adaptadores de endpoints | `frontend/src/api/certifications.ts` |
| Páginas | UI y flujo de usuario | `frontend/src/pages/HomePage.tsx`, `frontend/src/pages/QuizPage.tsx`, `frontend/src/pages/ResultsPage.tsx` |

## Integración con preguntas

Cada pregunta en `frontend/src/data/questionBanks/questionBanks.json` incluye el campo `certificationExamId` para filtrar el banco de preguntas por certificación. El servicio `questionService.ts` carga y valida el archivo con `questionBankSchema` y lo adapta al formato de cuestionario interno cuando corresponde. Ver `docs/question-format.md`.

### Persistencia en PostgreSQL (Feature 01.10)

En el futuro el banco de preguntas se persistirá en PostgreSQL mediante un `DbContext` y un repositorio `IQuestionRepository`:

- Las tablas `Question`, `AnswerOption`, `Tag`, `QuestionTag` y `QuestionReference` reflejan el modelo `QuestionBank` actual.
- El repositorio implementa lectura/escritura, listado paginado, filtros y eliminación lógica.
- El proceso de migración carga `frontend/src/data/questionBanks/questionBanks.json` en PostgreSQL de forma idempotente.
- El cuestionario seguirá funcionando con JSON mientras el repositorio no esté activo.

## Extensibilidad

Para agregar una nueva certificación:

1. Añadir el proveedor en `frontend/src/data/certifications/index.ts` si aún no existe.
2. Añadir el examen en `frontend/src/data/certifications/index.ts`.
3. Añadir los dominios de examen en `frontend/src/data/certifications/index.ts` o en el banco de datos correspondiente.
4. Asegurar que las preguntas en `frontend/src/data/questionBanks/questionBanks.json` incluyan el `certificationExamId` correspondiente y referencien dominios y temas válidos.
5. Las nuevas preguntas también pueden crearse mediante `POST /api/questions`, validadas por `questionAdminService.ts` y almacenadas en memoria durante la ejecución (MVP) o en el repositorio PostgreSQL (Feature 01.10).
6. No se requieren cambios en componentes, servicios ni lógica de cuestionario.

## Alcance actual

- Se soporta una única certificación activa inicial: **AWS Certified Solutions Architect - Associate** (`saa-c03`).
- La arquitectura está preparada para múltiples certificaciones.
- El banco de preguntas se implementa como JSON estático validado con Zod en el frontend, siguiendo las reglas de arquitectura del MVP que no incluyen backend ni base de datos.
- La **Feature 01.10 - Persistencia PostgreSQL del banco de preguntas** añadirá el backend/repositorio necesario para persistir preguntas en PostgreSQL (post-MVP).
- Los contenidos legacy en `frontend/src/data/questions/*.json` pueden migrarse a `frontend/src/data/questionBanks/questionBanks.json` mediante `frontend/scripts/migrateQuestionBankContent.ts`.
- El endpoint `POST /api/questions` permite crear preguntas en memoria acorde al alcance del MVP.
- No se implementa panel administrativo ni endpoints de escritura completos.

## Entorno de desarrollo con Docker (Feature 01.11)

- Se contempla un `Dockerfile` multi-etapa para el frontend y un `docker-compose.yml` para levantar el entorno de desarrollo.
- El contenedor de desarrollo soporta hot-reload y monta el código fuente como volumen.
- El `docker-compose` incluye un servicio opcional de PostgreSQL para soportar la **Feature 01.10** sin modificar el funcionamiento actual del cuestionario.
- Ver `README.md` para los comandos de uso.
