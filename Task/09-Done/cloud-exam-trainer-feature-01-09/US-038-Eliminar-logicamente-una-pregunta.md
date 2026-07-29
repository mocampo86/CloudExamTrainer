# US-038 - Eliminar lógicamente una pregunta

## Objetivo

Como administrador del banco de preguntas

Quiero eliminar lógicamente una pregunta

Para retirarla del sistema sin perder información histórica ni romper referencias existentes.

---

# Acceptance Criteria

- Se implementa un endpoint REST para eliminar lógicamente una pregunta.
- El endpoint utiliza el método HTTP DELETE.
- La ruta incluye el identificador de la pregunta.
- La operación utiliza un Command de MediatR.
- Se implementa el CommandHandler correspondiente.
- Se valida que la pregunta exista.
- Se valida que no esté eliminada previamente.
- La eliminación no ejecuta un DELETE físico.
- La pregunta cambia al estado eliminado definido por el dominio.
- La pregunta queda inactiva.
- Se registra la fecha de eliminación en UTC cuando el modelo lo contemple.
- Se actualiza la fecha de modificación en UTC.
- Las opciones asociadas dejan de estar disponibles para nuevos cuestionarios.
- Las opciones no se eliminan físicamente.
- Las referencias históricas permanecen válidas.
- La pregunta eliminada no aparece por defecto en listados.
- La pregunta eliminada no puede editarse, activarse ni utilizarse.
- La operación es idempotente según la convención definida.
- Se devuelve HTTP 200 o HTTP 204 cuando la operación finaliza correctamente.
- Se devuelve HTTP 404 cuando la pregunta no existe.
- Se devuelve HTTP 409 cuando exista una restricción funcional explícita.
- Los errores utilizan el formato estándar de la API.
- El endpoint queda documentado mediante Swagger/OpenAPI.
- La documentación indica explícitamente que la eliminación es lógica.
- La solución compila sin errores.
- Las pruebas existentes continúan funcionando.

---

# Out of Scope

- Eliminación física.
- Purga definitiva.
- Eliminación masiva.
- Restauración.
- Papelera de reciclaje.
- Retención configurable.
- Auditoría funcional completa.
- Reasignación de referencias.
- Eliminación automática.
- Workflow de aprobación.

---

# Calidad técnica

- Implementar DeleteQuestionCommand.
- Implementar DeleteQuestionCommandHandler.
- Utilizar MediatR.
- Mantener la eliminación lógica en dominio o aplicación.
- No ejecutar eliminación física.
- No implementar lógica de negocio en el Controller.
- Utilizar CancellationToken.
- Utilizar operaciones asincrónicas.
- Registrar fechas en UTC.
- Aplicar filtros globales cuando formen parte de la estrategia del proyecto.
- Mantener integridad referencial.
- Incluir pruebas unitarias para el Handler.
- Incluir pruebas de integración para verificar la exclusión de listados.
- Incluir pruebas de idempotencia.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
