# US-045 - Actualizar documentación de persistencia y arquitectura

## Descripción

Como desarrollador, quiero actualizar la documentación del proyecto para reflejar que el banco de preguntas puede persistir en PostgreSQL y que el cuestionario seguirá soportando el formato JSON durante la transición.

## Objetivo

Mantener alineados los documentos de arquitectura, API y formato de preguntas con el nuevo modelo de persistencia relacional.

## Acceptance Criteria

### Documentos a actualizar

- `docs/questions-api.md`:
  - Se describe que la persistencia puede ser en JSON (MVP) o PostgreSQL (post-MVP).
  - Se actualiza la sección de alcance actual y se añade la hoja de ruta de persistencia.
  - Se documenta el repositorio y el `DbContext`.
- `docs/certification-architecture.md`:
  - Se añade una sección de persistencia con PostgreSQL.
  - Se actualiza el flujo de datos del endpoint `POST /api/questions`.
  - Se añade la capa de repositorio en la tabla de capas del frontend/backend.
- `docs/project-scope.md`:
  - Se añade la feature de persistencia PostgreSQL en la lista de funcionalidades futuras, indicando que está fuera del MVP.
- `docs/question-format.md` (opcional):
  - Se añade una nota que el JSON sigue siendo el formato de entrada y migración hacia PostgreSQL.

### Claridad

- Se distingue claramente el estado actual (MVP con JSON) del estado futuro (PostgreSQL).
- No se elimina la información existente sobre el MVP.
- Se documenta el proceso de migración y los requisitos de conexión.

### Pruebas y calidad

- No se introducen inconsistencias entre documentos.
- Los enlaces entre documentos son correctos.
- La documentación compila/renderiza correctamente en Markdown.

## Out of Scope

- No generar documentación de despliegue de PostgreSQL en Azure.
- No modificar el README del proyecto salvo que sea estrictamente necesario.
