# Architecture Rules

## Límites

- No introducir backend sin una historia explícita.
- No introducir autenticación sin una historia explícita.
- No introducir PostgreSQL, Cosmos DB ni otros servicios persistentes en el MVP.
- No agregar librerías sin justificar su necesidad.
- No acoplar componentes visuales con carga de datos o persistencia.

## Organización

- `features/`: funcionalidad de negocio por dominio.
- `components/common/`: componentes reutilizables sin lógica de negocio específica.
- `models/`: contratos TypeScript.
- `schemas/`: validaciones Zod.
- `services/`: carga, persistencia y validación.
- `data/certifications/`: contenido estático versionado.

## Dependencias

Permitidas inicialmente:

- React.
- TypeScript.
- Vite.
- React Router.
- Zod.
- Zustand, solo si el estado compartido lo justifica.
- Vitest y Testing Library.

## Reglas de calidad

- TypeScript estricto.
- No usar `any` salvo justificación documentada.
- Funciones pequeñas y con responsabilidad única.
- Errores controlados y mensajes útiles.
- No ocultar errores de validación de contenido.
- No almacenar secretos en el repositorio.
- No realizar llamadas externas para cargar preguntas en el MVP.

## Datos JSON

- IDs únicos globalmente por certificación.
- Opciones con IDs únicos dentro de la pregunta.
- `single_choice` debe tener exactamente una respuesta correcta.
- `multiple_choice` debe tener al menos dos respuestas correctas.
- Toda respuesta incorrecta debe tener explicación.
- Los archivos deben indicar versión.
