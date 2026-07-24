# Project Context

## Producto

Cloud Exam Trainer es una aplicación web genérica para estudiar certificaciones mediante cuestionarios por módulos.

La primera certificación soportada es AWS Certified Solutions Architect - Associate, pero el motor no debe depender de AWS.

## MVP

- React + TypeScript + Vite.
- Azure Static Web Apps.
- Preguntas almacenadas en JSON versionado.
- Progreso almacenado en `localStorage`.
- Sin backend.
- Sin autenticación.
- Sin base de datos.

## Funcionalidades principales

- Listado de certificaciones.
- Listado de módulos.
- Configuración de cuestionarios.
- Preguntas de selección única y múltiple.
- Corrección inmediata en modo práctica.
- Modo examen sin corrección inmediata.
- Resultados y estadísticas básicas.
- Historial local.
- Repaso de errores.
- Favoritos.

## Principios funcionales

- Las preguntas son datos, no código.
- El motor debe ser independiente de una certificación específica.
- Los contratos JSON deben validarse antes de ejecutar el cuestionario.
- Las respuestas se comparan por identificadores, nunca por posición.
- Los datos locales deben ser versionados para permitir migraciones.
