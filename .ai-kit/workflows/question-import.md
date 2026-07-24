# Workflow: Question Import

## Entrada

- Uno o más archivos JSON.
- Certificación y módulo destino.

## Proceso

1. Validar sintaxis JSON.
2. Validar esquema Zod.
3. Detectar IDs duplicados.
4. Verificar referencias de certificación y módulo.
5. Verificar respuestas correctas.
6. Verificar explicaciones incorrectas.
7. Revisar claridad y ambigüedad.
8. Revisar duplicados semánticos.
9. Generar reporte.
10. Importar solamente preguntas aprobadas.

## Reglas

- No corregir silenciosamente contenido inválido.
- No eliminar preguntas sin incluirlas en el reporte.
- No aceptar URLs o referencias inventadas.
- No mezclar idiomas dentro de una misma certificación salvo configuración explícita.
