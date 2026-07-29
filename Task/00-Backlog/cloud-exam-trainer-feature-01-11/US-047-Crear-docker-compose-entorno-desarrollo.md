# US-047 - Crear docker-compose para entorno de desarrollo

## Descripción

Como desarrollador, quiero levantar el frontend con un solo comando (`docker compose up`) para tener un entorno de desarrollo consistente.

## Objetivo

Crear un `docker-compose.yml` que orqueste el frontend y, opcionalmente, prepare un contenedor de PostgreSQL para la futura persistencia.

## Acceptance Criteria

### docker-compose.yml

- Se crea `docker-compose.yml` en la raíz del proyecto.
- Define un servicio `frontend` que:
  - Construye el `Dockerfile` con target `dev`.
  - Expone el puerto `5173` mapeado a `5173`.
  - Monta el código fuente como volumen para hot-reload.
  - Mapea `node_modules` como volumen anónimo para evitar conflictos con el host.
  - Usa variables de entorno desde `.env`.
- Define un servicio opcional `postgres` que:
  - Utiliza una imagen oficial ligera (`postgres:16-alpine` o similar).
  - Expone el puerto `5432` mapeado a `5432`.
  - Persiste datos en un volumen nombrado (`postgres_data`).
  - Configura usuario, contraseña y base de datos mediante variables de entorno.
  - Incluye `healthcheck`.
- El servicio `frontend` no depende de `postgres` salvo que se active el perfil o servicio correspondiente.

### Variables de entorno

- Se documentan `NODE_ENV`, `VITE_*`, `DATABASE_URL`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`.
- No se incluyen secretos por defecto en `docker-compose.yml`.

### Pruebas y calidad

- `docker compose up --build` levanta el frontend sin errores.
- `http://localhost:5173` responde con la aplicación.
- Los cambios en el código se reflejan en caliente.
- `docker compose down` detiene y limpia los contenedores.

## Out of Scope

- No implementar docker-compose para producción.
- No configurar proxy inverso (nginx/traefik).
- No implementar redes avanzadas ni certificados TLS.
- No modificar lógica de negocio.
