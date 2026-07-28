# US-021 - Exponer certificaciones disponibles desde la API

## Descripción

Como usuario de **Cloud Exam Trainer**, quiero que la aplicación pueda
consultar las certificaciones disponibles desde la API, para seleccionar
el examen que deseo preparar sin depender de valores hardcodeados en el
frontend.

## Objetivo

Implementar la capacidad de consultar desde la API el listado de
certificaciones activas y obtener el detalle de una certificación
específica.

La solución debe permitir que el frontend consuma esta información de
forma dinámica y debe quedar preparada para incorporar nuevas
certificaciones sin modificar la lógica principal de la aplicación.

## Acceptance Criteria

### Endpoint de certificaciones

-   Se implementa un endpoint para obtener las certificaciones
    disponibles.
-   El endpoint utiliza una ruta coherente con las convenciones
    existentes de la API.
-   El endpoint devuelve únicamente certificaciones activas.
-   El endpoint no devuelve certificaciones eliminadas o inactivas.
-   La respuesta utiliza un contrato específico y no expone directamente
    las entidades de persistencia.
-   El endpoint responde correctamente cuando existe una única
    certificación.
-   El endpoint queda preparado para devolver múltiples certificaciones.
-   La respuesta se encuentra ordenada de forma consistente.
-   La estrategia de ordenamiento queda documentada.
-   El endpoint utiliza el código de estado HTTP `200 OK` cuando la
    consulta es exitosa.

### Información devuelta

Cada certificación disponible incluye como mínimo:

-   Identificador.
-   Código.
-   Nombre.
-   Descripción.
-   Proveedor.
-   Versión, si se encuentra disponible.
-   Nivel de dificultad, si aplica.
-   Imagen o logo, si se encuentra configurado.
-   Estado activo.

### Proveedor

-   La respuesta permite identificar el proveedor de cada certificación.
-   El proveedor incluye como mínimo su identificador y nombre.
-   La API no asume que todas las certificaciones pertenecen a AWS.
-   El contrato queda preparado para proveedores como Azure, Google
    Cloud u otros.

### Detalle de certificación

-   Se implementa un endpoint para obtener una certificación por
    identificador o código.
-   La estrategia seleccionada para identificar el recurso queda
    documentada.
-   El endpoint devuelve únicamente certificaciones activas para
    consumidores públicos.
-   Cuando la certificación existe, la API responde con `200 OK`.
-   Cuando la certificación no existe, la API responde con
    `404 Not Found`.
-   Cuando la certificación está inactiva, no se expone como disponible
    para selección.
-   El detalle incluye los mismos datos básicos del listado y puede
    incluir información descriptiva adicional.

### Contratos

-   Se define un DTO para el listado de certificaciones.
-   Se define un DTO para el detalle de certificación cuando sea
    necesario.
-   Los DTO no exponen propiedades internas innecesarias.
-   Los nombres de propiedades son claros y consistentes.
-   Los contratos no contienen lógica de negocio.
-   Los contratos pueden evolucionar sin acoplar el frontend al modelo
    de persistencia.
-   No se exponen datos sensibles ni información técnica interna.

### Servicio de aplicación

-   La obtención de certificaciones se implementa mediante un servicio o
    caso de uso.
-   El controlador o endpoint no accede directamente a la persistencia.
-   La lógica de filtrado de certificaciones activas se encuentra
    centralizada.
-   La lógica puede reutilizarse desde otros consumidores.
-   El servicio admite cancelación mediante `CancellationToken` si la
    arquitectura actual lo utiliza.
-   El servicio no contiene dependencias específicas del frontend.

### Persistencia

-   La consulta obtiene los datos desde el mecanismo de persistencia
    definido por el proyecto.
-   No se utilizan listas hardcodeadas dentro del controlador.
-   La consulta evita cargar información innecesaria.
-   La consulta utiliza acceso de solo lectura cuando corresponda.
-   La consulta evita problemas de seguimiento innecesario en el ORM.
-   La implementación queda preparada para múltiples proveedores y
    certificaciones.

### Certificación inicial

-   La API devuelve la certificación **AWS Certified Solutions Architect
    -- Associate**.
-   La certificación inicial posee un identificador válido.
-   La certificación inicial posee un código único y consistente.
-   La certificación inicial se encuentra activa.
-   El nombre mostrado es apto para ser utilizado directamente por el
    frontend.
-   Los datos no se duplican en distintas capas de la aplicación.

### Validaciones y errores

-   Se validan los identificadores o códigos recibidos.
-   Los errores de validación responden con un código HTTP adecuado.
-   Los mensajes de error no exponen detalles internos.
-   Se mantiene el formato de errores utilizado por la API.
-   Los errores inesperados son procesados por el mecanismo global de
    errores existente.
-   No se devuelve `200 OK` con una respuesta inválida o vacía cuando el
    recurso solicitado no existe.

### Documentación de API

-   Los endpoints aparecen correctamente en Swagger u OpenAPI.
-   Se documenta el propósito de cada endpoint.
-   Se documentan los códigos de respuesta posibles.
-   Se documenta la estructura básica de la respuesta.
-   Los ejemplos utilizados no contienen datos sensibles.
-   Los nombres de las operaciones son claros.

### Pruebas

-   Se agregan pruebas para obtener el listado de certificaciones
    activas.
-   Se verifica que una certificación inactiva no sea devuelta.
-   Se verifica la respuesta cuando solo existe una certificación.
-   Se verifica el detalle de una certificación existente.
-   Se verifica la respuesta `404 Not Found` para una certificación
    inexistente.
-   Se verifica el mapeo entre la entidad y el DTO.
-   Las pruebas existentes continúan funcionando.

### Calidad técnica

-   La implementación respeta la arquitectura actual del proyecto.
-   No se agregan dependencias innecesarias.
-   No se duplica lógica de consulta.
-   Los nombres de clases, métodos y contratos son consistentes.
-   La aplicación compila sin errores.
-   La API inicia correctamente.
-   La funcionalidad queda documentada.
-   El cambio puede implementarse mediante un Pull Request
    independiente.

## Out of Scope

-   No implementar el selector visual de certificaciones.
-   No modificar la página de inicio.
-   No exponer preguntas desde esta historia.
-   No exponer temas por certificación desde esta historia, salvo que ya
    exista el endpoint y solo requiera adaptación mínima.
-   No iniciar cuestionarios.
-   No asociar resultados a certificaciones.
-   No implementar paginación avanzada.
-   No implementar búsqueda por texto.
-   No implementar filtros administrativos.
-   No crear, editar ni eliminar certificaciones desde la API.
-   No implementar autenticación o autorización administrativa.
-   No integrar APIs externas de AWS, Azure o Google Cloud.
-   No importar certificaciones automáticamente.
-   No implementar caché distribuida.
-   No implementar versionado histórico de certificaciones.
