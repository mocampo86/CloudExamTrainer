# US-028 - Crear modelo de etiquetas para preguntas

## Descripción

Como administrador de contenido, quiero asignar múltiples etiquetas a una pregunta para clasificarla por servicios, patrones y conceptos transversales.

## Objetivo

Crear el modelo `Tag` y la relación many-to-many entre preguntas y etiquetas.

## Acceptance Criteria

### Entidad Tag

- Se crea `Tag`.
- Incluye Id, Name, Slug, Description e IsActive.
- Name y Slug son obligatorios.
- Slug es único y se almacena normalizado.
- El modelo no está limitado a servicios AWS.
- Se definen longitudes máximas.

### Relación con preguntas

- Una pregunta puede tener cero o más etiquetas.
- Una etiqueta puede pertenecer a cero o más preguntas.
- Se crea `QuestionTag` cuando la arquitectura lo recomienda.
- No se permiten relaciones duplicadas.
- Eliminar una relación no elimina la pregunta ni la etiqueta.
- Desactivar una etiqueta no elimina relaciones históricas.

### Consistencia

- No se permiten tags vacíos.
- No se permiten slugs equivalentes.
- Se define una política de mayúsculas y minúsculas.
- Los tags pueden reutilizarse entre certificaciones.
- La decisión de alcance global queda documentada.

### Persistencia

- Se crean claves primarias y foráneas.
- Se crea índice único por Slug.
- Se crea restricción única para QuestionId y TagId.
- Se define el comportamiento de borrado.

### Pruebas y calidad

- Se crea una etiqueta válida.
- Se rechaza un slug duplicado.
- Se asocian múltiples etiquetas a una pregunta.
- Una etiqueta se asocia a múltiples preguntas.
- Se rechaza una relación duplicada.
- La solución compila.
- No se agregan enums cerrados para etiquetas.

## Out of Scope

- No crear CRUD de etiquetas.
- No crear filtros visuales.
- No implementar sugerencias automáticas.
- No implementar jerarquías.
- No implementar traducciones.
