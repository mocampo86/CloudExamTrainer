# US-024 - Asociar resultados a la certificación realizada

## Descripción

Como usuario de **Cloud Exam Trainer**, quiero que cada resultado quede
asociado a la certificación correspondiente, para identificar claramente
mi desempeño en cada examen y evitar mezclar resultados de
certificaciones diferentes.

## Objetivo

Actualizar el flujo de finalización y persistencia de resultados para
conservar la referencia a la certificación utilizada durante el
cuestionario.

La página de resultados y cualquier historial existente deben poder
identificar el examen realizado, dejando preparada la plataforma para
futuras métricas y progresos independientes por certificación.

## Acceptance Criteria

### Asociación del resultado

-   Todo resultado nuevo queda asociado a una certificación.
-   La certificación del resultado coincide con la utilizada para
    generar el cuestionario.
-   No se permite guardar un resultado sin certificación.
-   No se permite modificar la certificación al finalizar el
    cuestionario.
-   La asociación utiliza un identificador estable.
-   El resultado no depende únicamente del nombre visible de la
    certificación.
-   La relación queda preparada para múltiples certificaciones.

### Fuente de verdad

-   La certificación del resultado se obtiene desde el cuestionario o
    intento generado por el backend.
-   El backend no confía únicamente en una certificación enviada
    nuevamente por el frontend.
-   El usuario no puede alterar la certificación del resultado
    manipulando la solicitud.
-   La certificación se valida antes de persistir el resultado.
-   La lógica para resolver la certificación se encuentra centralizada.

### Modelo y persistencia

-   El modelo de resultado incluye una referencia a CertificationExam o
    equivalente.
-   La relación se configura de acuerdo con las convenciones del
    proyecto.
-   La referencia es obligatoria para resultados nuevos.
-   Se define el comportamiento de eliminación o desactivación de una
    certificación con resultados existentes.
-   Desactivar una certificación no elimina sus resultados históricos.
-   No se elimina en cascada información histórica de forma accidental.
-   Las consultas pueden filtrar resultados por certificación.
-   Se crea o actualiza la migración necesaria cuando corresponda.
-   La migración puede ejecutarse en los ambientes soportados.
-   La migración no provoca pérdida de resultados existentes.

### Datos históricos

-   Los resultados existentes se asocian a AWS Certified Solutions
    Architect -- Associate cuando corresponda.
-   Se define una estrategia de migración para registros históricos.
-   No quedan resultados existentes en un estado inconsistente.
-   La estrategia queda documentada.
-   Si no es posible inferir una certificación para algún registro, se
    define un tratamiento explícito.
-   No se asignan certificaciones arbitrarias sin justificación.
-   La actualización puede verificarse después de ejecutar la migración.

### Registro del resultado

-   Al finalizar un cuestionario, el resultado conserva el identificador
    de certificación.
-   Se mantienen los datos actuales de puntaje, respuestas correctas e
    incorrectas.
-   Se mantiene la cantidad total de preguntas.
-   Se mantiene el tema cuando corresponda.
-   Se mantiene la fecha y hora del intento.
-   Se mantiene el tiempo empleado si ya existe.
-   No se modifica la lógica de evaluación.
-   No se modifica el cálculo del porcentaje.
-   La operación continúa siendo transaccional cuando corresponda.

### Contratos de API

-   Los contratos de creación o finalización de resultados se actualizan
    cuando sea necesario.
-   El contrato de respuesta incluye información de la certificación.
-   La información incluye como mínimo:
    -   Identificador.
    -   Código.
    -   Nombre.
    -   Proveedor, cuando corresponda.
-   No se exponen entidades de persistencia directamente.
-   No se exponen propiedades internas innecesarias.
-   Se mantiene compatibilidad con consumidores existentes cuando sea
    posible.
-   Cualquier cambio incompatible queda documentado.

### Página de resultados

-   La página de resultados muestra el nombre de la certificación
    realizada.
-   La certificación se presenta de forma visible y clara.
-   El nombre no se obtiene desde un valor hardcodeado.
-   La información se obtiene desde el resultado o contexto validado del
    cuestionario.
-   La página continúa mostrando el puntaje actual.
-   La página continúa mostrando respuestas correctas e incorrectas.
-   La página mantiene su comportamiento responsive.
-   La ausencia inesperada de información de certificación se maneja de
    forma controlada.
-   No se muestra una certificación incorrecta como valor por defecto.

### Historial de resultados

-   Si existe historial, cada registro permite identificar la
    certificación correspondiente.
-   Los resultados pueden filtrarse por certificación a nivel de
    repositorio o servicio.
-   No se mezclan métricas de diferentes certificaciones sin
    identificación.
-   El historial existente continúa funcionando.
-   La estructura queda preparada para futuros filtros visuales por
    certificación.
-   No es obligatorio implementar el control visual de filtrado dentro
    de esta historia.

### Consultas y servicios

-   Los servicios de resultados incluyen la certificación en sus
    proyecciones.
-   Las consultas evitan cargas innecesarias.
-   Se utiliza acceso de solo lectura cuando corresponda.
-   No se realizan consultas adicionales por cada resultado si puede
    evitarse.
-   La lógica de mapeo se centraliza.
-   Los repositorios o queries permiten filtrar por CertificationExamId.
-   La solución queda preparada para estadísticas independientes por
    certificación.

### Validaciones

-   No se guarda un resultado si el cuestionario no posee certificación
    válida.
-   No se guarda un resultado para una certificación inexistente.
-   No se permite asociar el resultado a una certificación diferente a
    la del cuestionario.
-   Los errores utilizan el formato estándar de la API.
-   Los mensajes no exponen información técnica interna.
-   Los errores inesperados pasan por el manejador global.
-   La validación no se limita únicamente al frontend.

### Integridad y seguridad

-   La asociación entre cuestionario, preguntas y resultado mantiene
    consistencia.
-   No se puede alterar la certificación mediante manipulación del
    cliente.
-   Los identificadores recibidos se validan.
-   Las operaciones de persistencia utilizan mecanismos seguros.
-   No se registran respuestas sensibles o payloads completos
    innecesariamente.
-   Los logs pueden incluir el identificador de certificación como
    contexto técnico.

### Documentación de API

-   Swagger u OpenAPI refleja la certificación en los resultados.
-   Se actualizan ejemplos de respuesta.
-   Se documentan nuevos campos.
-   Se documentan posibles errores.
-   Los contratos mantienen nombres consistentes.
-   No se incluyen ejemplos con datos sensibles.

### Pruebas

-   Se prueba la creación de un resultado asociado a una certificación
    válida.
-   Se verifica que la certificación coincide con la del cuestionario.
-   Se prueba el rechazo de una certificación manipulada.
-   Se prueba el rechazo de un cuestionario sin certificación.
-   Se prueba la consulta de un resultado con información de
    certificación.
-   Se prueba el listado o historial con múltiples certificaciones.
-   Se prueba el filtrado por certificación a nivel de servicio o
    repositorio.
-   Se prueba la migración o adaptación de resultados existentes.
-   Se verifica que el cálculo del resultado no cambie.
-   Las pruebas existentes continúan funcionando.

### Compatibilidad

-   Los resultados existentes continúan siendo accesibles.
-   El frontend continúa mostrando los datos actuales.
-   No se rompe la navegación desde el cuestionario hacia resultados.
-   No se pierde información histórica.
-   Los cambios de contrato se actualizan en frontend y backend de forma
    coordinada.
-   La aplicación puede desplegarse mediante la estrategia actual.

### Calidad técnica

-   La implementación respeta la arquitectura vigente.
-   No se duplica la lógica de resolución de certificación.
-   No se agregan dependencias innecesarias.
-   El código mantiene tipado estricto.
-   La aplicación compila sin errores.
-   La API inicia correctamente.
-   El frontend compila correctamente.
-   Las migraciones pueden ejecutarse sin errores.
-   La implementación queda documentada.
-   El cambio puede entregarse mediante un Pull Request independiente.

## Out of Scope

-   No implementar estadísticas avanzadas.
-   No implementar gráficos históricos.
-   No implementar comparación entre certificaciones.
-   No crear dashboards de progreso.
-   No implementar recomendaciones de estudio.
-   No implementar exportación de resultados.
-   No generar certificados.
-   No compartir resultados en redes sociales.
-   No implementar ranking.
-   No crear filtros visuales avanzados en el historial.
-   No implementar eliminación de resultados.
-   No modificar la lógica de corrección.
-   No modificar el cálculo de puntaje.
-   No crear nuevas certificaciones.
-   No implementar versiones históricas avanzadas de exámenes.
-   No rediseñar completamente la página de resultados fuera de los
    ajustes necesarios.
