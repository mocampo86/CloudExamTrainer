---
id: 2
type: "User Story"
title: "US-002 - Configurar estructura inicial y calidad base"
state: "New"
epic: "01 - MVP inicial"
feature: "01.01 - Proyecto frontend base"
---

# US-002 - Configurar estructura inicial y calidad base

## Epic

01 - MVP inicial

## Feature

01.01 - Proyecto frontend base

## User Story

US-002 - Configurar estructura inicial y calidad base

## Objetivo

Como desarrollador, quiero configurar una estructura simple de carpetas y herramientas básicas de calidad para mantener el código organizado y verificable.

## Contexto

La estructura debe ser suficiente para el MVP, evitando capas, patrones o abstracciones que no aporten valor inmediato.

## Acceptance Criteria

- Se crean las carpetas:
  - `src/app`
  - `src/components`
  - `src/pages`
  - `src/models`
  - `src/services`
  - `src/data`
  - `src/utils`
  - `src/styles`
- Se configura un alias `@` para `src`.
- Se configura ESLint.
- Se configura Vitest.
- Se configura Testing Library.
- Se utiliza entorno `jsdom`.
- Se agrega al menos una prueba smoke.
- Se agregan scripts:
  - `lint`
  - `test`
  - `test:watch`
- Se agregan estilos globales mínimos.
- Se documenta la estructura del proyecto.
- El proyecto compila sin errores.
- Las pruebas finalizan correctamente.
- ESLint finaliza sin errores.

## Out of Scope

- No implementar componentes funcionales del cuestionario.
- No configurar estado global.
- No agregar Redux.
- No agregar Zustand.
- No crear un design system.
- No implementar estilos finales.
- No agregar integración continua.

## Dependencias

- US-001 completada.

## Tasks

1. Crear la estructura inicial de carpetas.
2. Configurar alias `@` en TypeScript y Vite.
3. Instalar y configurar ESLint.
4. Instalar y configurar Vitest.
5. Instalar y configurar Testing Library.
6. Configurar `jsdom`.
7. Crear una prueba smoke.
8. Crear `globals.css`.
9. Importar los estilos globales.
10. Agregar scripts de calidad en `package.json`.
11. Documentar la estructura en el README o `docs/architecture.md`.
12. Ejecutar lint, tests y build.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.
- La estructura es simple y coherente con el MVP.
- No se agregaron librerías ni patrones innecesarios.

## Prompt IA

Implementar la User Story `US-002 - Configurar estructura inicial y calidad base` dentro de la Feature `01.01 - Proyecto frontend base`.

Leer `AGENTS.md` antes de comenzar.

Mantener una arquitectura simple. No agregar estado global, frameworks visuales ni abstracciones que no estén requeridas.

Al finalizar ejecutar:

- `npm run lint`
- `npm run test`
- `npm run build`

Entregar resumen, archivos modificados, pruebas ejecutadas y decisiones técnicas.
