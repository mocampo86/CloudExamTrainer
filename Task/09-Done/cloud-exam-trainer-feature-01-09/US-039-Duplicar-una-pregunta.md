# US-039 - Duplicar una pregunta

## Objetivo

Como administrador del banco de preguntas

Quiero duplicar una pregunta existente

Para crear una nueva variante reutilizando su contenido y opciones como base.

---

# Acceptance Criteria

- Se implementa un endpoint REST para duplicar una pregunta.
- El endpoint utiliza el método HTTP POST.
- La ruta incluye el identificador de la pregunta origen.
- La operación utiliza un Command de MediatR.
- Se implementa el CommandHandler correspondiente.
- Se valida que la pregunta origen exista.
- Se valida que la pregunta origen no esté eliminada lógicamente.
- Se permite duplicar preguntas activas o inactivas.
- La nueva pregunta recibe un identificador único.
- Se duplican:
  - Texto.
  - Tipo.
  - Dificultad.
  - Examen.
  - Categoría o dominio.
  - Explicación.
  - Opciones.
  - Orden de opciones.
  - Indicadores de respuesta correcta.
- Cada opción duplicada recibe un identificador nuevo.
- La nueva pregunta queda inactiva por defecto.
- La nueva pregunta no conserva referencias históricas de la pregunta origen.
- La nueva pregunta no conserva estadísticas de uso.
- La nueva pregunta no conserva auditoría funcional previa.
- La nueva pregunta registra fecha de creación en UTC.
- La nueva pregunta registra fecha de modificación inicial en UTC.
- La operación se ejecuta de forma transaccional.
- Si falla la duplicación de una opción, no se persiste la nueva pregunta.
- La pregunta origen no se modifica.
- Se devuelve HTTP 201 cuando la duplicación finaliza correctamente.
- La respuesta incluye el identificador de la nueva pregunta.
- La respuesta permite navegar al recurso creado cuando la convención de la API lo permita.
- Se devuelve HTTP 404 cuando la pregunta origen no existe.
- Se devuelve HTTP 409 cuando la pregunta no puede duplicarse por una restricción funcional.
- Los errores utilizan el formato estándar de la API.
- El endpoint queda documentado mediante Swagger/OpenAPI.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Duplicación masiva.
- Duplicación entre ambientes.
- Copia de estadísticas.
- Copia de historial de cambios.
- Copia de auditoría.
- Detección automática de duplicados.
- Modificación automática del texto.
- Generación de variantes mediante inteligencia artificial.
- Traducciones automáticas.
- Publicación automática de la copia.
- Duplicación de exámenes completos.

---

# Calidad técnica

- Implementar DuplicateQuestionCommand.
- Implementar DuplicateQuestionCommandHandler.
- Implementar Validator cuando corresponda.
- Utilizar MediatR.
- Crear nuevas entidades e identificadores.
- No reutilizar referencias mutables de la pregunta origen.
- Mantener consistencia transaccional.
- No implementar lógica de negocio en el Controller.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Registrar fechas en UTC.
- Mantener la nueva pregunta inactiva por defecto.
- Incluir pruebas unitarias para el Handler.
- Verificar que la pregunta origen no se modifique.
- Verificar que las opciones reciban identificadores nuevos.
- Incluir pruebas de integración.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
