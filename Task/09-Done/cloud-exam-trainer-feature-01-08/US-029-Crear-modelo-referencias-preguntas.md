# US-029 - Crear modelo de referencias de preguntas

## Descripción

Como usuario que estudia una certificación, quiero que las preguntas puedan incluir referencias para consultar documentación confiable relacionada con la explicación.

## Objetivo

Crear el modelo de referencias asociado a preguntas, preparado para documentación oficial, whitepapers y otros recursos autorizados.

## Acceptance Criteria

### Entidad QuestionReference

- Se crea `QuestionReference`.
- Incluye Id, QuestionId, Title, Url, ReferenceType y DisplayOrder.
- Title y Url son obligatorios.
- Url debe tener un formato válido.
- DisplayOrder no admite valores negativos.
- Cada referencia pertenece a una pregunta.
- Una pregunta puede tener múltiples referencias.

### Tipos y seguridad

- Se define una clasificación extensible.
- Como mínimo contempla OfficialDocumentation, Whitepaper y Other.
- No se acopla únicamente a AWS.
- Solo se admiten esquemas URL permitidos.
- No se permite `javascript:` u otros esquemas peligrosos.
- No se almacena contenido completo de sitios externos.

### Persistencia

- Se configura la relación con Question.
- Se crea índice por QuestionId.
- No se permiten referencias huérfanas.
- Se define comportamiento de borrado.
- Se definen longitudes máximas.

### Pruebas y calidad

- Se crea una referencia válida.
- Se rechaza una URL inválida.
- Se rechazan esquemas peligrosos.
- Se prueban múltiples referencias.
- Se prueba el orden.
- La solución compila.
- La validación queda centralizada.

## Out of Scope

- No comprobar disponibilidad HTTP.
- No descargar documentación.
- No almacenar PDFs.
- No crear vista visual.
- No integrar servicios externos.
