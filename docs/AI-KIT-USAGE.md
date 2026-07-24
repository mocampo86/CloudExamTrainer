# Uso del AI Kit con Devin

## Implementar una historia

Proporcionar a Devin:

1. La historia completa.
2. La ruta `.ai-kit/prompts/implement-story.md`.
3. La rama de trabajo esperada.
4. La instrucción de entregar el reporte usando `.ai-kit/templates/implementation-report.md`.

Ejemplo:

```text
Implementa US-008 siguiendo `.ai-kit/prompts/implement-story.md`.
Trabaja únicamente en el alcance de la historia.
Antes de finalizar ejecuta el workflow de verificación y entrega el Implementation Report.
```

## Revisar código

```text
Revisa esta rama contra US-008 siguiendo `.ai-kit/prompts/review-code.md`.
No modifiques código. Entrega findings por severidad y utiliza `.ai-kit/templates/code-review-report.md`.
```

## Refinar una historia

```text
Refina esta historia siguiendo `.ai-kit/prompts/refine-story.md`.
Déjala lista para implementación autónoma por Devin.
```

## Revisar preguntas JSON

```text
Revisa estos archivos siguiendo `.ai-kit/prompts/review-questions.md`.
No importes preguntas rechazadas. Entrega el reporte de contenido.
```
