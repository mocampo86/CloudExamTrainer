# US-046 - Crear Dockerfile para el frontend

## Descripción

Como desarrollador, quiero contar con un `Dockerfile` para el frontend para poder construir y ejecutar la aplicación de forma reproducible sin depender de la instalación local de Node.js.

## Objetivo

Crear un `Dockerfile` multi-etapa o multi-target que soporte desarrollo (con hot-reload) y compilación de producción.

## Acceptance Criteria

### Dockerfile

- Se crea `Dockerfile` en la raíz del proyecto o bajo `frontend/`.
- Utiliza una imagen base oficial y ligera de Node.js (`node:20-alpine` o similar).
- Define al menos dos targets o etapas:
  - `dev`: instala dependencias, expone el puerto de Vite (`5173`) y ejecuta `npm run dev`.
  - `prod` (o etapa `build` + `serve`): compila la aplicación y sirve los archivos estáticos con `nginx` o `npm run preview`.
- Elige la etapa por defecto adecuada para desarrollo.
- Define un usuario no root para ejecutar la aplicación.
- Optimiza la capa de dependencias copiando primero `package.json` y `package-lock.json`.

### .dockerignore

- Se crea o actualiza `.dockerignore` excluyendo:
  - `node_modules`
  - `dist`
  - `.git`
  - logs y archivos temporales
  - archivos sensibles (`.env`, `*.local`)
  - directorios de tests innecesarios en la imagen productiva si aplica.

### Pruebas y calidad

- La imagen se construye sin errores:
  - `docker build --target dev -t cloud-exam-trainer-dev .`
  - `docker build --target prod -t cloud-exam-trainer-prod .`
- El contenedor en modo desarrollo expone `http://localhost:5173`.
- El contenedor en modo producción sirve la aplicación compilada.
- No se introducen secretos en la imagen.
- La imagen final es lo más pequeña posible.

## Out of Scope

- No crear docker-compose en esta historia.
- No configurar PostgreSQL en esta historia.
- No modificar la lógica de la aplicación.
- No implementar CI/CD con Docker.
