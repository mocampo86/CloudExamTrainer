# US-041 - Crear esquema de base de datos para preguntas

## Descripción

Como administrador de contenido, quiero que las preguntas, opciones, etiquetas y referencias se almacenen en tablas relacionales de PostgreSQL para mantener la integridad y facilitar consultas por certificación, dominio, tema y estado.

## Objetivo

Diseñar y configurar el esquema relacional del banco de preguntas en PostgreSQL, reflejando el modelo `QuestionBank` existente sin acoplarlo a AWS ni a reglas de UI.

## Acceptance Criteria

### Entidades principales

- Se crea la entidad/tabla `Question` con al menos:
  - `Id` (clave primaria, `uuid` o `string` según estándar del proyecto).
  - `CertificationExamId`.
  - `ExamDomainId` (opcional).
  - `TopicId` (opcional).
  - `ExternalCode` (opcional).
  - `Statement` (requerido, longitud máxima razonable).
  - `Explanation` (opcional).
  - `Type` (`single_choice`, `multiple_choice`).
  - `Difficulty` (`easy`, `medium`, `hard`).
  - `Status` (`draft`, `active`, `archived`).
  - `Language` (por defecto `en`).
  - `IsActive`.
  - `CreatedAt` y `UpdatedAt`.
- Se crea la entidad/tabla `AnswerOption` con al menos:
  - `Id`.
  - `QuestionId` (clave foránea).
  - `Text`.
  - `IsCorrect`.
  - `DisplayOrder`.
- Se crea la entidad/tabla `Tag` con al menos:
  - `Id`.
  - `Name`.
  - `IsActive`.
- Se crea la entidad/tabla `QuestionTag` para la relación muchos a muchos con `Tag`.
- Se crea la entidad/tabla `QuestionReference` con al menos:
  - `Id`.
  - `QuestionId` (clave foránea).
  - `Title`.
  - `Url`.
  - `ReferenceType`.
  - `DisplayOrder`.

### Relaciones y restricciones

- Una `Question` tiene muchas `AnswerOption` y `QuestionReference`.
- Una `Question` tiene muchas `Tag` a través de `QuestionTag`.
- Se define el comportamiento de borrado para cada relación (Cascade en opciones/referencias, Restrict/Restrict o Cascade controlado hacia certificación según reglas de negocio).
- Se define clave foránea de `Question.CertificationExamId` (y opcionales hacia `ExamDomain`/`Topic` si existen tablas).
- Se crea índice por `CertificationExamId`.
- Se crea restricción única por `CertificationExamId` + `ExternalCode` cuando `ExternalCode` no sea nulo.
- Se definen longitudes máximas razonables y campos requeridos.

### Validaciones del modelo

- El `Question.Type` solo admite `single_choice` o `multiple_choice`.
- El `Question.Difficulty` solo admite `easy`, `medium` o `hard`.
- El `Question.Status` solo admite `draft`, `active` o `archived`.
- `AnswerOption.DisplayOrder` no admite valores negativos.
- `QuestionReference.Url` debe validar esquemas `http` o `https` cuando se proporciona.

### Pruebas y calidad

- Se genera la migración EF Core correspondiente al esquema.
- Se prueba que la migración se aplica correctamente sobre una base PostgreSQL limpia.
- Se prueba que las restricciones de unicidad y clave foránea funcionan.
- La solución compila.
- No se exponen entidades en contratos HTTP ni UI.

## Out of Scope

- No implementar repositorios ni casos de uso.
- No implementar endpoints.
- No migrar datos JSON.
- No implementar lógica de negocio de corrección de respuestas.
