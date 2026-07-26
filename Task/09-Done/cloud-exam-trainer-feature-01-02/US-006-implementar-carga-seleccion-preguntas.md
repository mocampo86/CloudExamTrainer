---
id: 6
type: "User Story"
title: "US-006 - Implementar carga y selección de preguntas"
state: "New"
epic: "01 - MVP inicial"
feature: "01.02 - Modelo y carga de preguntas"
---

# US-006 - Implementar carga y selección de preguntas

## Epic

01 - MVP inicial

## Feature

01.02 - Modelo y carga de preguntas

## User Story

US-006 - Implementar carga y selección de preguntas

## Objetivo

Como desarrollador, quiero cargar preguntas desde archivos JSON locales y seleccionar preguntas por tema para preparar los datos que utilizará el cuestionario.

## Contexto

La aplicación no tendrá backend ni base de datos.

Los archivos JSON locales serán la única fuente de preguntas durante el MVP.

El servicio debe mantener la lógica de carga y selección separada de los componentes visuales.

## Acceptance Criteria

- Se crea un servicio para cargar preguntas.
- El servicio carga preguntas desde archivos JSON locales.
- Los datos se validan antes de ser devueltos.
- Se pueden obtener todas las preguntas.
- Se pueden obtener preguntas por tema.
- Se puede solicitar una cantidad específica.
- La cantidad solicitada no puede superar la cantidad disponible.
- Se pueden seleccionar preguntas aleatorias.
- No se devuelven preguntas duplicadas.
- La selección aleatoria no modifica el array original.
- Se manejan errores de carga y validación.
- Se agregan al menos archivos JSON iniciales para:
  - Security.
  - Networking.
  - Compute.
  - Storage.
  - Databases.
- Los archivos pueden contener contenido de prueba mínimo.
- Existen pruebas unitarias.
- El proyecto compila sin errores.

## Out of Scope

- No crear interfaz para seleccionar temas.
- No mostrar preguntas.
- No registrar respuestas.
- No calcular resultados.
- No guardar progreso.
- No consumir una API.
- No importar archivos desde el navegador.
- No implementar una estrategia avanzada de aleatorización.

## Dependencias

- US-004 completada.
- US-005 completada.

## Tasks

1. Crear `src/services/questionService.ts`.
2. Crear archivos JSON por tema.
3. Implementar carga de preguntas.
4. Validar datos mediante el esquema existente.
5. Implementar `getAllQuestions`.
6. Implementar `getQuestionsByTopic`.
7. Implementar selección por cantidad.
8. Implementar selección aleatoria sin duplicados.
9. Evitar mutar arrays originales.
10. Manejar errores con mensajes claros.
11. Crear pruebas para:
    - Carga correcta.
    - Filtro por tema.
    - Cantidad válida.
    - Cantidad superior a la disponible.
    - Selección sin duplicados.
    - Datos inválidos.
12. Ejecutar validación, lint, tests y build.
13. Documentar cómo agregar nuevas preguntas.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- Las preguntas se cargan correctamente.
- El filtro por tema funciona.
- La selección aleatoria no duplica preguntas.
- Los datos se validan antes de utilizarse.
- Existen pruebas para casos exitosos y errores.
- `npm run validate:questions` finaliza correctamente.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.

## Prompt IA

Implementar la User Story `US-006 - Implementar carga y selección de preguntas` dentro de la Feature `01.02 - Modelo y carga de preguntas`.

Leer primero `AGENTS.md`.

La solución debe utilizar archivos JSON locales, sin backend, base de datos, autenticación ni servicios externos.

Mantener el servicio simple y desacoplado de React.

No implementar componentes visuales, scoring ni persistencia.

Al finalizar ejecutar:

- `npm run validate:questions`
- `npm run lint`
- `npm run test`
- `npm run build`

Entregar resumen, archivos modificados, pruebas ejecutadas, Acceptance Criteria cubiertos y decisiones técnicas.
