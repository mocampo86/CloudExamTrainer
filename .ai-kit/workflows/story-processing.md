# Workflow: Story Processing

## Entrada

- Historia de usuario.
- Rama objetivo.
- Código actual.

## Fase 1 — Comprensión

1. Extraer objetivo.
2. Enumerar Acceptance Criteria.
3. Enumerar Out of Scope.
4. Detectar dependencias.
5. Identificar ambigüedades que puedan resolverse desde el código o documentación.
6. No bloquear la ejecución por detalles menores; usar la alternativa más conservadora.

## Fase 2 — Análisis técnico

1. Localizar componentes existentes reutilizables.
2. Identificar modelos, servicios, rutas, estado y pruebas afectados.
3. Proponer un plan de cambios por archivo.
4. Evaluar riesgos de regresión.

## Fase 3 — Implementación

1. Implementar primero contratos y lógica pura.
2. Implementar servicios.
3. Implementar estado.
4. Implementar interfaz.
5. Agregar pruebas.
6. Actualizar documentación.

## Fase 4 — Verificación

Ejecutar, cuando existan:

```bash
npm ci
npm run lint
npm run validate:certifications
npm run validate:questions
npm run test
npm run build
```

## Fase 5 — Autorrevisión

- Comparar el diff con cada Acceptance Criterion.
- Confirmar que no se implementó Out of Scope.
- Buscar código muerto, `any`, logs temporales y comentarios obsoletos.
- Revisar errores de accesibilidad básicos.

## Salida

Usar `templates/implementation-report.md`.
