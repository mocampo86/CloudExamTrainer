# Feature 01.11 - Contenerización del entorno de desarrollo con Docker

## Objetivo

Proveer una configuración de Docker que permita ejecutar el proyecto de forma reproducible en desarrollo y pruebas, reduciendo la fricción de instalación de dependencias locales y alineando los entornos del equipo.

La feature contempla el frontend (`React + TypeScript + Vite`) y, de forma opcional, un servicio de PostgreSQL para soportar la futura **Feature 01.10 - Persistencia PostgreSQL del banco de preguntas**. No se implementa despliegue productivo con Docker en esta iteración.

## Acceptance Criteria

### Dockerización del frontend

- Se crea un `Dockerfile` en la raíz del proyecto o bajo `frontend/`.
- Soporta al menos dos targets: `dev` (con hot-reload) y `prod` (compilación optimizada).
- Utiliza una imagen base de Node.js LTS oficial y ligera (`node:20-alpine` o similar).
- Define usuario no root para ejecutar la aplicación.
- Se crea un `.dockerignore` adecuado para excluir `node_modules`, `dist`, `.git`, logs y archivos sensibles.

### Orquestación local

- Se crea un `docker-compose.yml` (y `docker-compose.override.yml` si aplica) en la raíz.
- El servicio del frontend expone el puerto de desarrollo (`5173` por defecto) y monta el código fuente para hot-reload.
- Se incluye un servicio opcional de PostgreSQL (`postgres:16-alpine` o similar) con variables de entorno configurables.
- Se define un volumen persistente para PostgreSQL.
- Se configura `healthcheck` para PostgreSQL.
- El frontend espera a que PostgreSQL esté saludable cuando se active el servicio de base de datos.

### Variables de entorno

- Se documentan las variables necesarias (por ejemplo, `NODE_ENV`, `VITE_*`, `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`).
- Se provee un archivo `.env.example` actualizado o `.env.docker.example`.
- No se incluyen secretos reales en el repositorio.

### Scripts y comandos

- Se añaden/complementan scripts en `package.json` o se documentan comandos equivalentes:
  - `docker compose up --build`
  - `docker compose -f docker-compose.yml up frontend`
  - `docker compose exec frontend npm run test`
- Se documenta cómo ejecutar pruebas dentro del contenedor.

### Integración con persistencia futura

- El contenedor de PostgreSQL queda preparado para ser utilizado por la Feature 01.10.
- No se requiere que el cuestionario cambie su comportamiento actual con JSON.
- El `docker-compose` activa PostgreSQL solo si se levanta el perfil o servicio correspondiente.

### Pruebas y calidad

- La imagen Docker del frontend compila sin errores.
- `docker compose up` levanta el frontend accesible en `http://localhost:5173`.
- Los cambios en código se reflejan en caliente en modo desarrollo.
- Las pruebas unitarias pueden ejecutarse dentro del contenedor.
- No se introducen dependencias innecesarias.
- Cada User Story puede implementarse mediante un Pull Request independiente.

## Out of Scope

- No implementar despliegue productivo con Docker.
- No implementar Kubernetes ni orquestadores en cluster.
- No implementar CI/CD con Docker en Azure DevOps en esta feature.
- No modificar el cálculo de resultados ni la lógica de cuestionario.
- No implementar backend persistente si no se activa la Feature 01.10.
- No modificar el despliegue en Azure Static Web Apps.

## User Stories incluidas

- US-046 - Crear Dockerfile para el frontend.
- US-047 - Crear docker-compose para entorno de desarrollo.
- US-048 - Configurar volúmenes, hot-reload y variables de entorno.
- US-049 - Soportar ejecución de pruebas y lint dentro de contenedores.
- US-050 - Documentar uso de Docker para desarrollo.
