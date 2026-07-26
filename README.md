# Cloud Exam Trainer

Aplicación SPA para practicar cuestionarios de certificación.

## Prerrequisitos

- Node.js LTS
- npm

## Instalación

1. Clona el repositorio.
2. Desde la raíz del proyecto, instala las dependencias:

```bash
npm install
```

Este comando instala también las dependencias del proyecto `frontend` gracias al script `postinstall`.

## Paso a paso para ejecutar la aplicación

### 1. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abre el navegador en la URL que muestre la terminal (por defecto `http://localhost:5173`).

### 2. Ejecutar pruebas

```bash
npm run test
```

Para ejecutar las pruebas en modo observador:

```bash
npm run test:watch
```

### 3. Validar el JSON de preguntas

```bash
npm run validate:questions
```

### 4. Compilar para producción

```bash
npm run build
```

Genera la carpeta `frontend/dist` con los archivos optimizados.

### 5. Previsualizar la compilación de producción

```bash
npm run preview
```

Sirve localmente la versión compilada.

## Comandos disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: compila la aplicación.
- `npm run preview`: sirve la compilación de producción.
- `npm run lint`: ejecuta ESLint.
- `npm run test`: ejecuta las pruebas con Vitest.
- `npm run test:watch`: ejecuta las pruebas en modo observador.
- `npm run validate:questions`: valida el formato del JSON de preguntas.

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
