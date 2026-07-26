---
id: 3
type: "Feature"
title: "01.03 - Ejecución del cuestionario"
state: "New"
epic: "01 - MVP inicial"
---

# 01.03 - Ejecución del cuestionario

## Epic

01 - MVP inicial

## Feature

01.03 - Ejecución del cuestionario

## Objetivo

Implementar el flujo principal para que el usuario pueda seleccionar un tema, definir la cantidad de preguntas y completar un cuestionario de opción única o múltiple.

La feature debe utilizar las preguntas cargadas desde archivos JSON y registrar todas las respuestas del usuario para que puedan ser evaluadas en la feature de resultados.

## Acceptance Criteria

- Se muestran los temas disponibles.
- Se puede seleccionar un tema.
- Se puede elegir la cantidad de preguntas.
- No se permite solicitar más preguntas que las disponibles.
- Se crea una sesión de cuestionario.
- Se muestra una pregunta por vez.
- Se soportan preguntas de respuesta única.
- Se soportan preguntas de respuesta múltiple.
- Se conserva la selección al navegar entre preguntas.
- Se muestra el progreso del cuestionario.
- Se puede avanzar a la siguiente pregunta.
- Se puede volver a la pregunta anterior.
- Se puede finalizar el cuestionario.
- Se detectan preguntas sin responder.
- Se solicita confirmación antes de finalizar con preguntas sin responder.
- Se genera un objeto con las respuestas del usuario.
- La información queda disponible para la pantalla de resultados.
- Existen pruebas unitarias y de interacción.
- El proyecto compila sin errores.

## Out of Scope

- No calcular el puntaje final.
- No evaluar rendimiento por tema.
- No mostrar recomendaciones.
- No mostrar explicaciones de respuestas.
- No indicar respuestas correctas durante el cuestionario.
- No implementar temporizador.
- No implementar persistencia.
- No implementar modo examen avanzado.
- No implementar backend.
- No implementar autenticación.
- No implementar diseño visual final.

## Dependencias

- Feature 01.01 - Proyecto frontend base completada.
- Feature 01.02 - Modelo y carga de preguntas completada.

## Definition of Done

- Todas las User Stories asociadas están completadas.
- El usuario puede configurar e iniciar un cuestionario.
- El usuario puede responder preguntas simples y múltiples.
- La navegación conserva las respuestas seleccionadas.
- El flujo permite finalizar el cuestionario.
- Las respuestas quedan disponibles para la siguiente feature.
- `npm run validate:questions` finaliza correctamente.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.
- No existen errores en la consola.
- No se agregó lógica de scoring fuera del alcance.

## User Stories

- US-007 - Configurar un cuestionario.
- US-008 - Mostrar preguntas y registrar respuestas.
- US-009 - Navegar y finalizar el cuestionario.
