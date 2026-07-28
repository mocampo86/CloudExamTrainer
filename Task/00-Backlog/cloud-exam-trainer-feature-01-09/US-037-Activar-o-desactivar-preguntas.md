# US-037 - Activar o desactivar preguntas

## Objetivo

Como administrador del banco de preguntas

Quiero activar o desactivar una pregunta

Para controlar si puede utilizarse en nuevos cuestionarios sin eliminarla.

---

# Acceptance Criteria

- Se implementa un endpoint REST para cambiar el estado de una pregunta.
- La operación utiliza un Command de MediatR.
- Se implementa el CommandHandler correspondiente.
- Se valida que la pregunta exista.
- Se valida que la pregunta no esté eliminada lógicamente.
- Se permite cambiar el estado entre activa e inactiva.
- Activar una pregunta valida que tenga una estructura válida.
- Para activar, se valida que tenga al menos dos opciones.
- Para activar, se valida que tenga la cantidad correcta de respuestas correctas.
- Para activar, se valida que el examen asociado exista y esté habilitado.
- Para activar, se valida que la categoría o dominio sea válido cuando corresponda.
- Una pregunta inactiva no puede utilizarse para generar nuevos cuestionarios.
- Desactivar una pregunta no elimina información histórica.
- Desactivar una pregunta no elimina sus opciones.
- Se actualiza la fecha de modificación en UTC.
- La operación es idempotente.
- Activar una pregunta ya activa devuelve una respuesta consistente.
- Desactivar una pregunta ya inactiva devuelve una respuesta consistente.
- Se devuelve HTTP 200 cuando la operación finaliza correctamente.
- Se devuelve HTTP 400 cuando la pregunta no cumple las condiciones para activarse.
- Se devuelve HTTP 404 cuando la pregunta no existe.
- Se devuelve HTTP 409 cuando exista un conflicto funcional.
- Los errores utilizan el formato estándar de la API.
- El endpoint queda documentado mediante Swagger/OpenAPI.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Activación masiva.
- Desactivación masiva.
- Programación futura de activación.
- Workflow de aprobación.
- Auditoría funcional completa.
- Notificaciones.
- Restauración de preguntas eliminadas.
- Publicación por ambiente.
- Activación automática basada en reglas.

---

# Calidad técnica

- Implementar ChangeQuestionStatusCommand o comandos separados según las convenciones del proyecto.
- Implementar el CommandHandler correspondiente.
- Implementar Validator cuando corresponda.
- Utilizar MediatR.
- Centralizar las reglas de activación.
- No implementar lógica de negocio en el Controller.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Registrar fechas en UTC.
- Mantener la operación idempotente.
- Incluir pruebas unitarias para activación válida e inválida.
- Incluir pruebas para desactivación.
- Incluir pruebas de integración.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
