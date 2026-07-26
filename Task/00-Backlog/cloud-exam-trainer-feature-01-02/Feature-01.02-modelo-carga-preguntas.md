---
id: 2
type: "Feature"
title: "01.02 - Modelo y carga de preguntas"
state: "New"
epic: "01 - MVP inicial"
---

# 01.02 - Modelo y carga de preguntas

## Epic

01 - MVP inicial

## Feature

01.02 - Modelo y carga de preguntas

## Objetivo

Definir el contrato de datos de las preguntas y preparar la aplicación para cargar cuestionarios desde archivos JSON locales.

La feature debe dejar preparada una estructura simple, validada y testeable para representar preguntas de opción única y múltiple, organizadas por tema y listas para ser utilizadas por el motor de cuestionarios en features posteriores.

## Acceptance Criteria

- Se define un modelo TypeScript para preguntas.
- Se define un modelo TypeScript para opciones de respuesta.
- Se soportan preguntas de respuesta única.
- Se soportan preguntas de respuesta múltiple.
- Cada pregunta puede asociarse a un tema.
- Cada pregunta incluye explicación.
- Se define un formato JSON documentado.
- Se valida el contenido de los archivos JSON.
- Se detectan IDs duplicados.
- Se detectan respuestas correctas inexistentes.
- Se valida la coherencia entre tipo de pregunta y cantidad de respuestas correctas.
- Se implementa un servicio para cargar preguntas desde archivos JSON locales.
- Se pueden obtener preguntas por tema.
- Se puede obtener una cantidad aleatoria de preguntas sin duplicados.
- Existen pruebas unitarias para validación y carga.
- El proyecto compila sin errores.

## Out of Scope

- No implementar interfaz de cuestionario.
- No permitir responder preguntas.
- No calcular resultados.
- No implementar recomendaciones por tema.
- No importar archivos desde la interfaz.
- No consumir una API.
- No utilizar base de datos.
- No implementar administración de preguntas.
- No validar factualidad técnica del contenido.
- No implementar múltiples certificaciones.

## Dependencias

- Feature 01.01 - Proyecto frontend base completada.

## Definition of Done

- Todas las User Stories asociadas están completadas.
- Los contratos TypeScript están documentados.
- Los archivos JSON de ejemplo pasan validación.
- Los validadores detectan contenido inválido.
- El servicio carga preguntas correctamente.
- `npm run lint` finaliza correctamente.
- `npm run test` finaliza correctamente.
- `npm run build` finaliza correctamente.
- No existen errores en la consola.
- No se agregaron capas o abstracciones innecesarias.

## User Stories

- US-004 - Definir contrato de preguntas.
- US-005 - Validar archivos JSON de preguntas.
- US-006 - Implementar carga y selección de preguntas.
