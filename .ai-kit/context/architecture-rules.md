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

## UI/UX

- Interfaz moderna y profesional: cards con sombras sutiles, bordes redondeados y espaciados uniformes.
- Contenido centrado dentro de un ancho máximo consistente (`max-width: 48rem`).
- Tipografía legible y jerarquía visual clara (títulos, descripciones, labels, valores).
- Variables CSS centralizadas en `src/styles/globals.css` para colores, sombras, radios y fuentes.
- No se utilizan controles HTML con apariencia por defecto (selects, radios, checkboxes deben estar completamente estilizados).
- Botones y enlaces con estados `hover`, `focus`, `active` y `disabled` visibles.
- Todos los campos de formulario deben tener labels asociados y foco visible (`focus-visible`).
- Navegación completa por teclado y roles ARIA apropiados (`progressbar`, `alert`, `dialog`, etc.).
- Diseño responsive para desktop, tablet y móvil, sin scroll horizontal y con controles táctiles accesibles.
- Reutilización de componentes visuales existentes (`card`, `btn`, `form-control`, `answer-option`, etc.).
- Mensajes de error, estados vacíos y confirmaciones con contraste adecuado y texto descriptivo.
- Indicadores de estado que no dependan únicamente del color (badges con texto, porcentajes con anillos/barras).

### Encabezados de página

- Página de inicio: hero con título y descripción; formulario en card para seleccionar tema y cantidad de preguntas.
- Página de cuestionario: título `Cuestionario`, tema seleccionado, progreso visual (`Pregunta X de Y`) y puntaje parcial si la lógica lo permite.
- Página de resultados: título indicando finalización, mensaje motivacional según el puntaje, resumen visual, desempeño por tema, revisión de respuestas y acciones de navegación.
