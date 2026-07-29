# US-049 - Soportar ejecución de pruebas y lint dentro de contenedores

## Descripción

Como desarrollador, quiero ejecutar pruebas y lint dentro del contenedor Docker para asegurar que el entorno de CI/CT sea idéntico al de desarrollo.

## Objetivo

Hacer que los scripts de pruebas (`npm run test`) y lint (`npm run lint`) funcionen correctamente dentro del contenedor de desarrollo.

## Acceptance Criteria

### Ejecución de comandos

- `docker compose exec frontend npm run test` ejecuta las pruebas y finaliza correctamente.
- `docker compose exec frontend npm run lint` ejecuta ESLint y reporta el mismo resultado que en el host.
- `docker compose exec frontend npm run validate:questions` valida el JSON de preguntas dentro del contenedor.
- Los resultados se muestran en la terminal del host.

### Dependencias de pruebas

- Las dependencias de desarrollo (`vitest`, `eslint`, etc.) están instaladas en la imagen `dev`.
- No se incluyen herramientas de desarrollo en la imagen productiva si se usa multi-etapa.

### Configuración

- Los volúmenes permiten que los archivos de cobertura o reportes generados persistan en el host si aplica.
- El contenedor no requiere privilegios elevados para ejecutar pruebas.

### Pruebas y calidad

- Se ejecuta al menos un ciclo completo de `docker compose up --build` seguido de `docker compose exec frontend npm run test`.
- Se verifica que los tests pasan sin falsos negativos por diferencias de entorno.
- Se documentan los comandos de uso en `README.md`.

## Out of Scope

- No implementar CI/CD con Docker.
- No ejecutar tests de integración con PostgreSQL en esta historia.
- No generar imágenes de CI separadas.
