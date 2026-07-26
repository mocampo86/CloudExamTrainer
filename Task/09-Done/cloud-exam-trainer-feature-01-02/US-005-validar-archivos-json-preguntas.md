---
id: 5
type: "User Story"
title: "US-005 - Validar archivos JSON de preguntas"
state: "New"
epic: "01 - MVP inicial"
feature: "01.02 - Modelo y carga de preguntas"
---

# US-005 - Validar archivos JSON de preguntas

## Epic

01 - MVP inicial

## Feature

01.02 - Modelo y carga de preguntas

## User Story

US-005 - Validar archivos JSON de preguntas

## Objetivo

Como desarrollador, quiero validar los archivos JSON de preguntas para detectar errores de estructura antes de que el contenido sea utilizado por la aplicación.

## Contexto

La aplicación dependerá de archivos JSON locales.

Una pregunta inválida no debe llegar al flujo de cuestionario sin ser detectada.

La validación debe cubrir estructura y coherencia básica, pero no debe intentar verificar si el contenido técnico de AWS es correcto.

## Acceptance Criteria

- Se instala y configura Zod.
- Se crea un esquema para `QuestionOption`.
- Se crea un esquema para `Question`.
- Se validan campos obligatorios.
- Se exige un mínimo de dos opciones.
- Se detectan IDs de opciones duplicados dentro de una pregunta.
- Se valida que cada respuesta correcta exista entre las opciones.
- Una pregunta `single_choice` debe tener exactamente una respuesta correcta.
- Una pregunta `multiple_choice` debe tener al menos dos respuestas correctas.
- Se detectan IDs de preguntas duplicados dentro de un archivo.
- Se crea un script `validate:questions`.
- El script retorna un código de error cuando encuentra contenido inválido.
- Los errores muestran:
  - Archivo afectado.
  - ID de la pregunta cuando esté disponible.
  - Motivo de la validación.
- Existen pruebas para archivos válidos e inválidos.
- El proyecto compila sin errores.

## Out of Scope

- No verificar exactitud técnica.
- No validar documentación externa.
- No corregir automáticamente preguntas.
- No eliminar contenido inválido.
- No crear interfaz de importación.
- No consumir servicios externos.
- No utilizar IA durante la validación.

## Dependencias

- US-004 completada.

## Tasks

1. Instalar Zod.
2. Crear `src/schemas/questionSchema.ts`.
3. Crear validaciones de campos obligatorios.
4. Agregar refinamiento para IDs de opciones duplicados.
5. Agregar refinamiento para respuestas inexistentes.
6. Agregar refinamiento para `single_choice`.
7. Agregar refinamiento para `multiple_choice`.
8. Crear validación de IDs de preguntas duplicados.
9. Crear `scripts/validateQuestions.ts`.
10. Agregar el script `validate:questions` a `package.json`.
11. Crear fixtures JSON válidos.
12. Crear fixtures JSON inválidos.
13. Agregar pruebas unitarias.
14. Ejecutar validación, lint, tests y build.
15. Documentar el uso del comando.

## Definition of Done

- Todos los Acceptance Criteria están implementados.
- Un archivo válido finaliza correctamente.
- Un archivo inválido hace fallar el proceso.
- Los errores son claros y accionables.
- Existen pruebas para los casos principales.
- `npm run validate:questions` finaliza correctamente con contenido válido.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.

## Prompt IA

Implementar la User Story `US-005 - Validar archivos JSON de preguntas` dentro de la Feature `01.02 - Modelo y carga de preguntas`.

Leer `AGENTS.md` antes de comenzar.

La validación debe ser simple, explícita y limitada a estructura y coherencia.

No verificar factualidad técnica, no corregir contenido automáticamente y no implementar una interfaz de importación.

Al finalizar ejecutar:

- `npm run validate:questions`
- `npm run lint`
- `npm run test`
- `npm run build`

Entregar reporte con validaciones implementadas, pruebas ejecutadas, archivos modificados y cualquier limitación.
