---
id: 7
type: "User Story"
title: "US-007 - Configurar un cuestionario"
state: "New"
epic: "01 - MVP inicial"
feature: "01.03 - Ejecución del cuestionario"
---

# US-007 - Configurar un cuestionario

## Epic

01 - MVP inicial

## Feature

01.03 - Ejecución del cuestionario

## User Story

US-007 - Configurar un cuestionario

## Objetivo

Como usuario, quiero seleccionar un tema y la cantidad de preguntas para iniciar un cuestionario adaptado a lo que deseo practicar.

## Contexto

Los temas disponibles deben obtenerse a partir de las preguntas cargadas desde los archivos JSON.

La configuración debe ser simple y permitir iniciar una sesión válida sin superar la cantidad de preguntas disponibles.

## Acceptance Criteria

- Se crea una página o sección para configurar el cuestionario.
- Se muestran los temas disponibles.
- Los temas se obtienen a partir de las preguntas cargadas.
- Se puede seleccionar un único tema.
- Se muestra la cantidad de preguntas disponibles para el tema seleccionado.
- Se puede elegir la cantidad de preguntas.
- Se ofrecen valores razonables como:
  - 5
  - 10
  - 20
- No se puede elegir una cantidad superior a la disponible.
- Si hay menos preguntas que una opción predefinida, esa opción no se muestra o queda deshabilitada.
- Se valida que exista un tema seleccionado.
- Se valida que exista una cantidad válida.
- Se crea un modelo `QuizSession`.
- La sesión incluye:
  - ID.
  - Tema.
  - IDs de preguntas.
  - Índice de pregunta actual.
  - Respuestas.
  - Estado.
- Al iniciar, se seleccionan las preguntas mediante el servicio existente.
- Se redirige al cuestionario.
- Existen pruebas para configuraciones válidas e inválidas.

## Out of Scope

- No mostrar preguntas en esta historia.
- No registrar respuestas.
- No calcular resultados.
- No guardar sesiones en LocalStorage.
- No permitir seleccionar varios temas.
- No agregar dificultad como filtro.
- No implementar temporizador.
- No implementar diseño visual final.

## Dependencias

- US-006 completada.

## Tasks

1. Crear el modelo `QuizSession`.
2. Crear el modelo de configuración del cuestionario.
3. Crear `QuizSetupPage` o adaptar la página inicial.
4. Obtener los temas disponibles desde `questionService`.
5. Mostrar la cantidad de preguntas por tema.
6. Crear selector de tema.
7. Crear selector de cantidad.
8. Validar selección y cantidad.
9. Utilizar el servicio para seleccionar preguntas.
10. Crear una sesión de cuestionario.
11. Redirigir a la ruta del cuestionario.
12. Manejar el caso de tema sin preguntas.
13. Agregar pruebas de interacción.
14. Ejecutar validación, lint, tests y build.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- Se puede seleccionar un tema válido.
- Se puede elegir una cantidad válida.
- No se permite superar la disponibilidad.
- Se crea una sesión correcta.
- La navegación al cuestionario funciona.
- Existen pruebas para los casos principales.
- `npm run validate:questions` finaliza correctamente.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.

## Prompt IA

Implementar la User Story `US-007 - Configurar un cuestionario` dentro de la Feature `01.03 - Ejecución del cuestionario`.

Leer primero `AGENTS.md`.

Utilizar el servicio de preguntas existente.

Implementar únicamente configuración y creación de sesión.

No mostrar todavía preguntas, no registrar respuestas, no calcular resultados y no agregar persistencia.

Al finalizar ejecutar:

- `npm run validate:questions`
- `npm run lint`
- `npm run test`
- `npm run build`

Entregar resumen, archivos modificados, Acceptance Criteria cubiertos, pruebas ejecutadas y decisiones técnicas.
