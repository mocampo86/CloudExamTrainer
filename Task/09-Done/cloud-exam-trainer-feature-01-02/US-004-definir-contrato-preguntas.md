---
id: 4
type: "User Story"
title: "US-004 - Definir contrato de preguntas"
state: "Done"
epic: "01 - MVP inicial"
feature: "01.02 - Modelo y carga de preguntas"
---

# US-004 - Definir contrato de preguntas

## Epic

01 - MVP inicial

## Feature

01.02 - Modelo y carga de preguntas

## User Story

US-004 - Definir contrato de preguntas

## Objetivo

Como desarrollador, quiero definir un contrato TypeScript para las preguntas y sus opciones para mantener una estructura consistente entre el contenido JSON y la aplicación.

## Contexto

La aplicación utilizará archivos JSON locales como fuente de preguntas.

El contrato debe ser simple y suficiente para:

- Preguntas de respuesta única.
- Preguntas de respuesta múltiple.
- Clasificación por tema.
- Explicación de la respuesta.
- Evaluación posterior por tema.

## Acceptance Criteria

- Se crea el tipo `QuestionType`.
- `QuestionType` soporta:
  - `single_choice`
  - `multiple_choice`
- Se crea el tipo `QuestionDifficulty`.
- `QuestionDifficulty` soporta:
  - `easy`
  - `medium`
  - `hard`
- Se crea la interfaz `QuestionOption`.
- `QuestionOption` incluye:
  - `id`
  - `text`
- Se crea la interfaz `Question`.
- `Question` incluye:
  - `id`
  - `topic`
  - `difficulty`
  - `type`
  - `question`
  - `options`
  - `correctAnswers`
  - `explanation`
- El modelo no depende de React.
- Los nombres de propiedades coinciden con el formato JSON.
- Se documenta el contrato.
- Se agrega al menos un ejemplo JSON válido.
- El proyecto compila sin errores.

## Out of Scope

- No crear validaciones Zod.
- No cargar archivos.
- No crear componentes visuales.
- No implementar scoring.
- No agregar referencias externas.
- No agregar campos que no sean necesarios para el MVP.

## Dependencias

- Feature 01.01 completada.

## Tasks

1. Crear `src/models/Question.ts`.
2. Definir `QuestionType`.
3. Definir `QuestionDifficulty`.
4. Definir `QuestionOption`.
5. Definir `Question`.
6. Crear documentación del formato en `docs/question-format.md`.
7. Crear un archivo JSON de ejemplo válido.
8. Verificar que los nombres coincidan entre TypeScript y JSON.
9. Ejecutar lint, tests y build.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- El contrato está documentado.
- Existe un ejemplo JSON válido.
- El modelo no tiene dependencias de UI.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.

## Prompt IA

Implementar la User Story `US-004 - Definir contrato de preguntas` dentro de la Feature `01.02 - Modelo y carga de preguntas`.

Leer primero `AGENTS.md`.

Crear únicamente los tipos y la documentación necesarios para el MVP.

No agregar campos extra, validación Zod, lógica de carga, scoring, componentes visuales ni abstracciones innecesarias.

Al finalizar ejecutar:

- `npm run lint`
- `npm run test`
- `npm run build`

Entregar resumen de cambios, archivos modificados y Acceptance Criteria cubiertos.
