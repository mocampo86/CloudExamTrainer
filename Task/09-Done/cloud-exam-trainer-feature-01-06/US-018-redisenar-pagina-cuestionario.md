# US-018 - Rediseñar página de cuestionario

## Descripción

Como usuario de **Cloud Exam Trainer**, quiero responder las preguntas
en una interfaz moderna, clara y enfocada en la concentración, para
poder realizar el cuestionario de forma cómoda y sin distracciones.

## Objetivo

Rediseñar la página del cuestionario manteniendo la lógica de negocio
existente, mejorando la experiencia de usuario, la organización visual y
la accesibilidad.

## Acceptance Criteria

### Encabezado

-   Se muestra el nombre del tema seleccionado.
-   Se muestra el progreso del cuestionario (ej. Pregunta 5 de 20).
-   Se muestra el puntaje parcial si la lógica actual lo permite.
-   El encabezado permanece visualmente consistente con el resto de la
    aplicación.

### Contenido de la pregunta

-   La pregunta se presenta dentro de una card moderna.
-   El enunciado tiene jerarquía visual clara.
-   El contenido es fácilmente legible.
-   Se respetan los espacios entre secciones.

### Opciones de respuesta

-   Las respuestas se presentan como opciones modernas y fáciles de
    seleccionar.
-   Cada opción posee estados Hover, Focus, Active y Selected.
-   La opción seleccionada se diferencia claramente.
-   No se utilizan controles HTML con apariencia por defecto.
-   Se mantiene la lógica actual de selección.

### Navegación

-   Se mantiene el flujo existente para responder preguntas.
-   Los botones de acción utilizan el estilo visual definido por la
    aplicación.
-   El usuario identifica claramente la acción principal.

### Diseño visual

-   Se utilizan componentes reutilizables.
-   Espaciados consistentes.
-   Tipografía moderna.
-   Colores alineados con la identidad visual.
-   Iconografía consistente cuando corresponda.

### Responsive

-   Compatible con Desktop, Tablet y Mobile.
-   No existe scroll horizontal.
-   Los controles mantienen un tamaño adecuado para dispositivos
    táctiles.

### Accesibilidad

-   Navegación mediante teclado.
-   Focus visible.
-   Contraste adecuado.
-   Labels y elementos interactivos correctamente asociados.

### Calidad técnica

-   No se modifica la lógica del cuestionario.
-   No se modifican endpoints.
-   No se altera el modelo de datos.
-   No cambia el algoritmo de validación de respuestas.
-   La aplicación continúa compilando correctamente.

## Out of Scope

-   No modificar el banco de preguntas.
-   No implementar temporizador.
-   No agregar modo examen.
-   No agregar ayudas o pistas.
-   No implementar revisión de respuestas durante el cuestionario.
-   No modificar la lógica de puntuación.
-   No agregar sonidos o animaciones complejas.
-   No implementar nuevas funcionalidades de negocio.
