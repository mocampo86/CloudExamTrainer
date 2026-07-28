# Feature 03 - Gestión base de certificaciones y exámenes

## Objetivo

Incorporar una arquitectura base que permita administrar múltiples
certificaciones y exámenes dentro de **Cloud Exam Trainer**,
desacoplando la aplicación de una certificación específica y dejando
preparada la plataforma para soportar nuevas certificaciones Cloud y de
otros proveedores sin requerir cambios significativos en la
arquitectura.

Inicialmente el sistema contará únicamente con **AWS Certified Solutions
Architect -- Associate**, pero la solución deberá permitir incorporar
nuevos exámenes mediante configuración y datos persistidos, evitando
lógica hardcodeada en el frontend o backend.

Esta feature establece el modelo funcional sobre el cual se apoyarán
futuras funcionalidades como bancos de preguntas, simulacros,
estadísticas, historial y progresos individuales por certificación.

## Descripción

Actualmente la aplicación asume que existe un único examen.

A partir de esta feature, el examen pasará a ser el contexto principal
de toda la plataforma.

Cada certificación dispondrá de:

-   Su propio conjunto de temas.
-   Su propio banco de preguntas.
-   Sus propios cuestionarios.
-   Sus propios resultados.
-   Futuras rutas de aprendizaje independientes.

La incorporación de una nueva certificación no deberá requerir crear
nuevos componentes ni modificar la lógica principal de la aplicación.

## Acceptance Criteria

### Arquitectura

-   La solución deja de depender de una única certificación.
-   La arquitectura queda preparada para soportar múltiples
    certificaciones.
-   La implementación sigue principios de separación de
    responsabilidades.
-   La solución permite agregar nuevas certificaciones sin duplicar
    lógica existente.
-   La arquitectura permite escalar a decenas de certificaciones.
-   No existen dependencias directas con AWS dentro de la lógica
    principal.
-   El modelo admite distintos proveedores tecnológicos.

### Modelo funcional

-   Se define un modelo funcional para representar Proveedor,
    Certificación, Temas, Preguntas, Cuestionarios y Resultados.
-   Las relaciones entre estas entidades quedan claramente definidas.

### Gestión de certificaciones

Cada certificación podrá definir como mínimo:

-   Identificador.
-   Código.
-   Nombre.
-   Descripción.
-   Proveedor.
-   Estado.
-   Imagen o logo.
-   Nivel de dificultad.
-   Versión (preparado para el futuro).

### Integración

-   Cada tema pertenece a una certificación.
-   Cada pregunta pertenece a una certificación.
-   Todo cuestionario mantiene la referencia a su certificación.
-   Todo resultado mantiene la referencia a la certificación realizada.
-   La solución evita mezclar datos de distintas certificaciones.

### API

La arquitectura queda preparada para exponer:

-   Certificaciones disponibles.
-   Temas por certificación.
-   Preguntas por certificación.
-   Resultados por certificación.

### Frontend

-   La interfaz queda preparada para incorporar un selector de
    certificaciones.
-   No existen componentes específicos por certificación.

### Persistencia

-   La información podrá mantenerse en almacenamiento persistente.
-   No existen listas hardcodeadas distribuidas por la aplicación.

### Escalabilidad

-   Agregar una nueva certificación no requiere duplicar componentes ni
    crear nuevas aplicaciones.

### Calidad técnica

-   La aplicación continúa compilando correctamente.
-   No se rompe el flujo actual.
-   No se modifica la lógica del cuestionario.
-   La solución queda documentada.

## Out of Scope

-   Crear migraciones.
-   Implementar endpoints.
-   Implementar el selector de certificaciones.
-   Asociar preguntas existentes.
-   Asociar temas existentes.
-   Modificar el cuestionario.
-   Modificar la pantalla de resultados.
-   Importar certificaciones oficiales.
-   Integrar APIs externas.
-   Crear panel administrativo.
-   Estadísticas por certificación.
-   Recomendaciones de estudio.
-   Gamificación.

## Dependencias

Esta feature será implementada mediante las siguientes User Stories:

-   US-019 -- Crear modelo base de certificaciones y exámenes.
-   US-020 -- Asociar temas y preguntas a una certificación.
-   US-021 -- Exponer certificaciones disponibles desde la API.
-   US-022 -- Incorporar selector de certificación en la página de
    inicio.
-   US-023 -- Filtrar cuestionarios por certificación seleccionada.
-   US-024 -- Asociar resultados a la certificación realizada.
