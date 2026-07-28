# API de cuestionarios

Esta API permite iniciar un cuestionario filtrado por la certificación seleccionada. La certificación es un criterio obligatorio y validado; las preguntas devueltas pertenecen exclusivamente a esa certificación y, opcionalmente, a un tema dentro de ella.

## Endpoints

### `POST /api/quiz-sessions`

Crea una nueva sesión de cuestionario para una certificación y un tema opcional.

- **Cuerpo de la solicitud:** `StartQuizSessionRequest`
- **Cuerpo de la respuesta exitosa (`200 OK`):** `QuizSessionDto`
- **Códigos de error:**
  - `400 Bad Request` — solicitud inválida o sin campos obligatorios.
  - `404 Not Found` — certificación inexistente o inactiva.
  - `422 Unprocessable Entity` — tema que no pertenece a la certificación.
  - `500 Internal Server Error` — error inesperado o cantidad de preguntas insuficiente.

## Contratos

### `StartQuizSessionRequest`

| Propiedad             | Tipo    | Requerido | Descripción                                                    |
| --------------------- | ------- | --------- | -------------------------------------------------------------- |
| `certificationExamId` | string  | Sí        | Identificador de la certificación seleccionada.                |
| `topic`               | string  | No        | Tema del cual se desean preguntas.                             |
| `count`               | integer | Sí        | Cantidad de preguntas a seleccionar (mayor o igual a 1).       |

### `QuizSessionDto`

| Propiedad             | Tipo     | Descripción                                                        |
| --------------------- | -------- | ------------------------------------------------------------------ |
| `id`                  | string   | Identificador único de la sesión.                                  |
| `topic`               | string   | Tema del cuestionario (puede estar vacío si no se especificó).    |
| `certificationExamId` | string   | Identificador de la certificación asociada.                        |
| `questionIds`         | string[] | Identificadores de las preguntas seleccionadas.                    |
| `currentIndex`        | integer  | Índice de la pregunta actual.                                      |
| `answers`             | object   | Mapa de respuestas seleccionadas por `questionId`.                 |
| `status`              | string   | Estado de la sesión (`not_started`, `in_progress`, `completed`).   |
| `startedAt`           | string   | Fecha de inicio en formato ISO 8601.                               |
| `finishedAt`          | string   | Fecha de finalización en formato ISO 8601 (opcional).              |

## Validaciones

1. `certificationExamId` debe estar presente y no ser vacío.
2. La certificación indicada debe existir y estar activa.
3. Si se envía `topic`, debe pertenecer a la certificación seleccionada.
4. La cantidad `count` debe ser mayor que cero y no superar las preguntas disponibles.
5. El orden de las preguntas se mantiene aleatorio, pero siempre dentro del filtro de certificación y tema.

## Flujo de integración

1. El frontend obtiene las certificaciones disponibles mediante `GET /api/certifications`.
2. El usuario selecciona una certificación, un tema opcional y la cantidad de preguntas.
3. El frontend envía `POST /api/quiz-sessions` con `certificationExamId`, `topic` y `count`.
4. El servicio valida la certificación y el tema, selecciona las preguntas y devuelve `QuizSessionDto`.
5. El frontend navega a la página del cuestionario con la sesión recibida.
6. Las páginas de cuestionario y resultados utilizan `certificationExamId` de la sesión para filtrar preguntas y reintentar.

## Especificación OpenAPI

La especificación completa se encuentra en `public/openapi.json`.
