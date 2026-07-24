# AGENTS.md

Todos los agentes que trabajen en este repositorio deben leer `.ai-kit/README.md` antes de modificar archivos.

## Contexto obligatorio

- `.ai-kit/context/project-context.md`
- `.ai-kit/context/architecture-rules.md`
- `.ai-kit/context/definition-of-done.md`

## Selección de workflow

- Implementación de historia: `.ai-kit/workflows/story-processing.md`
- Revisión de código: `.ai-kit/workflows/code-review.md`
- Importación de preguntas: `.ai-kit/workflows/question-import.md`

## Reglas críticas

- No agregar backend, autenticación o base de datos sin historia explícita.
- No introducir dependencias sin justificación.
- No marcar tareas como completadas con pruebas o build fallidos.
- No afirmar que se ejecutó una validación que no fue ejecutada.
- No modificar contenido fuera del alcance de la historia.
