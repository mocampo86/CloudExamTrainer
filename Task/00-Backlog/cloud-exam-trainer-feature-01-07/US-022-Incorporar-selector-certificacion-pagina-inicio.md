# US-022 - Incorporar selector de certificación en la página de inicio

## Descripción

Como usuario de **Cloud Exam Trainer**, quiero seleccionar la
certificación que deseo preparar desde la página de inicio, para que los
temas y cuestionarios disponibles correspondan al examen elegido.

## Objetivo

Incorporar en la página de inicio un selector de certificaciones
alimentado por la API.

Inicialmente solo estará disponible **AWS Certified Solutions Architect
-- Associate**, pero el componente debe quedar preparado para mostrar
múltiples certificaciones sin requerir cambios estructurales.

## Acceptance Criteria

### Carga de certificaciones

-   La página de inicio consulta las certificaciones disponibles desde
    la API.
-   La información no se obtiene desde una lista hardcodeada en el
    frontend.
-   La consulta se ejecuta al cargar la página o en el momento definido
    por la arquitectura actual.
-   Solo se muestran certificaciones activas.
-   La solución queda preparada para recibir múltiples certificaciones.
-   La carga no bloquea innecesariamente el resto de la aplicación.
-   La integración utiliza el cliente HTTP definido por el proyecto.
-   La URL de la API se obtiene desde la configuración por ambiente.

### Selector de certificación

-   Se agrega un control para seleccionar la certificación.
-   El control aparece antes del selector de tema.
-   El control utiliza los estilos visuales definidos para la
    aplicación.
-   El selector muestra el nombre de la certificación.
-   El selector permite identificar el proveedor.
-   El selector admite una única opción sin comportamientos especiales
    hardcodeados.
-   El componente admite múltiples opciones en el futuro.
-   El valor interno utiliza el identificador o código estable de la
    certificación.
-   El valor mostrado no se utiliza como identificador técnico.
-   El control posee un label visible y descriptivo.

### Certificación inicial

-   Se muestra como opción **AWS Certified Solutions Architect --
    Associate**.
-   La certificación se obtiene desde la API.
-   No se define el nombre del examen directamente dentro del
    componente.
-   Cuando solo existe una certificación, la experiencia continúa siendo
    clara.
-   La estrategia de selección inicial queda definida.
-   Si se selecciona automáticamente la única certificación disponible,
    el comportamiento queda documentado.
-   Si se requiere selección manual, el placeholder lo comunica
    claramente.

### Dependencia con temas

-   El selector de temas depende de la certificación seleccionada.
-   No se cargan temas antes de contar con una certificación válida.
-   Al seleccionar una certificación, se consultan o filtran sus temas.
-   Solo se muestran temas correspondientes a la certificación
    seleccionada.
-   Al cambiar la certificación, se limpia el tema seleccionado
    previamente.
-   Al cambiar la certificación, se limpia cualquier cantidad de
    preguntas que haya quedado inválida.
-   No se permite conservar un tema perteneciente a otra certificación.
-   La relación entre certificación y tema se valida también en backend
    en historias posteriores o existentes.

### Estado del formulario

-   El botón para iniciar el cuestionario permanece deshabilitado hasta
    contar con una selección válida.
-   El formulario distingue claramente entre estados cargando, listo y
    con error.
-   Los controles dependientes se deshabilitan cuando no existe una
    certificación seleccionada.
-   No se permite enviar un identificador vacío o inválido.
-   La selección de certificación forma parte del estado del formulario.
-   El estado no se duplica innecesariamente entre componentes.
-   La lógica de validación es consistente con el resto del formulario.

### Persistencia de selección

-   La certificación seleccionada permanece disponible durante el flujo
    de creación del cuestionario.
-   La selección puede transmitirse mediante el mecanismo de estado o
    navegación utilizado por la aplicación.
-   No se depende únicamente del texto visible del selector.
-   Al iniciar el cuestionario se utiliza el identificador de la
    certificación.
-   Una recarga de página no debe generar un estado inconsistente.
-   Si se decide persistir la selección localmente, se documenta el
    alcance.
-   No se persisten datos innecesarios o sensibles.

### Diseño visual

-   El selector mantiene la identidad visual de Cloud Exam Trainer.
-   No utiliza la apariencia HTML por defecto del navegador.
-   El control posee altura, padding y bordes consistentes con los demás
    inputs.
-   Se muestran correctamente los estados:
    -   Hover.
    -   Focus.
    -   Selected.
    -   Disabled.
    -   Error.
-   El selector se integra visualmente con la card principal.
-   Los espacios entre certificación, tema y cantidad de preguntas son
    consistentes.
-   La interfaz no se ve saturada cuando existan varias certificaciones.
-   El diseño contempla nombres de certificaciones extensos.

### Responsive

-   El selector funciona correctamente en desktop.
-   El selector funciona correctamente en tablet.
-   El selector funciona correctamente en mobile.
-   El contenido no genera scroll horizontal.
-   Los textos extensos no rompen el layout.
-   El control ocupa el ancho disponible en pantallas pequeñas.
-   El área interactiva posee un tamaño adecuado para dispositivos
    táctiles.

### Accesibilidad

-   El selector está asociado correctamente con su label.
-   Puede utilizarse mediante teclado.
-   El foco es visible.
-   Los estados de error no dependen únicamente del color.
-   Los mensajes de carga y error pueden ser interpretados por
    tecnologías de asistencia.
-   El contraste cumple con los criterios visuales definidos por la
    aplicación.
-   El orden de tabulación es lógico.

### Estado de carga

-   Mientras se consultan las certificaciones, se muestra un indicador
    de carga apropiado.
-   El selector no permite interacción durante la carga.
-   No se muestra un listado vacío como si fuera un resultado válido.
-   El indicador no provoca saltos visuales significativos.
-   La carga utiliza el componente o patrón existente en la aplicación
    cuando corresponda.

### Manejo de errores

-   Si la API de certificaciones falla, se muestra un mensaje
    comprensible.
-   El mensaje no expone detalles técnicos internos.
-   El usuario puede reintentar la carga cuando corresponda.
-   El botón de iniciar cuestionario permanece deshabilitado ante un
    error.
-   La aplicación no falla ni muestra una pantalla en blanco.
-   Los errores se registran utilizando el mecanismo existente cuando
    aplique.
-   Se contempla el caso en que la API devuelve cero certificaciones
    activas.

### Estado vacío

-   Si no existen certificaciones disponibles, se muestra un mensaje
    claro.
-   No se permite iniciar un cuestionario.
-   No se muestran selectores dependientes en un estado engañoso.
-   La interfaz queda preparada para futuras acciones administrativas,
    aunque no se implementen en esta historia.

### Integración con navegación

-   La navegación existente continúa funcionando.
-   No se modifican rutas no relacionadas.
-   La certificación seleccionada se transmite al flujo del
    cuestionario.
-   No se rompe el acceso a resultados o historial.
-   Los enlaces existentes conservan sus estados visuales y funcionales.

### Pruebas

-   Se prueba la carga exitosa de certificaciones.
-   Se prueba el estado con una única certificación.
-   Se prueba el estado con múltiples certificaciones.
-   Se prueba el estado sin certificaciones activas.
-   Se prueba el error de API.
-   Se prueba la selección de una certificación.
-   Se prueba la limpieza del tema al cambiar de certificación.
-   Se prueba que el cuestionario no pueda iniciarse sin certificación.
-   Se verifica que el identificador correcto sea enviado al siguiente
    flujo.
-   Las pruebas existentes continúan funcionando.

### Calidad técnica

-   Se reutilizan componentes existentes cuando corresponde.
-   No se duplica la lógica de llamadas HTTP.
-   No se introducen dependencias de UI sin aprobación.
-   El código mantiene tipado estricto.
-   No se utiliza `any` sin justificación.
-   Los estados asincrónicos se manejan de forma clara.
-   El componente queda preparado para futuras certificaciones.
-   La aplicación compila sin errores.
-   La página funciona correctamente en ambiente local.
-   La implementación puede entregarse mediante un Pull Request
    independiente.

## Out of Scope

-   No crear ni editar certificaciones desde el frontend.
-   No implementar una página de catálogo completa.
-   No mostrar precios, planes o suscripciones.
-   No implementar favoritos.
-   No implementar recomendaciones de certificaciones.
-   No mostrar progreso histórico por certificación.
-   No implementar rutas de aprendizaje.
-   No rediseñar completamente la página de inicio fuera de los ajustes
    necesarios.
-   No modificar la lógica de corrección de preguntas.
-   No implementar el filtrado definitivo del backend si corresponde a
    otra historia.
-   No asociar resultados a la certificación desde esta historia.
-   No implementar búsqueda o filtros avanzados.
-   No descargar logos desde proveedores externos.
-   No integrar servicios oficiales de AWS, Azure o Google Cloud.
