# US-026 - Crear modelo base de preguntas

## Descripción

Como administrador de contenido, quiero disponer de un modelo completo de pregunta para almacenar preguntas de múltiples certificaciones de forma consistente.

## Objetivo

Crear la entidad `Question`, sus enumeraciones y reglas principales, dejando las opciones de respuesta para la US-027.

## Acceptance Criteria

### Entidad Question

- Se crea `Question`.
- Incluye Id y CertificationExamId.
- Incluye ExamDomainId y TopicId opcionales.
- Incluye ExternalCode opcional.
- Incluye Statement y Explanation.
- Incluye QuestionType, Difficulty, Status y Language.
- Incluye IsActive, CreatedAt y UpdatedAt cuando corresponda.
- Statement es obligatorio y no puede contener solo espacios.

### Enumeraciones

- Se crea `QuestionType` con SingleChoice y MultipleChoice.
- Se crea `QuestionDifficulty` con Easy, Medium y Hard.
- Se crea `QuestionStatus` con Draft, Active y Archived.
- Los valores se documentan.
- No se utilizan magic strings distribuidos.

### Relaciones y reglas

- Cada pregunta pertenece a una certificación.
- ExamDomain y Topic son opcionales.
- Dominio, tema y certificación deben ser consistentes.
- No se permite asociar dominio o tema de otra certificación.
- ExternalCode puede ser único por certificación cuando exista.
- Una pregunta nueva se crea en Draft por defecto.
- Draft y Archived no se utilizan en cuestionarios públicos.

### Persistencia

- Se crea configuración de EF Core.
- Se definen claves foráneas.
- Se crean índices por CertificationExamId, ExamDomainId, TopicId, Status y Difficulty.
- No se almacena contenido binario pesado.

### Pruebas y calidad

- Se prueba una pregunta válida.
- Se prueba Statement vacío.
- Se prueban tipos, dificultades y estados.
- Se prueban asociaciones válidas e inválidas.
- La aplicación compila.
- El modelo no está acoplado a AWS.
- No se modifica la lógica de corrección actual.

## Out of Scope

- No crear opciones de respuesta.
- No crear endpoints.
- No crear importador.
- No implementar workflow de aprobación.
- No implementar detección semántica de duplicados.
- No implementar estadísticas.
