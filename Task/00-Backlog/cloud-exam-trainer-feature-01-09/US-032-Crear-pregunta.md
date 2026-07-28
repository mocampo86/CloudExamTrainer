# US-032 - Crear pregunta

## Objetivo

Como administrador del banco de preguntas

Quiero crear una nueva pregunta asociada a un examen

Para incorporarla al catálogo disponible para generar cuestionarios y sesiones de práctica.

---

# Acceptance Criteria

- Se implementa un endpoint REST para crear preguntas.
- El endpoint utiliza el método HTTP POST.
- La ruta sigue las convenciones existentes de la API.
- El endpoint recibe un DTO independiente del modelo de persistencia.
- El request incluye como mínimo:
  - Identificador del examen.
  - Texto de la pregunta.
  - Tipo de pregunta.
  - Nivel de dificultad.
  - Categoría o dominio cuando corresponda.
  - Explicación.
  - Opciones de respuesta.
  - Indicador de respuesta correcta por opción.
- La operación utiliza un Command de MediatR.
- Se implementa el CommandHandler correspondiente.
- Se implementa un Validator mediante FluentValidation.
- Se valida que el examen exista.
- Se valida que el texto no sea nulo, vacío ni contenga solamente espacios.
- Se valida la longitud máxima del texto.
- Se valida que el tipo de pregunta sea válido.
- Se valida que el nivel de dificultad sea válido.
- Se valida que la categoría o dominio exista cuando sea obligatorio.
- Se valida que la categoría o dominio pertenezca al examen seleccionado cuando aplique.
- Se valida que existan al menos dos opciones.
- Se valida que ninguna opción tenga texto vacío.
- Se valida que no existan opciones duplicadas después de normalizar el texto.
- Para preguntas de respuesta única, se valida que exista exactamente una respuesta correcta.
- Para preguntas de respuesta múltiple, se valida que exista una cantidad válida de respuestas correctas.
- Se valida que la cantidad de respuestas correctas sea compatible con el tipo de pregunta.
- La pregunta se crea con un identificador único.
- La fecha de creación se registra en UTC.
- La fecha de modificación inicial se registra en UTC.
- La pregunta queda activa por defecto.
- La pregunta y sus opciones se guardan de forma transaccional.
- Si falla la creación de una opción, no se persiste parcialmente la pregunta.
- Se devuelve HTTP 201 cuando la operación finaliza correctamente.
- La respuesta incluye el identificador de la pregunta creada.
- La respuesta incluye la información mínima necesaria para confirmar la creación.
- Se devuelve HTTP 400 ante errores de validación.
- Se devuelve HTTP 404 cuando el examen o la categoría no existen.
- Los errores utilizan el formato estándar de la API.
- El endpoint queda documentado mediante Swagger/OpenAPI.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Creación masiva.
- Importación desde archivos.
- Generación mediante inteligencia artificial.
- Detección semántica de duplicados.
- Carga de imágenes.
- Archivos adjuntos.
- Traducciones.
- Versionado.
- Workflow de aprobación.
- Auditoría funcional completa.
- Publicación automática en exámenes.
- Creación de exámenes o categorías desde este endpoint.

---

# Calidad técnica

- Implementar CreateQuestionCommand.
- Implementar CreateQuestionCommandHandler.
- Implementar CreateQuestionCommandValidator.
- Utilizar MediatR.
- Utilizar FluentValidation.
- Utilizar repositorios o abstracciones existentes.
- No acceder directamente al DbContext desde el Controller.
- No implementar lógica de negocio en el Controller.
- Mantener separación entre capas.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Registrar fechas en UTC.
- Mantener consistencia transaccional entre pregunta y opciones.
- Incluir pruebas unitarias para Validator y Handler.
- Incluir pruebas de integración cuando corresponda.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
