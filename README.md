# Cloud Exam Trainer

Aplicación SPA para practicar cuestionarios de certificación.

## Prerrequisitos

- Node.js LTS
- npm

## Instalación

```bash
npm install
```

## Comandos

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: compila la aplicación.
- `npm run preview`: sirve la compilación de producción.
- `npm run lint`: ejecuta ESLint.
- `npm run test`: ejecuta las pruebas con Vitest.
- `npm run test:watch`: ejecuta las pruebas en modo observador.

## Estructura

- `frontend/`: proyecto React + TypeScript + Vite.
  - `src/app/`: componente raíz y pruebas asociadas.
  - `src/components/`: componentes reutilizables.
  - `src/pages/`: páginas de la aplicación.
  - `src/models/`: tipos y modelos de dominio.
  - `src/services/`: lógica de servicios.
  - `src/data/`: datos estáticos (por ejemplo, JSON de preguntas).
  - `src/utils/`: funciones utilitarias.
  - `src/styles/`: estilos globales.
