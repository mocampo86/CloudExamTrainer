# US-042 - Implementar repositorio de preguntas en PostgreSQL

## Descripción

Como desarrollador, quiero encapsular el acceso a datos del banco de preguntas en un repositorio para que los servicios administrativos y el cuestionario puedan consultar y persistir preguntas en PostgreSQL sin conocer detalles de EF Core.

## Objetivo

Crear un repositorio de preguntas que implemente las operaciones de lectura y escritura sobre PostgreSQL, manteniendo una interfaz utilizable por los servicios existentes.

## Acceptance Criteria

### Interfaz de repositorio

- Se define una interfaz `IQuestionRepository` (o equivalente) en la capa de aplicación/dominio.
- Los métodos incluyen como mínimo:
  - `GetByIdAsync(id)`.
  - `GetPagedAsync(certificationExamId, filters, page, pageSize)`.
  - `CreateAsync(question)`.
  - `UpdateAsync(question)`.
  - `UpdateStatusAsync(id, status)`.
  - `SoftDeleteAsync(id)`.
  - `ExistsByExternalCodeAsync(certificationExamId, externalCode)`.
- La interfaz no depende de `DbContext` ni de tipos de infraestructura.

### Implementación

- Se implementa `PostgreSqlQuestionRepository` usando `ApplicationDbContext`.
- La creación y actualización persisten la pregunta, opciones, etiquetas y referencias en una sola transacción.
- Se manejan concurrencia y excepciones de BD (por ejemplo, duplicados) de forma controlada.
- Las consultas respetan los filtros por `certificationExamId`, `status`, `isActive`, `topicId`, `examDomainId` y `tagId`.
- Se soporta paginación y ordenamiento por `CreatedAt`, `UpdatedAt` o `DisplayOrder`.

### Integridad

- No se permite crear una pregunta para una certificación inexistente.
- No se permite asociar un dominio o tema de otra certificación.
- No se permite un `ExternalCode` duplicado dentro de una certificación.
- No se activa una pregunta sin opciones correctas válidas (reglas de `single_choice` y `multiple_choice`).

### Pruebas y calidad

- Se prueba el repositorio contra PostgreSQL real, contenedor de pruebas o base en memoria compatible con PostgreSQL.
- Se prueba creación, lectura, listado paginado, filtros, actualización, activación/desactivación y eliminación lógica.
- Se prueban escenarios de error (duplicados, dominio de otra certificación).
- La solución compila y los tests pasan.
- Se documenta la ubicación y uso del repositorio.

## Out of Scope

- No implementar endpoints API en esta historia.
- No implementar UI.
- No migrar datos.
- No modificar el motor del cuestionario.
