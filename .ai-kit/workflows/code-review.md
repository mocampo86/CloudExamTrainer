# Workflow: Code Review

## Entrada

- Historia o requerimiento.
- Diff o rama a revisar.
- Reglas arquitectónicas.

## Proceso

1. Leer la historia y mapear cada Acceptance Criterion.
2. Revisar archivos modificados y dependencias indirectas.
3. Verificar flujo funcional completo.
4. Revisar contratos TypeScript y esquemas Zod.
5. Revisar persistencia y migración de `localStorage`.
6. Revisar manejo de rutas y recargas en Azure Static Web Apps.
7. Revisar pruebas y escenarios negativos.
8. Revisar accesibilidad básica de formularios y opciones.
9. Revisar contenido y explicaciones si se modificaron preguntas.
10. Ejecutar comandos disponibles o declarar explícitamente cuáles no se pudieron ejecutar.

## Formato de findings

Cada finding debe usar:

```text
[SEVERITY] Título breve
Archivo: ruta:líneas
Criterio afectado: AC-x o regla
Descripción: qué ocurre
Impacto: por qué importa
Corrección: cambio concreto sugerido
```

## Cierre

El veredicto debe ser uno de:

- `APPROVE`
- `APPROVE WITH NOTES`
- `REQUEST CHANGES`
