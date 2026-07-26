---
id: 3
type: "User Story"
title: "US-003 - Configurar navegación y páginas placeholder"
state: "New"
epic: "01 - MVP inicial"
feature: "01.01 - Proyecto frontend base"
---

# US-003 - Configurar navegación y páginas placeholder

## Epic

01 - MVP inicial

## Feature

01.01 - Proyecto frontend base

## User Story

US-003 - Configurar navegación y páginas placeholder

## Objetivo

Como usuario, quiero navegar entre las pantallas principales de la aplicación para disponer de la estructura base del flujo de cuestionario.

## Contexto

En esta historia solo se implementará navegación y contenido placeholder. La lógica real de preguntas, respuestas y resultados se implementará en features posteriores.

## Acceptance Criteria

- Se instala y configura React Router.
- Se crea un router centralizado.
- Se configuran las rutas:
  - `/`
  - `/quiz`
  - `/results`
- Se crea una página de inicio placeholder.
- Se crea una página de cuestionario placeholder.
- Se crea una página de resultados placeholder.
- Se crea una página Not Found.
- Existe un layout principal.
- La navegación entre páginas no recarga la aplicación.
- Las rutas desconocidas muestran Not Found.
- Se agregan pruebas básicas de navegación.
- El proyecto compila sin errores.
- Las pruebas finalizan correctamente.

## Out of Scope

- No cargar preguntas.
- No seleccionar módulos.
- No responder preguntas.
- No calcular resultados.
- No guardar progreso.
- No crear navegación visual definitiva.
- No configurar Azure Static Web Apps todavía.

## Dependencias

- US-001 completada.
- US-002 completada.

## Tasks

1. Instalar `react-router-dom`.
2. Crear `src/app/router.tsx`.
3. Crear `MainLayout`.
4. Crear `HomePage`.
5. Crear `QuizPage`.
6. Crear `ResultsPage`.
7. Crear `NotFoundPage`.
8. Configurar las rutas principales.
9. Agregar enlaces temporales para validar navegación.
10. Crear pruebas de renderizado y navegación.
11. Ejecutar lint, tests y build.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- Las rutas principales funcionan.
- Las rutas inexistentes muestran Not Found.
- No existen errores en consola.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.

## Prompt IA

Implementar la User Story `US-003 - Configurar navegación y páginas placeholder` dentro de la Feature `01.01 - Proyecto frontend base`.

Leer primero `AGENTS.md`.

Implementar únicamente navegación y placeholders. No implementar preguntas, respuestas, scoring, persistencia ni Azure.

Al finalizar ejecutar:

- `npm run lint`
- `npm run test`
- `npm run build`

Entregar reporte de cambios, Acceptance Criteria cubiertos, pruebas y decisiones.
