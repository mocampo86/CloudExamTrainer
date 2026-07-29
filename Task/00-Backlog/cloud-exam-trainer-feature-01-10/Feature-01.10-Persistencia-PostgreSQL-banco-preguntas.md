# Feature 01.10 - Persistencia PostgreSQL del banco de preguntas

## Objetivo

Reemplazar (o complementar) el almacenamiento de preguntas basado en JSON estático por una base de datos relacional **PostgreSQL**, permitiendo administrar el banco de preguntas de forma persistente, escalable y concurrente sin alterar el contrato de la API administrativa ni la experiencia del cuestionario.

La feature mantiene la independencia del motor respecto de certificaciones específicas y preserva la posibilidad de ejecutar el cuestionario con datos JSON mientras la migración a PostgreSQL esté en curso.

## Acceptance Criteria

### Arquitectura

- Se introduce PostgreSQL como fuente de persistencia principal del banco de preguntas (fuera del alcance del MVP actual).
- Se mantiene la arquitectura por capas del frontend/backend, separando modelos, esquemas, repositorio, servicios y endpoints.
- Los modelos de dominio no dependen de detalles de infraestructura (DbContext, conexión, etc.).
- El acceso a datos se centraliza en un repositorio de preguntas.
- Se permite seguir ejecutando el cuestionario desde JSON mientras el repositorio PostgreSQL no esté activo.

### Modelo de datos

- El esquema PostgreSQL incluye como mínimo las tablas:
  - `Questions`
  - `AnswerOptions`
  - `Tags`
  - `QuestionTags`
  - `QuestionReferences`
- Las claves foráneas son explícitas y las relaciones de borrado se definen por configuración (Cascade/Restrict según corresponda).
- Se definen índices para `CertificationExamId`, `TopicId`, `ExamDomainId`, `ExternalCode` y `Status`/`IsActive`.
- Se mantiene la unicidad de `ExternalCode` dentro de una certificación.
- Se soportan tipos `single_choice` y `multiple_choice`.
- Se conservan campos de auditoría (`CreatedAt`, `UpdatedAt`).

### Comportamiento

- Las operaciones de creación, edición, activación/desactivación, eliminación lógica, consulta y listado persisten en PostgreSQL.
- Las validaciones de negocio existentes se conservan.
- El endpoint `POST /api/questions` persiste la pregunta y sus opciones, etiquetas y referencias como una única transacción.
- Se mantiene el contrato de respuesta (`CreateQuestionResponse`) sin cambios visibles para el cliente.

### Migración de contenido

- Se crea un proceso de migración que lee `frontend/src/data/questionBanks/questionBanks.json` y carga el contenido en PostgreSQL.
- La migración es idempotente o controlable por medio de flags.
- Se detectan y reportan duplicados, referencias inválidas o violaciones de reglas.
- No se pierde contenido existente.

### Pruebas y calidad

- Se prueba la conexión a PostgreSQL.
- Se prueba el repositorio con base de datos en memoria o contenedor de pruebas (Testcontainers si es viable).
- Se prueba la migración de datos con un subconjunto representativo.
- Se prueba que las operaciones administrativas persisten correctamente.
- La solución compila y los tests pasan.
- No se introducen dependencias innecesarias.
- Cada User Story puede implementarse mediante un Pull Request independiente.

## Out of Scope

- No implementar autenticación ni autorización.
- No implementar panel administrativo visual en React.
- No implementar importación CSV, Excel ni generación con IA.
- No implementar búsqueda semántica ni full-text avanzada.
- No implementar versionado histórico completo.
- No almacenar imágenes o archivos binarios en PostgreSQL.
- No modificar el cálculo de resultados del cuestionario.
- No implementar despliegue automatizado de PostgreSQL en Azure en esta feature.

## User Stories incluidas

- US-040 - Configurar conexión y DbContext de PostgreSQL.
- US-041 - Crear esquema de base de datos para preguntas.
- US-042 - Implementar repositorio de preguntas en PostgreSQL.
- US-043 - Migrar preguntas JSON a PostgreSQL.
- US-044 - Adaptar API administrativa para persistir en base de datos.
- US-045 - Actualizar documentación de persistencia y arquitectura.
