# API de certificaciones

Esta API expone las certificaciones disponibles para que el frontend pueda consultarlas dinámicamente sin depender de valores hardcodeados.

## Endpoints

### `GET /api/certifications`

Devuelve el listado de certificaciones activas.

- **Código de respuesta exitoso:** `200 OK`
- **Cuerpo:** array de `CertificationListItemDto`
- **Ordenamiento:** por nombre de certificación ascendente (alfabético).
- **Filtros:** solo certificaciones con `isActive === true`.

### `GET /api/certifications/:id`

Devuelve el detalle de una certificación activa por su identificador.

- **Código de respuesta exitoso:** `200 OK`
- **Códigos de error:**
  - `400 Bad Request` — identificador inválido o vacío.
  - `404 Not Found` — certificación inexistente o inactiva.

### `GET /api/certifications/code/:code`

Devuelve el detalle de una certificación activa por su código único.

- **Código de respuesta exitoso:** `200 OK`
- **Códigos de error:**
  - `400 Bad Request` — código inválido o vacío.
  - `404 Not Found` — certificación inexistente o inactiva.

## Estrategia de identificación

El recurso se identifica preferentemente por `id` en la ruta `/api/certifications/:id`. El código (`/api/certifications/code/:code`) se ofrece como alternativa cuando se conoce el código de examen (por ejemplo, `SAA-C03`).

## Contratos

### `ProviderSummaryDto`

| Propiedad | Tipo   | Descripción                    |
| --------- | ------ | ------------------------------ |
| `id`      | string | Identificador del proveedor.   |
| `name`    | string | Nombre visible del proveedor.  |

### `CertificationListItemDto` / `CertificationDetailDto`

| Propiedad     | Tipo               | Descripción                                            |
| ------------- | ------------------ | ------------------------------------------------------ |
| `id`          | string             | Identificador de la certificación.                     |
| `code`        | string             | Código único del examen.                               |
| `name`        | string             | Nombre de la certificación.                            |
| `description` | string             | Descripción corta.                                     |
| `version`     | string             | Versión del examen.                                    |
| `difficulty`  | string             | Nivel de dificultad.                                   |
| `imageUrl`    | string             | URL o ruta a la imagen o insignia.                     |
| `isActive`    | boolean            | Indica si está activa y disponible.                    |
| `provider`    | `ProviderSummaryDto` | Proveedor que ofrece la certificación.                 |

## Proveedores soportados

El contrato es genérico y no asume que todas las certificaciones pertenecen a AWS. Está preparado para Azure, Google Cloud u otros proveedores.

## Especificación OpenAPI

La especificación completa se encuentra en `frontend/public/openapi.json`.
