# API de resultados de intentos

Esta API permite crear un resultado de cuestionario finalizado. El resultado queda asociado a la certificación del cuestionario, resolviéndose siempre desde la fuente validada y evitando que el cliente altere la certificación.

## Endpoints

### `POST /api/attempt-results`

Crea un resultado a partir de una sesión de cuestionario completada.

- **Cuerpo de la solicitud:** `QuizSessionDto` (sesión completada).
- **Cuerpo de la respuesta exitosa (`200 OK`):** `AttemptResultDto`.
- **Códigos de error:**
  - `400 Bad Request` — sesión sin identificador de certificación.
  - `404 Not Found` — certificación inexistente o inactiva.
  - `500 Internal Server Error` — error inesperado.

## Contratos

### `AttemptResultDto`

| Propiedad        | Tipo      | Descripción                                                            |
| ---------------- | --------- | ---------------------------------------------------------------------- |
| `id`             | string    | Identificador del resultado (igual al de la sesión).                   |
| `session`        | object    | Sesión de cuestionario (`QuizSessionDto`).                             |
| `certification`  | object    | Resumen de la certificación (`CertificationSummaryDto`).               |
| `result`         | object    | Puntaje general del cuestionario (`QuizResultDto`).                    |
| `topicResults`   | array     | Resultados desglosados por tema (`TopicResultDto[]`).                  |
| `recommendations`| array     | Lista de recomendaciones generadas a partir del porcentaje.            |
| `startedAt`      | string    | Fecha de inicio en formato ISO 8601.                                   |
| `finishedAt`     | string    | Fecha de finalización en formato ISO 8601.                             |
| `duration`       | string    | Duración legible del cuestionario.                                     |

### `CertificationSummaryDto`

| Propiedad  | Tipo   | Descripción                                      |
| ---------- | ------ | ------------------------------------------------ |
| `id`       | string | Identificador de la certificación.               |
| `code`     | string | Código del examen.                               |
| `name`     | string | Nombre visible de la certificación.              |
| `provider` | object | Proveedor (`ProviderSummaryDto`).                |

### `QuizResultDto`

| Propiedad        | Tipo    | Descripción                                |
| ---------------- | ------- | ------------------------------------------ |
| `correctCount`   | integer | Cantidad de respuestas correctas.          |
| `incorrectCount` | integer | Cantidad de respuestas incorrectas.        |
| `percentage`     | integer | Porcentaje de acierto redondeado.          |
| `totalQuestions` | integer | Total de preguntas del cuestionario.       |

### `TopicResultDto`

| Propiedad        | Tipo    | Descripción                                |
| ---------------- | ------- | ------------------------------------------ |
| `topic`          | string  | Nombre del tema.                           |
| `correctCount`   | integer | Respuestas correctas en ese tema.          |
| `totalQuestions` | integer | Total de preguntas del tema.               |
| `percentage`     | integer | Porcentaje de acierto.                     |
| `classification` | string  | Clasificación del desempeño en el tema.    |

## Validaciones

1. La sesión recibida debe contener `certificationExamId`.
2. La certificación se resuelve desde el servicio de certificaciones, validando existencia y estado activo.
3. No se acepta una certificación enviada manualmente por el cliente; siempre se obtiene del contexto validado.
4. Se conservan los datos actuales de puntaje, respuestas, tema, fechas y duración.
5. No se modifica la lógica de corrección ni el cálculo del porcentaje.

## Migración de datos históricos

Los resultados históricos que carecían de certificación se asocian a `AWS Certified Solutions Architect - Associate` (`saa-c03`) siempre que sus preguntas pertenezcan a esa certificación. Si no es posible inferir la certificación, el registro se trata de forma explícita sin asignar un valor arbitrario. Desactivar una certificación no elimina sus resultados históricos.

## Especificación OpenAPI

La especificación completa se encuentra en `frontend/public/openapi.json`.
