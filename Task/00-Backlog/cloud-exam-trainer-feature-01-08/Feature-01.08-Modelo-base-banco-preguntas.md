# Feature 04 - Modelo base del banco de preguntas

## Objetivo

Diseñar e implementar la estructura base de dominio y persistencia necesaria para administrar preguntas de múltiples certificaciones dentro de **Cloud Exam Trainer**.

La feature debe reemplazar estructuras simplificadas o hardcodeadas por un modelo extensible, relacional y preparado para soportar miles de preguntas, distintos tipos de respuesta, dominios de examen, temas, etiquetas y referencias.

La implementación inicial debe mantener compatibilidad con **AWS Certified Solutions Architect – Associate**, sin acoplar el modelo exclusivamente a AWS.

## Acceptance Criteria

### Arquitectura

- Se crea un módulo claramente delimitado para el banco de preguntas.
- El módulo respeta la arquitectura actual.
- Las entidades de dominio no dependen de UI ni contratos HTTP.
- La lógica no queda acoplada exclusivamente a AWS.
- El modelo permite incorporar certificaciones de otros proveedores.
- Las decisiones principales quedan documentadas.

### Modelo funcional

El modelo contempla como mínimo:

- CertificationExam.
- ExamDomain.
- Topic.
- Question.
- AnswerOption.
- Tag.
- QuestionTag.
- QuestionReference.

### Dominios y temas

- Una certificación puede tener múltiples dominios.
- Cada dominio pertenece a una certificación.
- Cada tema pertenece a una certificación.
- Un tema puede asociarse opcionalmente a un dominio.
- No se permite asociar un tema a un dominio de otra certificación.

### Preguntas

Cada pregunta incluye como mínimo:

- Id.
- CertificationExamId.
- ExamDomainId opcional.
- TopicId opcional.
- ExternalCode opcional.
- Statement.
- Explanation.
- QuestionType.
- Difficulty.
- Status.
- Language.
- IsActive.
- CreatedAt.
- UpdatedAt.

Además:

- El enunciado es obligatorio.
- La pregunta admite múltiples opciones.
- Se soportan SingleChoice y MultipleChoice.
- La certificación, dominio y tema deben ser consistentes.

### Opciones de respuesta

- Una pregunta posee dos o más opciones.
- Cada opción incluye texto, orden e indicador de respuesta correcta.
- SingleChoice permite exactamente una opción correcta.
- MultipleChoice permite más de una opción correcta.
- No se utiliza una letra como única fuente de verdad.
- No se permiten opciones vacías ni duplicadas dentro de una pregunta.

### Etiquetas y referencias

- Una pregunta puede tener múltiples etiquetas.
- Una etiqueta puede relacionarse con múltiples preguntas.
- Una pregunta puede tener múltiples referencias.
- Las referencias pueden incluir título, URL, tipo y orden.
- Las URLs se validan cuando se proporcionan.

### Persistencia

- El modelo se persiste en PostgreSQL.
- Se utiliza Entity Framework Core y Npgsql si son las tecnologías actuales.
- Las relaciones poseen claves foráneas explícitas.
- Se definen índices y restricciones de unicidad.
- No se guardan archivos binarios pesados directamente en las tablas de preguntas.

### Integridad

- No se puede crear una pregunta para una certificación inexistente.
- No se puede asociar un dominio o tema de otra certificación.
- No se puede activar una pregunta sin respuestas correctas válidas.
- Se define el comportamiento de borrado para todas las relaciones.
- La eliminación de una certificación no elimina preguntas históricas accidentalmente.

### Migración de contenido actual

- Las preguntas actuales se asocian a AWS Certified Solutions Architect – Associate.
- Los temas y respuestas actuales se conservan.
- No se pierde contenido existente.
- Se documentan transformaciones y datos inválidos.

### Pruebas y calidad

- Se prueban preguntas SingleChoice y MultipleChoice.
- Se prueban asociaciones válidas e inválidas.
- Se prueban restricciones de respuestas correctas.
- Se prueba la migración de datos actuales.
- La solución compila y la API inicia correctamente.
- No se introducen dependencias innecesarias.
- Cada User Story puede implementarse mediante un Pull Request independiente.

## Out of Scope

- No implementar CRUD administrativo completo.
- No implementar importación CSV o Excel.
- No implementar generación con IA.
- No implementar workflow editorial avanzado.
- No implementar estadísticas por pregunta.
- No implementar búsqueda semántica.
- No implementar detección avanzada de duplicados.
- No implementar almacenamiento de imágenes.
- No implementar exportaciones.
- No modificar el cálculo de resultados.
- No implementar versionado histórico completo.

## User Stories incluidas

- US-025 - Crear modelo de dominios de examen.
- US-026 - Crear modelo base de preguntas.
- US-027 - Crear modelo de opciones de respuesta.
- US-028 - Crear modelo de etiquetas.
- US-029 - Crear modelo de referencias de preguntas.
- US-030 - Crear migraciones del banco de preguntas.
- US-031 - Migrar las preguntas actuales al nuevo modelo.
