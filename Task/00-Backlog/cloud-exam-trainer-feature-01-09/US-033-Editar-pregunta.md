# US-033 - Editar pregunta

## Objetivo

Como administrador del banco de preguntas

Quiero modificar una pregunta existente y sus opciones

Para corregir errores o mantener actualizado su contenido.

---

# Acceptance Criteria

- Se implementa un endpoint REST para editar preguntas.
- El endpoint utiliza PUT o PATCH según las convenciones de la API.
- La ruta incluye el identificador de la pregunta.
- El endpoint recibe un DTO independiente del modelo de persistencia.
- La operación utiliza un Command de MediatR.
- Se implementa el CommandHandler correspondiente.
- Se implementa un Validator mediante FluentValidation.
- Se valida que la pregunta exista.
- Se valida que la pregunta no se encuentre eliminada.
- Se valida que el identificador de la ruta sea consistente con el request cuando ambos estén presentes.
- Se permite actualizar:
  - Texto.
  - Tipo.
  - Dificultad.
  - Examen cuando esté permitido.
  - Categoría o dominio.
  - Explicación.
  - Opciones.
  - Respuestas correctas.
- Se valida que el examen exista.
- Se valida que la categoría o dominio exista cuando corresponda.
- Se valida que la categoría o dominio pertenezca al examen seleccionado cuando aplique.
- Se valida que el texto no sea vacío.
- Se valida que el tipo de pregunta sea válido.
- Se valida que el nivel de dificultad sea válido.
- Se valida que existan al menos dos opciones.
- Se valida que ninguna opción tenga texto vacío.
- Se valida que no existan opciones duplicadas.
- Se valida la cantidad de respuestas correctas según el tipo de pregunta.
- Se preserva el identificador original.
- Se preserva la fecha de creación original.
- Se actualiza la fecha de última modificación en UTC.
- Las opciones se actualizan de forma consistente.
- Las opciones removidas se eliminan o desactivan según la estrategia del modelo.
- Las opciones nuevas reciben identificadores válidos.
- La edición se ejecuta de forma transaccional.
- Si una operación falla, no se guardan cambios parciales.
- Se devuelve HTTP 200 cuando la operación finaliza correctamente.
- Se devuelve HTTP 400 ante errores de validación.
- Se devuelve HTTP 404 cuando la pregunta, examen o categoría no existen.
- Se devuelve HTTP 409 ante conflictos de concurrencia cuando corresponda.
- Los errores utilizan el formato estándar de la API.
- El endpoint queda documentado mediante Swagger/OpenAPI.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Historial de versiones.
- Restauración de versiones.
- Workflow de aprobación.
- Auditoría funcional completa.
- Edición masiva.
- Importación desde archivos.
- Traducciones.
- Carga de imágenes.
- Archivos adjuntos.
- Edición colaborativa.
- Generación mediante inteligencia artificial.

---

# Calidad técnica

- Implementar UpdateQuestionCommand.
- Implementar UpdateQuestionCommandHandler.
- Implementar UpdateQuestionCommandValidator.
- Utilizar MediatR.
- Utilizar FluentValidation.
- Utilizar repositorios o abstracciones existentes.
- No acceder directamente al DbContext desde el Controller.
- Mantener separación entre capas.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Registrar la modificación en UTC.
- Mantener consistencia transaccional entre pregunta y opciones.
- Aplicar control de concurrencia si ya existe en el proyecto.
- Incluir pruebas unitarias para Validator y Handler.
- Incluir pruebas de integración cuando corresponda.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
