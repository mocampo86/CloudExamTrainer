# Formato de preguntas

El archivo de preguntas actual es un JSON que contiene un array de objetos `QuestionBank`. Cada pregunta pertenece a un examen de certificación identificado por `certificationExamId`.

La ruta del archivo es `frontend/src/data/questionBanks/questionBanks.json`. El contenido legacy en `frontend/src/data/questions/*.json` sigue el formato antiguo descrito en la sección [Formato legacy](#formato-legacy).

> **Nota sobre persistencia:** el formato JSON es el origen de datos del MVP y la semilla de migración hacia PostgreSQL. La **Feature 01.10 - Persistencia PostgreSQL del banco de preguntas** utilizará este mismo esquema para cargar el contenido en tablas relacionales sin modificar el contrato del archivo.

## Estructura QuestionBank

| Propiedad           | Tipo                              | Descripción                                                    |
| ------------------- | --------------------------------- | -------------------------------------------------------------- |
| `id`                | `string`                          | Identificador único de la pregunta.                            |
| `certificationExamId` | `string`                          | Identificador del examen de certificación al que pertenece.    |
| `examDomainId`      | `string` (opcional)               | Identificador del dominio de examen asociado.                  |
| `topicId`           | `string` (opcional)               | Identificador del tema asociado.                               |
| `externalCode`      | `string` (opcional)               | Código externo único dentro de la certificación.               |
| `statement`         | `string`                          | Enunciado de la pregunta.                                      |
| `explanation`       | `string` (opcional)               | Explicación de la respuesta correcta.                          |
| `type`              | `string`                          | Tipo: `single_choice` o `multiple_choice`.                     |
| `difficulty`        | `string`                          | Dificultad: `easy`, `medium` o `hard`.                         |
| `status`            | `string`                          | Estado: `draft`, `active` o `archived`.                        |
| `language`          | `string`                          | Idioma del contenido, por ejemplo `en` o `es`.                 |
| `isActive`          | `boolean`                         | Indica si la pregunta está activa.                             |
| `options`           | `array`                           | Lista de opciones. Ver [AnswerOption](#answeroption).          |
| `tagIds`            | `array`                           | Identificadores de etiquetas asociadas.                        |
| `references`        | `array`                           | Lista de referencias. Ver [QuestionReference](#questionreference). |
| `createdAt`         | `string`                          | Fecha de creación en formato ISO 8601.                         |
| `updatedAt`         | `string`                          | Fecha de última actualización en formato ISO 8601.             |

### AnswerOption

| Propiedad      | Tipo     | Descripción                                                   |
| -------------- | -------- | ------------------------------------------------------------- |
| `id`           | `string` | Identificador único de la opción dentro de la pregunta.       |
| `questionId`   | `string` | Identificador de la pregunta a la que pertenece.              |
| `text`         | `string` | Texto de la opción.                                           |
| `isCorrect`    | `boolean` | Indica si la opción es correcta.                             |
| `displayOrder` | `number` | Orden de presentación. No puede ser negativo.                 |

### QuestionReference

| Propiedad       | Tipo     | Descripción                                                   |
| --------------- | -------- | ------------------------------------------------------------- |
| `id`            | `string` | Identificador único de la referencia.                         |
| `questionId`    | `string` | Identificador de la pregunta a la que pertenece.              |
| `title`         | `string` | Título del recurso.                                           |
| `url`           | `string` | URL del recurso. Solo se permiten esquemas `http` y `https`.  |
| `referenceType` | `string` | Tipo: `official_documentation`, `whitepaper` u `other`.       |
| `displayOrder`  | `number` | Orden de presentación. No puede ser negativo.                 |

## Reglas

- `statement` es obligatorio y no puede contener solo espacios.
- `options` debe contener al menos dos opciones.
- Para `single_choice`, exactamente una opción debe tener `isCorrect === true`.
- Para `multiple_choice`, al menos dos opciones deben tener `isCorrect === true` y al menos una debe ser incorrecta.
- No se permiten opciones duplicadas dentro de una pregunta.
- No se permiten `displayOrder` duplicados dentro de `options` ni dentro de `references`.
- `tagIds` no debe contener identificadores duplicados.
- Cada `topicId` y `examDomainId` debe pertenecer a la misma certificación que `certificationExamId`.
- Solo las preguntas con `status === "active"` se utilizan en cuestionarios públicos.

## Ejemplo QuestionBank

```json
[
  {
    "id": "q001",
    "certificationExamId": "saa-c03",
    "topicId": "compute",
    "statement": "Which Azure service lets you run containers without managing servers?",
    "explanation": "Azure Container Instances runs containers without requiring server management.",
    "type": "single_choice",
    "difficulty": "easy",
    "status": "active",
    "language": "en",
    "isActive": true,
    "options": [
      {
        "id": "opt1",
        "questionId": "q001",
        "text": "Azure Container Instances",
        "isCorrect": true,
        "displayOrder": 0
      },
      {
        "id": "opt2",
        "questionId": "q001",
        "text": "Azure Virtual Machines",
        "isCorrect": false,
        "displayOrder": 1
      },
      {
        "id": "opt3",
        "questionId": "q001",
        "text": "Azure App Service",
        "isCorrect": false,
        "displayOrder": 2
      }
    ],
    "tagIds": [],
    "references": [],
    "createdAt": "2026-07-28T18:51:27.820Z",
    "updatedAt": "2026-07-28T18:51:27.820Z"
  }
]
```

## Formato legacy

Los archivos en `frontend/src/data/questions/*.json` usan un formato anterior que se mantiene solo por compatibilidad de migración. El script `frontend/scripts/migrateQuestionBankContent.ts` transforma esos archivos al formato `QuestionBank`.

### Estructura legacy

| Propiedad        | Tipo      | Descripción                                                    |
| ---------------- | --------- | -------------------------------------------------------------- |
| `id`             | `string`  | Identificador único de la pregunta.                            |
| `certificationExamId` | `string`  | Identificador del examen de certificación al que pertenece.    |
| `topic`          | `string`  | Tema al que pertenece la pregunta.                             |
| `difficulty`     | `string`  | Dificultad: `easy`, `medium` o `hard`.                         |
| `type`           | `string`  | Tipo: `single_choice` o `multiple_choice`.                     |
| `question`       | `string`  | Enunciado de la pregunta.                                      |
| `options`        | `array`   | Lista de opciones. Cada opción tiene `id` y `text`.            |
| `correctAnswers` | `array`   | IDs de las opciones correctas.                                 |
| `explanation`    | `string`  | Explicación de la respuesta correcta.                          |

### Ejemplo legacy

```json
[
  {
    "id": "q001",
    "certificationExamId": "saa-c03",
    "topic": "Azure Compute",
    "difficulty": "easy",
    "type": "single_choice",
    "question": "¿Qué servicio de Azure permite ejecutar contenedores sin administrar servidores?",
    "options": [
      { "id": "opt1", "text": "Azure Container Instances" },
      { "id": "opt2", "text": "Azure Virtual Machines" },
      { "id": "opt3", "text": "Azure App Service" }
    ],
    "correctAnswers": ["opt1"],
    "explanation": "Azure Container Instances permite ejecutar contenedores sin gestionar infraestructura."
  }
]
```
