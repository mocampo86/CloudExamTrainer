# US-034 - Obtener pregunta por ID

## Objetivo

Como administrador del banco de preguntas

Quiero consultar una pregunta por su identificador

Para revisar su información completa antes de modificarla o administrarla.

---

# Acceptance Criteria

- Se implementa un endpoint REST para obtener una pregunta por ID.
- El endpoint utiliza el método HTTP GET.
- La ruta incluye el identificador de la pregunta.
- La operación utiliza una Query de MediatR.
- Se implementa el QueryHandler correspondiente.
- Se valida que el identificador sea válido.
- Se valida que la pregunta exista.
- La respuesta incluye:
  - Identificador.
  - Identificador y nombre del examen.
  - Texto.
  - Tipo.
  - Dificultad.
  - Categoría o dominio.
  - Explicación.
  - Estado.
  - Fecha de creación.
  - Fecha de modificación.
  - Opciones.
  - Orden de las opciones.
  - Indicador de respuesta correcta.
- Las opciones se devuelven en el orden configurado.
- La consulta administrativa puede devolver preguntas activas e inactivas.
- Las preguntas eliminadas solo se devuelven cuando la estrategia administrativa lo permita.
- Si se devuelve una pregunta eliminada, su estado se indica explícitamente.
- La respuesta utiliza un DTO independiente de las entidades.
- No se exponen propiedades internas ni datos sensibles.
- La consulta utiliza AsNoTracking.
- La consulta evita problemas N+1.
- Se proyecta directamente al DTO cuando sea posible.
- Se devuelve HTTP 200 cuando la pregunta existe.
- Se devuelve HTTP 400 cuando el identificador es inválido.
- Se devuelve HTTP 404 cuando la pregunta no existe.
- Los errores utilizan el formato estándar de la API.
- El endpoint queda documentado mediante Swagger/OpenAPI.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Edición desde el mismo endpoint.
- Historial de versiones.
- Auditoría funcional completa.
- Métricas de uso.
- Porcentaje de respuestas correctas.
- Información de cuestionarios relacionados.
- Traducciones.
- Adjuntos.
- Contenido multimedia.
- Comparación con preguntas similares.

---

# Calidad técnica

- Implementar GetQuestionByIdQuery.
- Implementar GetQuestionByIdQueryHandler.
- Utilizar MediatR.
- Utilizar DTOs específicos de lectura.
- Utilizar AsNoTracking.
- Proyectar directamente al DTO.
- Evitar Include innecesarios.
- Evitar consultas N+1.
- No implementar lógica de negocio en el Controller.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Incluir pruebas unitarias para el Handler.
- Incluir pruebas de integración para casos exitosos y recurso inexistente.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
