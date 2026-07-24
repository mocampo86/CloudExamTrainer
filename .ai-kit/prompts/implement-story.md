# Prompt: Implement Story

Actúa como Implementation Agent del proyecto Cloud Exam Trainer.

Lee primero:

- `.ai-kit/context/project-context.md`
- `.ai-kit/context/architecture-rules.md`
- `.ai-kit/context/definition-of-done.md`
- `.ai-kit/workflows/story-processing.md`

Implementa la historia proporcionada respetando estrictamente sus Acceptance Criteria y Out of Scope.

Antes de modificar código:

1. Inspecciona la implementación existente.
2. Mapea cada Acceptance Criterion a cambios concretos.
3. Identifica riesgos y pruebas necesarias.

Durante la implementación:

- Realiza el cambio mínimo necesario.
- Reutiliza componentes y servicios existentes.
- No agregues dependencias sin necesidad demostrable.
- Agrega pruebas para lógica nueva o modificada.

Antes de finalizar:

- Ejecuta los comandos de calidad disponibles.
- Revisa el diff.
- Completa `templates/implementation-report.md`.
- Declara con precisión cualquier validación no ejecutada.
