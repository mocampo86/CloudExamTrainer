# US-035 - Listar preguntas con paginación

## Objetivo

Como administrador del banco de preguntas

Quiero consultar un listado paginado de preguntas

Para navegar eficientemente por el banco de preguntas aunque contenga miles de registros.

---

# Acceptance Criteria

- Se implementa un endpoint REST para listar preguntas.
- El endpoint utiliza el método HTTP GET.
- La operación utiliza una Query de MediatR.
- Se implementa el QueryHandler correspondiente.
- El endpoint acepta:
  - pageNumber.
  - pageSize.
- Se define un valor por defecto para pageNumber.
- Se define un valor por defecto para pageSize.
- Se define un máximo permitido para pageSize.
- Se valida que pageNumber sea mayor que cero.
- Se valida que pageSize sea mayor que cero.
- Se valida que pageSize no supere el máximo permitido.
- Por defecto no se incluyen preguntas eliminadas lógicamente.
- La respuesta incluye:
  - Elementos.
  - Número de página.
  - Tamaño de página.
  - Total de registros.
  - Total de páginas.
  - Indicador de página anterior.
  - Indicador de página siguiente.
- Cada elemento incluye información resumida:
  - Identificador.
  - Texto.
  - Examen.
  - Categoría o dominio.
  - Tipo.
  - Dificultad.
  - Estado.
  - Cantidad de opciones.
  - Fecha de creación.
  - Fecha de modificación.
- El listado no devuelve todas las opciones completas.
- El orden por defecto es estable.
- Se utiliza el identificador como criterio secundario cuando sea necesario.
- La consulta utiliza AsNoTracking.
- La paginación se ejecuta en la base de datos.
- No se cargan todos los registros en memoria.
- La consulta evita problemas N+1.
- Se proyecta directamente al DTO.
- Se devuelve HTTP 200 incluso cuando no existen resultados.
- Cuando no existen resultados, se devuelve una colección vacía con metadatos válidos.
- Se devuelve HTTP 400 ante parámetros inválidos.
- Los errores utilizan el formato estándar de la API.
- El endpoint queda documentado mediante Swagger/OpenAPI.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Filtros administrativos.
- Búsqueda full-text.
- Exportación.
- Edición masiva.
- Eliminación masiva.
- Importación masiva.
- Métricas avanzadas.
- Columnas configurables.
- Ordenamiento manual.
- Caché distribuida específica.

---

# Calidad técnica

- Implementar GetQuestionsQuery.
- Implementar GetQuestionsQueryHandler.
- Implementar validación de paginación.
- Utilizar MediatR.
- Utilizar un modelo de respuesta paginada reutilizable.
- Utilizar AsNoTracking.
- Ejecutar Skip y Take en la base de datos.
- Aplicar ordenamiento estable antes de paginar.
- Proyectar directamente a DTO.
- Evitar Include innecesarios.
- Evitar consultas N+1.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Incluir pruebas unitarias para paginación.
- Incluir pruebas de integración para límites y páginas vacías.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
