---
id: 1
type: "User Story"
title: "US-001 - Crear proyecto React con TypeScript y Vite"
state: "New"
epic: "01 - MVP inicial"
feature: "01.01 - Proyecto frontend base"
---

# US-001 - Crear proyecto React con TypeScript y Vite

## Epic

01 - MVP inicial

## Feature

01.01 - Proyecto frontend base

## User Story

US-001 - Crear proyecto React con TypeScript y Vite

## Objetivo

Como desarrollador, quiero crear el proyecto frontend con React, TypeScript y Vite para disponer de una base moderna, liviana y preparada para implementar el cuestionario.

## Contexto

La aplicación será una SPA simple que permitirá responder preguntas de opción única o múltiple y, al finalizar, mostrará el resultado general y los temas que necesitan mayor atención.

En esta historia solo debe crearse la base técnica del proyecto.

## Acceptance Criteria

- Se crea un proyecto usando React.
- Se utiliza TypeScript.
- Se utiliza Vite como herramienta de desarrollo y build.
- Se eliminan los componentes y estilos de ejemplo que no sean necesarios.
- Se configura una página inicial placeholder.
- Se agregan scripts para:
  - Desarrollo.
  - Build.
  - Preview.
- Se agrega `.gitignore`.
- Se agrega `.editorconfig`.
- Se agrega `.env.example` sin secretos.
- Se documentan los prerrequisitos y comandos principales en el README.
- La aplicación ejecuta con `npm run dev`.
- La aplicación compila con `npm run build`.

## Out of Scope

- No configurar routing.
- No configurar Vitest.
- No configurar lógica de cuestionarios.
- No agregar archivos JSON de preguntas.
- No integrar Azure.
- No agregar backend.
- No implementar diseño final.

## Dependencias

- Repositorio creado.
- Node.js LTS instalado.
- npm instalado.

## Tasks

1. Inicializar el proyecto con Vite, React y TypeScript.
2. Instalar dependencias.
3. Eliminar contenido de ejemplo innecesario.
4. Crear una página inicial placeholder.
5. Crear `.editorconfig`.
6. Revisar `.gitignore`.
7. Crear `.env.example`.
8. Configurar scripts `dev`, `build` y `preview`.
9. Crear o actualizar el README.
10. Ejecutar `npm run build`.
11. Verificar la aplicación localmente.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- El proyecto ejecuta localmente.
- El build finaliza correctamente.
- No existen errores en consola.
- No se agregaron dependencias fuera del alcance.
- El README contiene instrucciones suficientes para otro desarrollador.

## Prompt IA

Implementar la User Story `US-001 - Crear proyecto React con TypeScript y Vite` dentro de la Feature `01.01 - Proyecto frontend base`.

Leer primero `AGENTS.md` y respetar el alcance simplificado del MVP.

Implementar únicamente los Acceptance Criteria de esta historia.

No agregar routing, cuestionarios, backend, autenticación, persistencia, Azure ni abstracciones innecesarias.

Al finalizar:

- Ejecutar `npm run build`.
- Informar archivos creados o modificados.
- Indicar Acceptance Criteria cubiertos.
- Documentar cualquier decisión técnica.
- Reportar bloqueos o pendientes reales.
