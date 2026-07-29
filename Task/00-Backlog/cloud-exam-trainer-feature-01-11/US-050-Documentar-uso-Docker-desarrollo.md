# US-050 - Documentar uso de Docker para desarrollo

## Descripción

Como desarrollador, quiero tener documentación clara sobre cómo usar Docker para levantar, probar y detener la aplicación.

## Objetivo

Actualizar el `README.md` y otros documentos relevantes con las instrucciones de uso de Docker.

## Acceptance Criteria

### README.md

- Se añade una sección "Desarrollo con Docker" que incluya:
  - Prerrequisitos (Docker, Docker Compose).
  - Comando para levantar el entorno: `docker compose up --build`.
  - URL de acceso (`http://localhost:5173`).
  - Comandos para ejecutar pruebas y lint dentro del contenedor.
  - Comando para detener: `docker compose down`.
  - Comando para levantar también PostgreSQL (si aplica).
- Se mantiene la documentación existente del flujo local sin Docker.

### Variables de entorno

- Se documenta el uso de `.env` y `.env.docker.example`.
- Se listan las variables necesarias para Docker.

### Arquitectura

- `docs/certification-architecture.md` se actualiza con una nota sobre el entorno de desarrollo con Docker.
- `docs/project-scope.md` incluye la feature 01.11 en la lista de funcionalidades futuras o de desarrollo.

### Pruebas y calidad

- Los comandos documentados son copiables y funcionan tal cual.
- No hay pasos ambiguos.
- Se distingue entre uso en desarrollo y producción (aunque la imagen productiva no se despliegue todavía).

## Out of Scope

- No documentar despliegue en producción con Docker.
- No documentar Kubernetes.
- No modificar el despliegue en Azure Static Web Apps.
