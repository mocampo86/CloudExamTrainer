# US-048 - Configurar volúmenes, hot-reload y variables de entorno

## Descripción

Como desarrollador, quiero que el contenedor de desarrollo refleje los cambios de código en tiempo real y lea las variables de entorno correctamente.

## Objetivo

Configurar volúmenes, hot-reload y variables de entorno en Docker para que el flujo de desarrollo sea idéntico al entorno local.

## Acceptance Criteria

### Volúmenes y hot-reload

- El `docker-compose.yml` monta el directorio raíz (o `frontend/`) en el contenedor.
- `node_modules` se monta como volumen anónimo (`/app/node_modules`) para evitar sobrescribir dependencias instaladas en la imagen.
- El `Dockerfile` de desarrollo ejecuta `npm run dev` con `host` configurado para aceptar conexiones externas (`--host`).
- Cambios en archivos `.tsx`, `.ts`, `.css` y `.json` se reflejan en el navegador sin reiniciar el contenedor.

### Variables de entorno

- Se soportan variables `VITE_*` y `NODE_ENV`.
- El archivo `.env` se ignora por git y se documenta `.env.example`.
- Las variables necesarias para Docker se documentan en un `.env.docker.example` o se añaden al `.env.example` existente.
- El frontend puede leer variables de entorno al inicio y en tiempo de build según corresponda.

### PostgreSQL opcional

- Si se levanta el servicio `postgres`, el frontend puede conectarse mediante `DATABASE_URL`.
- No se requiere PostgreSQL para ejecutar el cuestionario en MVP.

### Pruebas y calidad

- Se verifica que un cambio en `App.tsx` se ve reflejado en el navegador en menos de unos segundos.
- Se verifica que variables de entorno inyectadas llegan al contenedor (`docker compose exec frontend env`).
- No se generan errores de permisos con `node_modules` entre host y contenedor.

## Out of Scope

- No implementar live-reload para backend.
- No modificar configuración de Vite salvo lo necesario.
- No implementar secret management avanzado.
