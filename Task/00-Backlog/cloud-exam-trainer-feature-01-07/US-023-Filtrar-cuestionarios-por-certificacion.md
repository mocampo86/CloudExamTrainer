# US-023 - Filtrar cuestionarios por certificación seleccionada

## Descripción

Como usuario de **Cloud Exam Trainer**, quiero que el cuestionario
utilice únicamente preguntas correspondientes a la certificación
seleccionada, para practicar contenido relevante al examen que estoy
preparando.

## Objetivo

Adaptar el flujo de generación de cuestionarios para que la
certificación seleccionada sea un criterio obligatorio y validado en
backend.

La solución debe evitar cualquier mezcla de temas o preguntas entre
certificaciones y mantener la lógica existente de selección por tema y
cantidad de preguntas.

## Acceptance Criteria

### Contexto de certificación

-   Todo cuestionario se genera dentro del contexto de una certificación
    válida.
-   La solicitud para iniciar un cuestionario incluye el identificador o
    código estable de la certificación.
-   El backend no depende únicamente del filtrado realizado por el
    frontend.
-   La certificación recibida se valida antes de seleccionar preguntas.
-   No se utiliza el nombre visible de la certificación como
    identificador técnico.
-   El contexto de certificación se mantiene durante todo el flujo del
    cuestionario.
-   La certificación seleccionada queda disponible para la página de
    resultados.
-   La solución queda preparada para múltiples certificaciones activas.

### Validación de certificación

-   El sistema valida que la certificación exista.
-   El sistema valida que la certificación se encuentre activa.
-   No se permite iniciar un cuestionario con una certificación
    inexistente.
-   No se permite iniciar un cuestionario con una certificación
    inactiva.
-   Los errores de certificación inválida utilizan el formato estándar
    de errores de la API.
-   Los mensajes de error son comprensibles y no exponen información
    interna.
-   La API responde con códigos HTTP coherentes con el tipo de error.

### Validación de temas

-   Cuando se selecciona un tema, el backend valida que pertenezca a la
    certificación indicada.
-   No se permite utilizar un tema asociado a otra certificación.
-   No se permite iniciar un cuestionario con una combinación inválida
    de certificación y tema.
-   Los cuestionarios sin tema específico continúan siendo posibles si
    el flujo actual los admite.
-   Cuando no se especifica tema, las preguntas se obtienen únicamente
    desde la certificación seleccionada.
-   La validación de pertenencia no queda duplicada en múltiples capas.

### Selección de preguntas

-   Todas las preguntas seleccionadas pertenecen a la certificación
    indicada.
-   Cuando existe un tema seleccionado, todas las preguntas pertenecen
    también a ese tema.
-   El sistema evita mezclar preguntas de diferentes certificaciones.
-   El filtrado por certificación se aplica antes de seleccionar la
    cantidad solicitada.
-   Se mantiene el comportamiento aleatorio actual cuando corresponda.
-   La cantidad solicitada se respeta cuando existen suficientes
    preguntas disponibles.
-   Si no existen suficientes preguntas, se mantiene o documenta el
    comportamiento funcional definido por la aplicación.
-   No se devuelven preguntas inactivas o no disponibles si el modelo
    contempla dichos estados.
-   La lógica de selección queda centralizada en el servicio
    correspondiente.

### Contrato de solicitud

-   El contrato para iniciar o generar un cuestionario incluye la
    certificación seleccionada.
-   El campo de certificación es obligatorio.
-   El contrato mantiene el tipado utilizado por la API.
-   Se actualiza la documentación OpenAPI o Swagger.
-   Los nombres de las propiedades son claros y consistentes.
-   No se introducen campos redundantes.
-   El contrato puede evolucionar sin acoplarse a componentes
    específicos del frontend.

### Contrato de respuesta

-   La respuesta del cuestionario incluye el identificador de la
    certificación.
-   La respuesta incluye el nombre o código de la certificación cuando
    resulte útil para el consumidor.
-   Las preguntas devueltas no exponen respuestas correctas antes de la
    validación si el flujo actual así lo requiere.
-   No se exponen propiedades internas de persistencia.
-   La estructura de respuesta continúa siendo compatible con el
    frontend o se actualiza de forma controlada.

### Frontend

-   El frontend envía la certificación seleccionada al iniciar el
    cuestionario.
-   No se inicia el flujo si no existe una certificación válida.
-   La certificación enviada corresponde a la selección actual del
    usuario.
-   El cambio de certificación limpia cualquier tema previamente
    seleccionado que sea incompatible.
-   El flujo no depende de valores hardcodeados de AWS.
-   El frontend maneja correctamente los errores devueltos por la API.
-   El usuario recibe un mensaje claro cuando la combinación
    seleccionada no es válida.
-   El estado del formulario permanece consistente después de un error.

### Navegación y estado

-   La certificación seleccionada se conserva al navegar hacia la página
    del cuestionario.
-   Una recarga de página no debe producir un cuestionario asociado a
    una certificación diferente.
-   Si el estado requerido no está disponible, la aplicación redirige o
    muestra un mensaje controlado.
-   No se inicia un cuestionario utilizando valores por defecto
    silenciosos.
-   La certificación permanece disponible para mostrarla en el
    encabezado del cuestionario cuando corresponda.
-   La navegación existente continúa funcionando.

### Compatibilidad con la lógica actual

-   Se mantiene la selección actual de cantidad de preguntas.
-   Se mantiene el flujo actual de respuesta y navegación entre
    preguntas.
-   No se modifica la lógica de corrección.
-   No se modifica el cálculo de puntaje.
-   No se altera el orden de preguntas salvo por el filtrado requerido.
-   No se rompe el soporte actual para selección por tema.
-   Las preguntas existentes de AWS continúan siendo utilizables.

### Manejo de datos actuales

-   Las preguntas existentes se encuentran asociadas a AWS Certified
    Solutions Architect -- Associate antes de aplicar el filtrado.
-   Los temas existentes se encuentran asociados a la misma
    certificación.
-   No se pierden preguntas durante la adaptación.
-   No se generan cuestionarios vacíos por falta de asociación de los
    datos actuales.
-   La migración o actualización de datos queda documentada.
-   Los ambientes existentes pueden actualizarse de manera controlada.

### Seguridad e integridad

-   El backend no confía en identificadores enviados sin validación.
-   No se permite acceder a contenido de una certificación inactiva
    mediante manipulación de la solicitud.
-   No se permite combinar manualmente un tema con una certificación
    diferente.
-   Las consultas utilizan parámetros y mecanismos seguros del ORM o
    repositorio.
-   No se exponen detalles internos de base de datos en mensajes de
    error.
-   La certificación se valida en el límite de aplicación
    correspondiente.

### Observabilidad

-   Los errores de validación se registran según las convenciones del
    proyecto.
-   Los logs incluyen identificadores útiles sin registrar datos
    sensibles.
-   Los fallos inesperados utilizan el manejo global de errores.
-   No se registran cuerpos completos de solicitudes si contienen
    información que no sea necesaria.
-   La certificación puede incluirse como contexto técnico en logs
    cuando sea útil.

### Pruebas

-   Se prueba la generación de un cuestionario para una certificación
    válida.
-   Se verifica que todas las preguntas pertenezcan a la certificación
    seleccionada.
-   Se prueba el filtrado conjunto por certificación y tema.
-   Se prueba una certificación inexistente.
-   Se prueba una certificación inactiva.
-   Se prueba un tema que pertenece a otra certificación.
-   Se prueba la generación sin tema cuando el flujo lo permite.
-   Se prueba el comportamiento cuando no existen preguntas suficientes.
-   Se verifica que la lógica de corrección no cambie.
-   Se actualizan las pruebas existentes afectadas por el nuevo campo
    obligatorio.
-   Las pruebas existentes continúan funcionando.

### Documentación

-   Se documenta cómo se transmite la certificación al iniciar un
    cuestionario.
-   Se documentan las validaciones aplicadas.
-   Se documenta el comportamiento cuando no existen preguntas
    suficientes.
-   Se actualizan ejemplos de Swagger u OpenAPI.
-   Se documenta cualquier cambio de compatibilidad en el contrato.

### Calidad técnica

-   La implementación respeta la arquitectura actual.
-   No se duplica la lógica de filtrado.
-   No se agregan dependencias innecesarias.
-   El código mantiene tipado estricto.
-   Las consultas evitan cargar información innecesaria.
-   La aplicación compila sin errores.
-   La API inicia correctamente.
-   El frontend continúa compilando.
-   La implementación puede entregarse mediante un Pull Request
    independiente.

## Out of Scope

-   No modificar la lógica de corrección.
-   No modificar el cálculo de puntaje.
-   No implementar modo examen completo.
-   No implementar temporizador.
-   No agregar dificultad adaptativa.
-   No implementar recomendaciones automáticas.
-   No crear nuevas certificaciones.
-   No crear un panel administrativo.
-   No importar preguntas desde fuentes externas.
-   No asociar resultados históricamente en esta historia.
-   No implementar estadísticas por certificación.
-   No rediseñar completamente la página del cuestionario.
-   No implementar comparación entre certificaciones.
-   No implementar versionado avanzado de exámenes.
