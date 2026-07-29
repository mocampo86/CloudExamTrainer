# Modelo de certificaciones y exámenes

Este documento describe las entidades base del dominio para soportar múltiples certificaciones y exámenes en Cloud Exam Trainer.

## Entidades

### Provider

Representa un proveedor tecnológico que ofrece certificaciones.

| Propiedad | Tipo   | Descripción                                        |
| --------- | ------ | -------------------------------------------------- |
| `id`      | string | Identificador único del proveedor.                 |
| `name`    | string | Nombre visible del proveedor.                      |
| `logo`    | string | URL o ruta al logo del proveedor.                  |
| `color`   | string | Color de marca para la interfaz (valor CSS válido). |

### CertificationExam

Representa un examen de certificación ofrecido por un proveedor.

| Propiedad     | Tipo                              | Descripción                                              |
| ------------- | --------------------------------- | -------------------------------------------------------- |
| `id`          | string                            | Identificador único del examen.                          |
| `providerId`  | string                            | Referencia al proveedor que ofrece el examen.            |
| `code`        | string                            | Código único del examen (por ejemplo, `SAA-C03`).        |
| `name`        | string                            | Nombre visible del examen.                               |
| `description` | string                            | Descripción corta del examen.                            |
| `version`     | string                            | Versión o revisión del examen.                           |
| `difficulty`  | `easy` \| `medium` \| `hard`      | Nivel de dificultad del examen.                          |
| `isActive`    | boolean                           | Indica si el examen está activo y disponible.            |
| `imageUrl`    | string                            | URL o ruta a la imagen o insignia del examen.            |

### ExamDomain

Representa un dominio de examen dentro de una certificación. Permite clasificar las preguntas según la estructura oficial o funcional del examen sin acoplar el modelo a un proveedor específico.

| Propiedad           | Tipo    | Descripción                                                   |
| ------------------- | ------- | ------------------------------------------------------------- |
| `id`                | string  | Identificador único del dominio.                              |
| `certificationExamId` | string  | Referencia al examen al que pertenece el dominio.             |
| `code`              | string  | Código único dentro de la certificación (por ejemplo, `D1`).  |
| `name`              | string  | Nombre visible del dominio.                                   |
| `description`       | string  | Descripción opcional del dominio.                             |
| `displayOrder`      | number  | Orden de presentación. No admite valores negativos.           |
| `isActive`          | boolean | Indica si el dominio está activo y disponible para contenido. |

### Topic

Representa un tema dentro de un examen de certificación.

| Propiedad           | Tipo   | Descripción                                     |
| ------------------- | ------ | ----------------------------------------------- |
| `id`                | string | Identificador único del tema.                   |
| `certificationExamId` | string | Referencia al examen al que pertenece el tema.  |
| `name`              | string | Nombre visible del tema.                        |

### Tag

Representa una etiqueta global que puede reutilizarse entre certificaciones para clasificar preguntas por servicios, patrones o conceptos transversales.

| Propiedad     | Tipo    | Descripción                                                   |
| ------------- | ------- | ------------------------------------------------------------- |
| `id`          | string  | Identificador único de la etiqueta.                           |
| `name`        | string  | Nombre visible de la etiqueta.                                |
| `slug`        | string  | Identificador normalizado único.                              |
| `description` | string  | Descripción opcional.                                         |
| `isActive`    | boolean | Indica si la etiqueta está activa y disponible para contenido.|

### QuestionTag

Representa la relación many-to-many entre una pregunta y una etiqueta. Eliminar esta relación no elimina la pregunta ni la etiqueta.

| Propiedad  | Tipo   | Descripción                          |
| ---------- | ------ | ------------------------------------ |
| `questionId` | string | Referencia a la pregunta.            |
| `tagId`      | string | Referencia a la etiqueta.            |

### QuestionBank

Representa una pregunta del banco de preguntas. Es la entidad base del módulo de banco de preguntas y soporta múltiples certificaciones, tipos de respuesta, dificultades, estados de ciclo de vida, etiquetas y referencias.

| Propiedad           | Tipo                              | Descripción                                                   |
| ------------------- | --------------------------------- | ------------------------------------------------------------- |
| `id`                | string                            | Identificador único de la pregunta.                           |
| `certificationExamId` | string                            | Referencia al examen al que pertenece la pregunta.            |
| `examDomainId`      | string                            | Referencia opcional a un dominio del mismo examen.            |
| `topicId`           | string                            | Referencia opcional a un tema del mismo examen.               |
| `externalCode`      | string                            | Código externo opcional, único dentro de la certificación.    |
| `statement`         | string                            | Enunciado de la pregunta.                                     |
| `explanation`       | string                            | Explicación opcional de la respuesta correcta.                |
| `type`              | `single_choice` \| `multiple_choice` | Tipo de pregunta.                                             |
| `difficulty`        | `easy` \| `medium` \| `hard`      | Nivel de dificultad de la pregunta.                           |
| `status`            | `draft` \| `active` \| `archived` | Estado del ciclo de vida. Solo `active` se usa en cuestionarios públicos. |
| `language`          | string                            | Idioma del contenido (por ejemplo, `en`, `es`).               |
| `isActive`          | boolean                           | Indica si la pregunta está activa.                            |
| `options`           | `AnswerOption[]`                  | Opciones de respuesta. Debe tener al menos dos.               |
| `tagIds`            | `string[]`                        | Identificadores de etiquetas asociadas.                       |
| `references`        | `QuestionReference[]`             | Referencias externas asociadas.                               |
| `createdAt`         | string                            | Fecha de creación en formato ISO 8601.                        |
| `updatedAt`         | string                            | Fecha de última actualización en formato ISO 8601.            |

### AnswerOption

Representa una opción de respuesta de una pregunta. La propiedad `isCorrect` es la fuente de verdad para determinar si la opción es correcta.

| Propiedad     | Tipo    | Descripción                                                   |
| ------------- | ------- | ------------------------------------------------------------- |
| `id`          | string  | Identificador único de la opción dentro de la pregunta.       |
| `questionId`  | string  | Referencia a la pregunta a la que pertenece.                  |
| `text`        | string  | Texto de la opción.                                           |
| `isCorrect`   | boolean | Indica si la opción es correcta.                              |
| `displayOrder`| number  | Orden de presentación. No admite valores negativos.           |

### QuestionReference

Representa una referencia externa asociada a una pregunta, como documentación oficial, whitepapers u otros recursos autorizados.

| Propiedad      | Tipo                                                  | Descripción                                                   |
| -------------- | ----------------------------------------------------- | ------------------------------------------------------------- |
| `id`           | string                                                | Identificador único de la referencia.                         |
| `questionId`   | string                                                | Referencia a la pregunta.                                     |
| `title`        | string                                                | Título del recurso.                                           |
| `url`          | string                                                | URL del recurso. Solo se permiten esquemas `http` y `https`.  |
| `referenceType`| `official_documentation` \| `whitepaper` \| `other` | Clasificación del recurso.                                    |
| `displayOrder` | number                                                | Orden de presentación. No admite valores negativos.           |

## Relaciones

- Un `Provider` puede tener muchos `CertificationExam`.
- Un `CertificationExam` pertenece a un único `Provider` a través del campo `providerId`.
- Un `CertificationExam` puede tener muchos `ExamDomain`, muchos `Topic` y muchas `QuestionBank`.
- Cada `ExamDomain` pertenece a un único `CertificationExam`.
- Cada `Topic` pertenece a un único `CertificationExam`.
- Cada `QuestionBank` pertenece a un único `CertificationExam`.
- `QuestionBank` puede referenciar opcionalmente un `ExamDomain` y un `Topic` de la misma certificación.
- Un `QuestionBank` puede tener muchos `AnswerOption`.
- Un `QuestionBank` puede tener muchos `QuestionReference`.
- Un `QuestionBank` puede tener muchas `Tag` a través de `QuestionTag`.
- `Tag` es global y puede reutilizarse entre certificaciones.
- El campo `code` de `CertificationExam` debe ser único dentro de la plataforma.
- El campo `code` de `ExamDomain` debe ser único dentro de su certificación.
- El campo `slug` de `Tag` debe ser único globalmente.

## Archivos relevantes

- `frontend/src/models/Provider.ts`
- `frontend/src/models/CertificationExam.ts`
- `frontend/src/models/ExamDomain.ts`
- `frontend/src/models/Topic.ts`
- `frontend/src/models/Tag.ts`
- `frontend/src/models/QuestionTag.ts`
- `frontend/src/models/QuestionBank.ts`
- `frontend/src/models/AnswerOption.ts`
- `frontend/src/models/QuestionReference.ts`
- `frontend/src/models/CertificationDto.ts`
- `frontend/src/schemas/providerSchema.ts`
- `frontend/src/schemas/certificationExamSchema.ts`
- `frontend/src/schemas/examDomainSchema.ts`
- `frontend/src/schemas/tagSchema.ts`
- `frontend/src/schemas/questionTagSchema.ts`
- `frontend/src/schemas/questionBankSchema.ts`
- `frontend/src/schemas/answerOptionSchema.ts`
- `frontend/src/schemas/questionReferenceSchema.ts`
- `frontend/src/schemas/questionSchema.ts`
- `frontend/src/data/certifications/index.ts`
- `frontend/src/services/certificationService.ts`
- `frontend/src/services/questionService.ts`
- `frontend/src/services/questionBankMigration.ts`
- `frontend/src/api/certifications.ts`

## Formato JSON

El banco de preguntas se persiste en archivos JSON versionados en `frontend/src/data/questionBanks/questionBanks.json`. El formato completo se describe en `docs/question-format.md`.

## Alcance actual

- El contrato del modelo y su validación con Zod están definidos en el frontend.
- `Provider` y `CertificationExam` se cargan desde `frontend/src/data/certifications/index.ts`.
- `QuestionBank` se carga desde `frontend/src/data/questionBanks/questionBanks.json`.
- La persistencia se implementa con JSON y Zod en cumplimiento de las reglas de arquitectura del MVP, que no incluyen base de datos ni backend.
- Los servicios y la UI consumen el modelo a través de `questionService.ts`, que adapta `QuestionBank` al formato de cuestionario.
- No se incluye persistencia en base de datos, migraciones de base de datos ni panel administrativo.
