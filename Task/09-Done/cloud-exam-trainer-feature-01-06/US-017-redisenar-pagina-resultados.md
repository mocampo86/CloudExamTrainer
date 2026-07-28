# US-017 - Rediseñar página de resultados

## Descripción

Como usuario de **Cloud Exam Trainer**, quiero visualizar los resultados
de un cuestionario mediante una interfaz moderna, clara y fácil de
interpretar, para comprender rápidamente mi desempeño e identificar las
áreas en las que debo mejorar.

## Objetivo

Rediseñar completamente la página de resultados manteniendo la lógica de
negocio existente, mejorando la presentación visual de la información,
la experiencia de usuario y la organización de los datos.

## Acceptance Criteria

### Encabezado

-   Se muestra un título principal indicando que el cuestionario ha
    finalizado.
-   Se muestra un mensaje de felicitación o incentivo dependiendo del
    resultado obtenido.
-   El encabezado mantiene una jerarquía visual clara.
-   El contenido se encuentra centrado dentro del ancho máximo definido
    por la aplicación.

### Resumen del resultado

Se muestra una tarjeta resumen con:

-   Puntaje obtenido.
-   Cantidad de respuestas correctas.
-   Cantidad de respuestas incorrectas.
-   Porcentaje de aprobación.
-   Tiempo total utilizado (si está disponible).
-   Tema del cuestionario.
-   Cantidad total de preguntas.

### Indicadores visuales

-   El porcentaje obtenido posee una representación visual destacada.
-   Se utilizan colores consistentes para respuestas correctas,
    incorrectas y resultado general.
-   No se depende únicamente del color para comunicar el resultado.

### Detalle de respuestas

Cada pregunta muestra:

-   Número de pregunta.
-   Enunciado.
-   Respuesta seleccionada.
-   Respuesta correcta.
-   Estado (Correcta o Incorrecta).
-   Explicación (si existe).

Cada pregunta se presenta dentro de una card independiente.

### Navegación

La página incluye acciones para:

-   Volver al inicio.
-   Realizar un nuevo cuestionario.
-   Consultar el historial (si existe).

### Diseño visual

-   Cards modernas.
-   Identidad visual consistente.
-   Espaciados uniformes.
-   Componentes reutilizables.
-   Sin controles HTML con apariencia por defecto.

### Responsive

-   Desktop.
-   Tablet.
-   Mobile.
-   Sin scroll horizontal.

### Accesibilidad

-   Navegación por teclado.
-   Focus visible.
-   Contraste adecuado.

### Calidad técnica

-   No modificar la lógica de negocio.
-   No modificar endpoints.
-   No modificar el modelo de datos.
-   Compila sin errores.

## Out of Scope

-   No modificar la lógica de corrección.
-   No implementar estadísticas avanzadas.
-   No agregar gráficos históricos.
-   No implementar comparativas entre intentos.
-   No agregar exportación de resultados.
-   No implementar certificados.
-   No agregar ranking de usuarios.
-   No modificar el almacenamiento de resultados.
-   No implementar compartir resultados en redes sociales.
