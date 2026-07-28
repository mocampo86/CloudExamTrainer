# US-025 - Crear modelo de dominios de examen

## Descripción

Como administrador de contenido, quiero organizar una certificación mediante dominios de examen para clasificar las preguntas según la estructura oficial o funcional de cada examen.

## Objetivo

Crear el modelo de dominio y persistencia para representar los dominios de una certificación sin acoplarlo a AWS.

## Acceptance Criteria

### Entidad ExamDomain

- Se crea `ExamDomain`.
- Incluye Id, CertificationExamId, Code, Name, Description, DisplayOrder e IsActive.
- Code y Name son obligatorios.
- Code es único dentro de una certificación.
- DisplayOrder no admite valores negativos.
- IsActive posee un valor por defecto definido.

### Relaciones y reglas

- Una CertificationExam puede tener múltiples ExamDomain.
- Cada ExamDomain pertenece a una única CertificationExam.
- No se permite un dominio sin certificación.
- No existe lógica específica para una cantidad fija de dominios.
- Un dominio inactivo no se utiliza para nuevo contenido.
- Desactivar un dominio no elimina preguntas históricas.

### Persistencia

- Se crea la configuración de EF Core.
- Se define clave primaria y clave foránea.
- Se crea índice por CertificationExamId.
- Se crea restricción única por CertificationExamId y Code.
- Se definen longitudes máximas razonables.

### Pruebas y calidad

- Se prueba la creación válida.
- Se prueba que Code sea obligatorio.
- Se prueba la unicidad dentro de una certificación.
- Se prueba la relación con CertificationExam.
- La solución compila.
- La entidad no depende de DTO ni controladores.
- Se documenta el propósito del modelo.

## Out of Scope

- No crear endpoints.
- No crear UI administrativa.
- No importar dominios desde AWS.
- No asociar preguntas en esta historia.
- No implementar porcentajes oficiales.
- No implementar versionado de dominios.
