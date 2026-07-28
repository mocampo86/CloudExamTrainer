# Feature 05 - API administrativa de preguntas

## Objetivo

Implementar la primera versión de la API administrativa para gestionar el banco de preguntas de los distintos exámenes soportados por la plataforma.

Esta feature permitirá crear y modificar preguntas de forma controlada desde el backend, dejando preparada la arquitectura para futuras funcionalidades como importación masiva, versionado, revisión, aprobación, búsqueda avanzada y soporte para múltiples certificaciones.

La implementación deberá respetar la arquitectura existente de TribuApi basada en Clean Architecture, CQRS y Entity Framework.

---

# Acceptance Criteria

- Se implementan endpoints REST para administración de preguntas.
- Se implementa el caso de uso para crear preguntas.
- Se implementa el caso de uso para editar preguntas.
- Las operaciones utilizan CQRS mediante Commands.
- Se respetan las validaciones definidas por FluentValidation.
- Se utilizan DTOs independientes del modelo de persistencia.
- No se exponen entidades de EF Core.
- Se registra correctamente la información en la base de datos.
- La arquitectura permite agregar nuevos tipos de preguntas sin romper compatibilidad.
- La solución compila sin errores.
- Se generan respuestas HTTP consistentes.
- Los endpoints quedan preparados para futura autenticación por roles.
- Se documentan los endpoints mediante Swagger.

---

# Out of Scope

- Eliminación de preguntas.
- Importación masiva.
- Exportación.
- Versionado.
- Workflow de aprobación.
- Historial de cambios.
- Auditoría funcional.
- Carga de imágenes.
- Manejo de archivos multimedia.
- Búsqueda avanzada.
- Filtros.
- Paginación.
- Soporte para múltiples idiomas.
- Integración con IA.

---

# Calidad técnica

- Seguir Clean Architecture.
- Utilizar MediatR.
- Utilizar FluentValidation.
- Utilizar Entity Framework Core.
- No utilizar lógica dentro del Controller.
- Mantener separación entre Domain, Application, Infrastructure y API.
- Mantener código testeable.
- Seguir convenciones del proyecto.
- Listo para Azure DevOps.
- Listo para implementación mediante Devin.
