# US-044 - Adaptar API administrativa para persistir en base de datos

## Descripción

Como administrador, quiero que el endpoint `POST /api/questions` y las futuras operaciones de edición, consulta y listado persistan en PostgreSQL en lugar de memoria/JSON para que los cambios sobrevivan al reinicio de la aplicación.

## Objetivo

Conectar los endpoints administrativos de preguntas con el repositorio PostgreSQL, conservando los contratos existentes (`CreateQuestionRequest`, `CreateQuestionResponse`, etc.).

## Acceptance Criteria

### Integración con repositorio

- `questionAdminService` (o servicio equivalente) delega la persistencia a `IQuestionRepository`.
- Las validaciones existentes se ejecutan antes de invocar al repositorio.
- La respuesta de creación refleja los datos persistidos, incluyendo `id` generado y timestamps en formato ISO 8601.
- Se resuelven las relaciones (dominio, tema, etiquetas) contra PostgreSQL.

### Endpoints afectados

- `POST /api/questions` persiste en PostgreSQL.
- `PUT /api/questions/:id` actualiza la pregunta existente (si la feature incluye edición).
- `GET /api/questions/:id` devuelve la pregunta desde PostgreSQL.
- `GET /api/questions` devuelve listado paginado desde PostgreSQL respetando filtros.
- `PATCH /api/questions/:id/status` cambia el estado de la pregunta.
- `DELETE /api/questions/:id` realiza eliminación lógica en PostgreSQL.
- `POST /api/questions/:id/duplicate` duplica una pregunta existente (si aplica).

### Comportamiento

- Se mantiene el contrato HTTP y los códigos de respuesta existentes.
- Se devuelve `400 Bad Request` ante errores de validación.
- Se devuelve `404 Not Found` si la certificación, dominio, tema o pregunta no existe.
- Se devuelve `409 Conflict` si se viola la unicidad de `ExternalCode`.
- Se devuelve `500 Internal Server Error` solo para errores inesperados.

### Transaccionalidad

- La creación, edición y duplicado de preguntas se ejecutan dentro de una transacción.
- Si falla alguna parte (pregunta, opciones, etiquetas, referencias), se revierte toda la operación.

### Pruebas y calidad

- Se actualizan o se crean tests de integración para los endpoints con PostgreSQL.
- Se prueba la creación exitosa y los casos de error.
- Se prueba que las preguntas creadas se recuperan tras reiniciar el proceso de pruebas (persistencia real).
- La solución compila, lint y tests pasan.

## Out of Scope

- No modificar contratos HTTP existentes.
- No implementar autenticación ni autorización en esta historia.
- No implementar UI administrativa.
- No modificar el cálculo de resultados del cuestionario.
