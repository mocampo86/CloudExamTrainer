# US-019 - Crear modelo base de certificaciones y exámenes

## Descripción

Como desarrollador de Cloud Exam Trainer, quiero disponer de un modelo
base para representar proveedores y certificaciones, para que la
plataforma pueda soportar múltiples exámenes sin depender de una
implementación específica.

## Objetivo

Crear el modelo de dominio que represente proveedores y certificaciones,
dejando preparada la aplicación para soportar nuevos exámenes en el
futuro.

## Acceptance Criteria

### Modelo

-   Se define una entidad CertificationExam.
-   Se define una entidad Provider.
-   CertificationExam incluye como mínimo:
    -   Id
    -   ProviderId
    -   Code
    -   Name
    -   Description
    -   Version
    -   Difficulty
    -   IsActive
    -   ImageUrl
-   Provider incluye:
    -   Id
    -   Name
    -   Logo
    -   Color
-   El código del examen es único.
-   La relación Provider → CertificationExam es uno a muchos.

### Arquitectura

-   El modelo no está acoplado a AWS.
-   Permite agregar nuevos proveedores.
-   Permite agregar nuevas certificaciones sin modificar el modelo.
-   Se documentan las entidades creadas.

### Calidad técnica

-   Compila sin errores.
-   Se agregan pruebas del modelo cuando corresponda.
-   No se rompe la funcionalidad existente.

## Out of Scope

-   Persistencia.
-   Migraciones.
-   Endpoints.
-   UI.
-   Asociación con preguntas.
-   Asociación con temas.
