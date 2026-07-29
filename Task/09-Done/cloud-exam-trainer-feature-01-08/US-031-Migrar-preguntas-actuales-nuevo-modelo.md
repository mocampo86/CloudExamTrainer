# US-031 - Migrar las preguntas actuales al nuevo modelo

## Descripción

Como usuario de Cloud Exam Trainer, quiero conservar las preguntas existentes al adoptar el nuevo banco de preguntas para continuar utilizando la aplicación sin pérdida de contenido.

## Objetivo

Migrar preguntas, respuestas y temas actuales al nuevo modelo, asociándolos a **AWS Certified Solutions Architect – Associate**.

## Acceptance Criteria

### Preparación

- Se identifica y documenta la fuente actual.
- Se cuantifica la cantidad de preguntas.
- Se detectan preguntas sin tema.
- Se detectan respuestas inválidas.
- Se detectan preguntas sin respuesta correcta.
- Se detectan duplicados evidentes.
- Se genera respaldo cuando corresponda.

### Certificación destino

- Todas las preguntas se asocian a AWS Certified Solutions Architect – Associate.
- Se utiliza el identificador persistido.
- No se hardcodea un identificador dependiente del ambiente.
- La certificación debe existir antes de migrar.
- Una ausencia falla de forma controlada o utiliza seed documentado.

### Preguntas y respuestas

- Se conserva el enunciado y la explicación.
- Se conserva el tema existente.
- Se asigna el tipo de pregunta correcto.
- Se asigna dificultad solo cuando puede inferirse.
- Se migran todas las opciones.
- Se conserva cuál o cuáles son correctas.
- Se conserva el orden.
- Los datos inválidos no se publican automáticamente.
- Se registran transformaciones.

### Dominios y temas

- Los temas existentes se mantienen.
- Se asocian a la certificación correcta.
- Los dominios se asignan solo con información confiable.
- No se inventan asociaciones.
- Las preguntas sin dominio continúan siendo válidas si el modelo lo permite.

### Validación posterior

- La cantidad de preguntas antes y después coincide salvo exclusiones documentadas.
- La cantidad de opciones coincide.
- La cantidad de respuestas correctas se conserva.
- No quedan preguntas ni opciones huérfanas.
- Todas las preguntas tienen CertificationExamId.
- Se genera un reporte con migradas, omitidas, inválidas y duplicadas.

### Compatibilidad y reejecución

- Los cuestionarios actuales continúan funcionando.
- La lógica de corrección conserva el resultado esperado.
- No se pierde historial.
- El proceso es idempotente o se documenta como ejecución única.
- Una falla no deja datos parcialmente inconsistentes.
- Se utiliza una transacción cuando sea viable.

### Pruebas y calidad

- Se prueba una muestra representativa.
- Se prueba SingleChoice y MultipleChoice.
- Se prueban preguntas con y sin explicación o tema.
- Se prueban datos inválidos.
- Se verifica la corrección después de migrar.
- La solución compila.
- El procedimiento queda documentado.

## Out of Scope

- No corregir editorialmente todas las preguntas.
- No traducir contenido.
- No generar explicaciones faltantes.
- No asignar dificultad manualmente.
- No implementar detección semántica.
- No importar preguntas nuevas.
- No crear UI administrativa.
