# Cloud Exam Trainer AI Kit

Este kit define cómo deben trabajar los agentes de IA dentro del proyecto Cloud Exam Trainer.

## Objetivos

- Procesar historias de usuario de manera repetible.
- Mantener consistencia arquitectónica.
- Evitar cambios fuera de alcance.
- Exigir pruebas y validaciones antes de cerrar una tarea.
- Estandarizar revisiones de código.
- Mantener trazabilidad entre historia, código, pruebas y documentación.

## Estructura

- `context/`: contexto estable del proyecto.
- `agents/`: instrucciones por rol.
- `workflows/`: procesos ejecutables por agentes.
- `prompts/`: prompts reutilizables.
- `templates/`: formatos de entrada y salida.
- `checklists/`: criterios de control.

## Uso recomendado

1. El agente lee `context/project-context.md` y `context/architecture-rules.md`.
2. Selecciona un workflow según la tarea.
3. Usa el prompt correspondiente.
4. Produce la salida utilizando las plantillas del kit.
5. Ejecuta el checklist de cierre.
6. No marca la tarea como completada si existen verificaciones pendientes.

## Principio principal

El agente no debe interpretar una historia como permiso para rediseñar el producto. Debe implementar solamente lo solicitado, respetando el código existente, las restricciones arquitectónicas y el alcance definido.
