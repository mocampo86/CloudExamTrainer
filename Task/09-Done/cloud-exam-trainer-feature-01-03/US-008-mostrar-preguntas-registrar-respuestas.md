---
id: 8
type: "User Story"
title: "US-008 - Mostrar preguntas y registrar respuestas"
state: "New"
epic: "01 - MVP inicial"
feature: "01.03 - Ejecución del cuestionario"
---

# US-008 - Mostrar preguntas y registrar respuestas

## Epic

01 - MVP inicial

## Feature

01.03 - Ejecución del cuestionario

## User Story

US-008 - Mostrar preguntas y registrar respuestas

## Objetivo

Como usuario, quiero visualizar las preguntas y seleccionar mis respuestas para completar el cuestionario.

## Contexto

La aplicación debe mostrar una pregunta por vez.

Las preguntas de respuesta única deben utilizar controles de selección única y las preguntas múltiples deben permitir seleccionar más de una opción.

Las respuestas deben almacenarse en la sesión del cuestionario, pero todavía no deben evaluarse.

## Acceptance Criteria

- Se crea un componente `QuestionCard`.
- Se crea un componente `AnswerOption`.
- Se muestra una pregunta por vez.
- Se muestra el enunciado.
- Se muestran todas las opciones disponibles.
- Las preguntas `single_choice` utilizan radio buttons.
- Las preguntas `multiple_choice` utilizan checkboxes.
- Se puede seleccionar una respuesta en preguntas simples.
- Se pueden seleccionar varias respuestas en preguntas múltiples.
- La selección se registra en la sesión.
- Cambiar la respuesta actual actualiza la sesión.
- La respuesta se conserva al volver a la pregunta.
- Se muestra:
  - Número de pregunta actual.
  - Total de preguntas.
- Se muestra una barra o indicador de progreso.
- No se revela la respuesta correcta.
- No se muestra explicación.
- Existen pruebas de interacción para preguntas simples y múltiples.

## Out of Scope

- No implementar scoring.
- No mostrar feedback.
- No bloquear una respuesta luego de seleccionarla.
- No finalizar el cuestionario.
- No persistir respuestas.
- No implementar favoritos.
- No implementar preguntas marcadas para revisión.
- No implementar temporizador.
- No implementar diseño visual final.

## Dependencias

- US-007 completada.

## Tasks

1. Crear `QuestionCard`.
2. Crear `AnswerOption`.
3. Crear modelo `QuizAnswer`.
4. Implementar selección única.
5. Implementar selección múltiple.
6. Registrar respuestas en `QuizSession`.
7. Actualizar respuestas existentes.
8. Mostrar pregunta actual y total.
9. Crear indicador de progreso.
10. Mantener la selección al cambiar de pregunta.
11. Manejar sesión inexistente.
12. Agregar pruebas para `single_choice`.
13. Agregar pruebas para `multiple_choice`.
14. Agregar pruebas de conservación de respuestas.
15. Ejecutar validación, lint, tests y build.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- Las preguntas simples funcionan.
- Las preguntas múltiples funcionan.
- Las respuestas quedan registradas.
- Las selecciones se conservan.
- No se revela información de corrección.
- Existen pruebas de interacción.
- `npm run validate:questions` finaliza correctamente.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.

## Prompt IA

Implementar la User Story `US-008 - Mostrar preguntas y registrar respuestas` dentro de la Feature `01.03 - Ejecución del cuestionario`.

Leer primero `AGENTS.md`.

Usar los modelos y servicios existentes.

Implementar preguntas simples y múltiples, registrando respuestas en la sesión.

No implementar scoring, explicaciones, recomendaciones, persistencia ni temporizador.

Al finalizar ejecutar:

- `npm run validate:questions`
- `npm run lint`
- `npm run test`
- `npm run build`

Entregar resumen, archivos modificados, Acceptance Criteria cubiertos, pruebas ejecutadas y riesgos.
