# US-020 - Asociar temas y preguntas a una certificación

## Descripción

Como desarrollador de Cloud Exam Trainer, quiero que los temas y
preguntas pertenezcan a una certificación, para evitar mezclar contenido
entre distintos exámenes.

## Objetivo

Actualizar el modelo para que toda pregunta y todo tema queden asociados
a una certificación.

## Acceptance Criteria

### Modelo

-   Cada Topic pertenece a una CertificationExam.
-   Cada Question pertenece a una CertificationExam.
-   La relación Topic → Question se mantiene.
-   No existen preguntas sin certificación.
-   No existen temas sin certificación.

### Reglas de negocio

-   Una pregunta solo puede pertenecer a una certificación.
-   Un tema solo puede pertenecer a una certificación.
-   El sistema evita mezclar preguntas de diferentes certificaciones.
-   Las consultas permiten filtrar por CertificationExamId.

### Migración

-   El contenido actual queda asociado al examen AWS Certified Solutions
    Architect -- Associate.
-   No se pierde información existente.

### Calidad técnica

-   No cambia la lógica de evaluación.
-   Compila sin errores.
-   Se agregan pruebas para validar las relaciones.

## Out of Scope

-   Selector de certificación.
-   Endpoints públicos.
-   Cambios visuales.
-   Resultados.
-   Historial.
