# US-030 - Crear migraciones del banco de preguntas

## Descripción

Como equipo de desarrollo, quiero disponer de migraciones reproducibles para el nuevo banco de preguntas, para desplegar el modelo de forma controlada.

## Objetivo

Crear las migraciones de PostgreSQL necesarias para dominios, preguntas, opciones, etiquetas, relaciones y referencias.

## Acceptance Criteria

### Migración

- Se crea una migración con ExamDomain, Question, AnswerOption, Tag, QuestionTag y QuestionReference.
- Las tablas respetan las convenciones del proyecto.
- Las columnas utilizan tipos adecuados para PostgreSQL.
- Se crean claves primarias y foráneas.
- Se configuran nulabilidad y restricciones únicas.
- Se agregan checks cuando aportan integridad.

### Índices

- Se crean índices para CertificationExamId.
- Se crean índices para ExamDomainId y TopicId.
- Se crean índices para Status, Difficulty y ExternalCode cuando corresponda.
- Se crea índice único para Tag.Slug.
- Se crea índice único para QuestionTag.
- Los índices se justifican por patrones de consulta.

### Relaciones y ejecución

- Se define on-delete para cada relación.
- No se eliminan preguntas históricas accidentalmente.
- Las opciones se eliminan con su pregunta cuando corresponda.
- Las relaciones de tags se eliminan sin borrar tags.
- La migración aplica sobre una base vacía y sobre el esquema actual.
- El downgrade funciona si el proyecto exige reversibilidad.
- La aplicación inicia después de aplicar la migración.

### Verificación y calidad

- Se verifican tablas, columnas, restricciones e índices.
- Se documenta el comando para aplicar la migración.
- Se valida en ambiente local.
- La solución compila.
- No se realizan cambios destructivos sin estrategia.
- El cambio puede revisarse en un PR independiente.

## Out of Scope

- No migrar contenido actual.
- No cargar seed completo.
- No configurar producción.
- No implementar backups.
- No crear importador CSV.
