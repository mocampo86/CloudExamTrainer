---
id: 1
type: "Feature"
title: "01.01 - Proyecto frontend base"
state: "New"
epic: "01 - MVP inicial"
---

# 01.01 - Proyecto frontend base

## Epic

01 - MVP inicial

## Feature

01.01 - Proyecto frontend base

## Objetivo

Crear la estructura inicial de la aplicación web para responder cuestionarios de certificación usando React, TypeScript y Vite.

La feature debe dejar preparada una SPA simple, mantenible y testeable, que sirva como base para cargar preguntas desde archivos JSON, ejecutar cuestionarios y mostrar resultados por tema en features posteriores.

## Acceptance Criteria

- Se crea un proyecto React con TypeScript y Vite.
- Se configura una estructura inicial de carpetas.
- Se configura navegación base con React Router.
- Se crean páginas placeholder para:
  - Inicio.
  - Cuestionario.
  - Resultados.
  - Página no encontrada.
- Se configura ESLint.
- Se configura Vitest.
- Se agrega al menos una prueba smoke.
- Se configura un alias para imports desde `src`.
- Se agregan estilos globales mínimos.
- Se documentan prerrequisitos y comandos de ejecución.
- La aplicación ejecuta correctamente en ambiente local.
- La aplicación compila sin errores.
- No se agregan librerías innecesarias.

## Out of Scope

- No implementar carga real de preguntas.
- No implementar lógica de cuestionarios.
- No implementar evaluación por tema.
- No implementar persistencia.
- No implementar autenticación.
- No implementar backend.
- No implementar base de datos.
- No implementar integración con Azure.
- No implementar diseño visual final.
- No implementar múltiples certificaciones.

## Dependencias

- Node.js LTS.
- npm.
- Git.
- Repositorio creado para el proyecto.

## Definition of Done

- Todas las User Stories asociadas están completadas.
- El proyecto ejecuta con `npm run dev`.
- El proyecto compila con `npm run build`.
- ESLint finaliza sin errores.
- Vitest finaliza correctamente.
- La navegación base funciona.
- No existen errores en la consola del navegador.
- El README contiene instrucciones actualizadas.
- El código respeta el alcance simplificado definido en `AGENTS.md`.

## User Stories

- US-001 - Crear proyecto React con TypeScript y Vite.
- US-002 - Configurar estructura inicial y calidad base.
- US-003 - Configurar navegación y páginas placeholder.
