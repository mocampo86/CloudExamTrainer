# US-027 - Crear modelo de opciones de respuesta

## Descripción

Como administrador de contenido, quiero almacenar las opciones de respuesta de cada pregunta para soportar selección única y múltiple.

## Objetivo

Crear `AnswerOption` y las reglas que determinan cuántas opciones correctas admite cada tipo de pregunta.

## Acceptance Criteria

### Entidad AnswerOption

- Se crea `AnswerOption`.
- Incluye Id, QuestionId, Text, IsCorrect y DisplayOrder.
- Text es obligatorio y no puede contener solo espacios.
- DisplayOrder no admite valores negativos.
- Cada opción pertenece a una pregunta.
- Una pregunta posee dos o más opciones.

### Reglas por tipo

- SingleChoice posee exactamente una opción correcta.
- MultipleChoice posee al menos dos opciones correctas.
- MultipleChoice debe tener al menos una opción incorrecta.
- Las opciones con IsCorrect son la fuente de verdad.
- No se utiliza una letra o índice como única respuesta correcta.

### Duplicados y orden

- No se permiten opciones equivalentes dentro de una pregunta.
- La comparación ignora espacios iniciales y finales.
- DisplayOrder controla la presentación.
- El identificador no determina el orden visual.
- Se evita repetir DisplayOrder dentro de la misma pregunta.

### Persistencia

- Se configura Question uno-a-muchos AnswerOption.
- Se crea índice por QuestionId.
- No se permiten opciones huérfanas.
- Eliminar una pregunta elimina sus opciones cuando corresponda.

### Pruebas y calidad

- Se prueba SingleChoice válido e inválido.
- Se prueba MultipleChoice válido e inválido.
- Se prueban opciones duplicadas y vacías.
- Se prueba el orden.
- La solución compila.
- Las reglas quedan centralizadas.

## Out of Scope

- No crear UI.
- No implementar aleatorización visual.
- No implementar respuestas abiertas.
- No implementar puntuación parcial.
- No implementar explicaciones por opción.
