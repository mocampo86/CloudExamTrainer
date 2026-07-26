---
id: 9
type: "User Story"
title: "US-009 - Navegar y finalizar el cuestionario"
state: "New"
epic: "01 - MVP inicial"
feature: "01.03 - Ejecución del cuestionario"
---

# US-009 - Navegar y finalizar el cuestionario

## Epic

01 - MVP inicial

## Feature

01.03 - Ejecución del cuestionario

## User Story

US-009 - Navegar y finalizar el cuestionario

## Objetivo

Como usuario, quiero avanzar y retroceder entre las preguntas y finalizar el cuestionario cuando haya terminado.

## Contexto

El usuario debe poder revisar sus respuestas antes de finalizar.

Si existen preguntas sin responder, la aplicación debe advertirlo y solicitar confirmación.

Al finalizar, debe generarse la información necesaria para que la siguiente feature calcule y muestre los resultados.

## Acceptance Criteria

- Existe un botón Anterior.
- El botón Anterior está deshabilitado en la primera pregunta.
- Existe un botón Siguiente.
- El botón Siguiente avanza a la pregunta posterior.
- En la última pregunta se muestra una acción Finalizar.
- Se conserva la respuesta seleccionada al navegar.
- Se detecta cuántas preguntas no fueron respondidas.
- Si todas están respondidas, el cuestionario puede finalizar directamente.
- Si existen preguntas sin responder, se muestra una confirmación.
- La confirmación informa la cantidad de preguntas pendientes.
- El usuario puede cancelar y continuar respondiendo.
- El usuario puede confirmar y finalizar.
- Al finalizar, la sesión cambia a estado completado.
- Se registra la fecha u hora de finalización.
- Se genera un objeto con:
  - Preguntas utilizadas.
  - Respuestas seleccionadas.
  - Tema.
  - Fecha de inicio.
  - Fecha de finalización.
- Se redirige a la página de resultados.
- La información del intento queda disponible para la siguiente feature.
- Existen pruebas de navegación y finalización.

## Out of Scope

- No calcular puntaje.
- No clasificar temas.
- No mostrar recomendaciones.
- No mostrar respuestas correctas.
- No mostrar explicaciones.
- No guardar el intento en LocalStorage.
- No implementar confirmaciones personalizadas complejas.
- No implementar temporizador.

## Dependencias

- US-008 completada.

## Tasks

1. Implementar acción Anterior.
2. Implementar acción Siguiente.
3. Controlar los límites de navegación.
4. Mostrar acción Finalizar en la última pregunta.
5. Detectar preguntas sin responder.
6. Crear confirmación de finalización.
7. Permitir cancelar la finalización.
8. Permitir confirmar la finalización.
9. Actualizar estado de la sesión.
10. Registrar fecha de finalización.
11. Crear el objeto de intento.
12. Redirigir a `/results`.
13. Manejar navegación sin sesión activa.
14. Agregar pruebas para navegación.
15. Agregar pruebas para preguntas pendientes.
16. Agregar pruebas para finalización completa.
17. Ejecutar validación, lint, tests y build.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- La navegación anterior y siguiente funciona.
- Las respuestas se conservan.
- Las preguntas pendientes se detectan.
- La confirmación funciona.
- El intento queda disponible para resultados.
- Existen pruebas para navegación y finalización.
- `npm run validate:questions` finaliza correctamente.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.

## Prompt IA

Implementar la User Story `US-009 - Navegar y finalizar el cuestionario` dentro de la Feature `01.03 - Ejecución del cuestionario`.

Leer primero `AGENTS.md`.

Implementar navegación, detección de preguntas pendientes, confirmación y finalización.

No implementar scoring, resultados por tema, explicaciones, recomendaciones ni persistencia.

Al finalizar ejecutar:

- `npm run validate:questions`
- `npm run lint`
- `npm run test`
- `npm run build`

Entregar resumen, archivos modificados, Acceptance Criteria cubiertos, pruebas ejecutadas y cualquier limitación.
