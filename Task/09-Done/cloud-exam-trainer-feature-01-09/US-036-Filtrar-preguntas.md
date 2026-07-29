# US-036 - Filtrar preguntas

## Objetivo

Como administrador del banco de preguntas

Quiero filtrar las preguntas por distintos criterios

Para localizar rápidamente el contenido que necesito administrar.

---

# Acceptance Criteria

- El endpoint de listado permite aplicar filtros opcionales.
- Los filtros se integran con la paginación existente.
- Se permite filtrar por:
  - Identificador de examen.
  - Identificador de categoría o dominio.
  - Tipo de pregunta.
  - Nivel de dificultad.
  - Estado activo o inactivo.
  - Texto parcial.
  - Fecha de creación desde.
  - Fecha de creación hasta.
- Se permite solicitar explícitamente la inclusión de preguntas eliminadas cuando el usuario tenga permisos administrativos.
- Por defecto no se incluyen preguntas eliminadas.
- Los filtros pueden combinarse.
- El filtro por texto busca coincidencias parciales.
- La búsqueda no distingue mayúsculas y minúsculas cuando la estrategia de base de datos lo permita.
- Se valida que los identificadores tengan un formato válido.
- Se valida que los valores enumerados sean válidos.
- Se valida que la fecha desde no sea posterior a la fecha hasta.
- Los filtros se ejecutan en la base de datos.
- Los filtros se aplican antes de la paginación.
- Se permite ordenamiento por campos autorizados.
- Se permite dirección ascendente o descendente.
- Solo se aceptan campos de ordenamiento incluidos en una lista blanca.
- El ordenamiento se ejecuta en la base de datos.
- El orden final es estable.
- Se devuelve HTTP 200 cuando la consulta es válida.
- Si no hay coincidencias, se devuelve una colección vacía.
- Se devuelve HTTP 400 ante filtros inválidos.
- Los errores utilizan el formato estándar de la API.
- Los filtros quedan documentados mediante Swagger/OpenAPI.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Elasticsearch u OpenSearch.
- Búsqueda semántica.
- Filtros por estadísticas de uso.
- Filtros por porcentaje de aciertos.
- Filtros guardados por usuario.
- Exportación del resultado.
- Agregaciones estadísticas.
- Reportes.
- Sugerencias automáticas de filtros.
- Búsqueda por similitud mediante inteligencia artificial.

---

# Calidad técnica

- Extender GetQuestionsQuery o implementar un Query específico según la arquitectura existente.
- Implementar validaciones con FluentValidation.
- Aplicar filtros mediante expresiones traducibles por Entity Framework Core.
- Evitar evaluación en memoria.
- Aplicar filtros antes de Skip y Take.
- Utilizar AsNoTracking.
- Utilizar lista blanca para ordenamiento.
- No concatenar SQL con parámetros del usuario.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Evaluar índices para campos utilizados frecuentemente.
- Documentar cualquier índice nuevo mediante migración.
- Incluir pruebas unitarias para cada filtro.
- Incluir pruebas para combinaciones de filtros.
- Incluir pruebas de integración.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
