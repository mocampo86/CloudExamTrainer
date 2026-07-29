# API administrativa de preguntas

Esta API expone las operaciones de gestión del banco de preguntas. En el MVP la persistencia se implementa en memoria sobre el mismo archivo JSON estático que consume el cuestionario, siguiendo las reglas de arquitectura que no incluyen backend ni base de datos.

> **Alcance actual:** solo está implementado el endpoint de creación (`POST /api/questions`, US-032). Las operaciones de edición, consulta por ID, listado paginado, filtros, activación/desactivación, eliminación lógica y duplicado se mantienen en backlog.

## Endpoints

### `POST /api/questions`

Crea una nueva pregunta en el banco de preguntas.

- **Cuerpo de la solicitud:** `CreateQuestionRequest`
- **Cuerpo de la respuesta exitosa (`201 Created`):** `CreateQuestionResponse`
- **Códigos de error:**
  - `400 Bad Request` — error de validación en el request, opciones inválidas o código externo duplicado dentro de la certificación.
  - `404 Not Found` — certificación, dominio o tema no encontrados o inactivos.
  - `500 Internal Server Error` — error inesperado durante la creación.

## Contratos

### `CreateQuestionOptionRequest`

| Propiedad   | Tipo    | Requerido | Descripción                              |
| ----------- | ------- | --------- | ---------------------------------------- |
| `text`      | string  | Sí        | Texto visible de la opción.              |
| `isCorrect` | boolean | Sí        | Indica si la opción es correcta.         |

### `CreateQuestionRequest`

| Propiedad             | Tipo                              | Requerido | Descripción                                                              |
| --------------------- | --------------------------------- | --------- | ------------------------------------------------------------------------ |
| `certificationExamId` | string                            | Sí        | Identificador del examen de certificación al que pertenece la pregunta.  |
| `examDomainId`        | string                            | No        | Identificador del dominio de examen. Debe pertenecer al mismo examen.    |
| `topicId`             | string                            | No        | Identificador del tema. Debe pertenecer al mismo examen.                 |
| `externalCode`        | string                            | No        | Código externo único dentro de la certificación.                         |
| `statement`           | string                            | Sí        | Enunciado de la pregunta.                                                |
| `explanation`         | string                            | No        | Explicación de la respuesta correcta.                                    |
| `type`                | `single_choice` \| `multiple_choice` | Sí     | Tipo de pregunta.                                                        |
| `difficulty`          | `easy` \| `medium` \| `hard`      | Sí        | Nivel de dificultad.                                                     |
| `language`            | string                            | No        | Idioma del contenido. Valor por defecto `en`.                            |
| `options`             | `CreateQuestionOptionRequest[]`   | Sí        | Opciones de respuesta. Mínimo dos opciones.                              |
| `tagIds`              | string[]                          | No        | Identificadores de etiquetas asociadas.                                  |

### `CreateQuestionResponse`

| Propiedad             | Tipo                              | Descripción                                                              |
| --------------------- | --------------------------------- | ------------------------------------------------------------------------ |
| `id`                  | string                            | Identificador único generado para la pregunta.                           |
| `certificationExamId` | string                            | Identificador del examen de certificación.                               |
| `examDomainId`        | string                            | Dominio de examen asociado (opcional).                                   |
| `topicId`             | string                            | Tema asociado (opcional).                                                |
| `externalCode`        | string                            | Código externo (opcional).                                               |
| `statement`           | string                            | Enunciado de la pregunta.                                                |
| `explanation`         | string                            | Explicación (opcional).                                                  |
| `type`                | `single_choice` \| `multiple_choice` | Tipo de pregunta.                                                     |
| `difficulty`          | `easy` \| `medium` \| `hard`      | Nivel de dificultad.                                                     |
| `status`              | `draft` \| `active` \| `archived` | Estado del ciclo de vida. Siempre `active` tras la creación.             |
| `language`            | string                            | Idioma del contenido.                                                    |
| `isActive`            | boolean                           | Indica si la pregunta está activa. Siempre `true` tras la creación.      |
| `options`             | `CreatedQuestionOption[]`         | Opciones generadas con identificador y orden de presentación.            |
| `tagIds`              | string[]                          | Identificadores de etiquetas asociadas.                                  |
| `createdAt`           | string                            | Fecha de creación en formato ISO 8601.                                   |
| `updatedAt`           | string                            | Fecha de última actualización en formato ISO 8601.                       |

### `CreatedQuestionOption`

| Propiedad      | Tipo    | Descripción                                              |
| -------------- | ------- | -------------------------------------------------------- |
| `id`           | string  | Identificador único generado dentro de la pregunta.      |
| `text`         | string  | Texto visible de la opción.                              |
| `isCorrect`    | boolean | Indica si la opción es correcta.                         |
| `displayOrder` | number  | Orden de presentación asignado automáticamente.          |

## Validaciones

1. `certificationExamId`, `statement`, `type`, `difficulty` y `options` son obligatorios.
2. `statement` no puede estar vacío ni contener solo espacios. Longitud máxima 5000 caracteres.
3. `explanation` tiene longitud máxima 5000 caracteres.
4. `externalCode` tiene longitud máxima 100 caracteres y debe ser único dentro de la certificación.
5. `language` tiene longitud máxima 10 caracteres y vale `en` por defecto.
6. `options` debe contener al menos dos elementos.
7. Cada opción debe tener `text` no vacío después de trim. Longitud máxima 1000 caracteres.
8. No se permiten opciones duplicadas dentro de una pregunta tras normalizar el texto.
9. Para `single_choice`, exactamente una opción debe tener `isCorrect === true`.
10. Para `multiple_choice`, al menos dos opciones deben tener `isCorrect === true` y al menos una debe ser incorrecta.
11. Si se envía `topicId`, debe pertenecer a la certificación indicada.
12. Si se envía `examDomainId`, debe pertenecer a la certificación indicada.
13. `tagIds` no debe contener identificadores duplicados.

## Proceso de creación

1. El endpoint `frontend/src/api/questions.ts` recibe el comando.
2. Delega la validación y persistencia a `frontend/src/services/questionAdminService.ts`.
3. Se valida el shape del comando con `frontend/src/schemas/createQuestionCommandSchema.ts`.
4. Se verifica que la certificación exista y esté activa.
5. Se genera un identificador único y los timestamps en formato ISO 8601.
6. Se construye la entidad `QuestionBank` y se revalida con `questionBankSchema`.
7. Se valida la unicidad del `externalCode` y la pertenencia de `topicId`/`examDomainId`.
8. Se persiste la pregunta en memoria y se devuelve la respuesta.

## Alcance actual

- Se soporta la creación de preguntas de tipo `single_choice` y `multiple_choice`.
- La persistencia es en memoria durante la ejecución, acorde al MVP.
- No se implementan edición, eliminación, listado, filtros ni paginación en este endpoint.
- No se almacenan imágenes ni archivos adjuntos.

## Archivos relevantes

- `frontend/src/api/questions.ts`
- `frontend/src/services/questionAdminService.ts`
- `frontend/src/models/CreateQuestionCommand.ts`
- `frontend/src/models/CreateQuestionResponse.ts`
- `frontend/src/schemas/createQuestionCommandSchema.ts`
- `frontend/src/schemas/questionBankSchema.ts`

## Especificación OpenAPI

La especificación completa se encuentra en `frontend/public/openapi.json`.
