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

### Topic

Representa un tema dentro de un examen de certificación.

| Propiedad           | Tipo   | Descripción                                     |
| ------------------- | ------ | ----------------------------------------------- |
| `certificationExamId` | string | Referencia al examen al que pertenece el tema.  |
| `name`              | string | Nombre visible del tema.                        |

### Question

Representa una pregunta de un examen de certificación.

| Propiedad           | Tipo   | Descripción                                     |
| ------------------- | ------ | ----------------------------------------------- |
| `id`                | string | Identificador único de la pregunta.             |
| `certificationExamId` | string | Referencia al examen al que pertenece la pregunta. |
| `topic`             | string | Tema al que pertenece la pregunta.              |

## Relaciones

- Un `Provider` puede tener muchos `CertificationExam`.
- Un `CertificationExam` pertenece a un único `Provider` a través del campo `providerId`.
- Un `CertificationExam` puede tener muchos `Topic` y muchas `Question`.
- Cada `Topic` pertenece a un único `CertificationExam`.
- Cada `Question` pertenece a un único `CertificationExam`.
- La relación `Topic` → `Question` se mantiene a través del campo `topic` de `Question`.
- El campo `code` de `CertificationExam` debe ser único dentro de la plataforma.

## Archivos relevantes

- `frontend/src/models/Provider.ts`
- `frontend/src/models/CertificationExam.ts`
- `frontend/src/schemas/providerSchema.ts`
- `frontend/src/schemas/certificationExamSchema.ts`

## Alcance actual

Esta versión define únicamente el contrato del modelo y su validación con Zod. No incluye persistencia, migraciones, endpoints, UI ni asociación con preguntas o temas.
