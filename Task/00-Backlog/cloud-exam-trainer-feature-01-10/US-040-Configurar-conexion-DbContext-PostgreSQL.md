# US-040 - Configurar conexión y DbContext de PostgreSQL

## Descripción

Como desarrollador, quiero configurar la conexión a PostgreSQL y el DbContext de Entity Framework Core para que el resto de la aplicación pueda persistir y consultar el banco de preguntas de forma relacional.

## Objetivo

Establecer la infraestructura de acceso a datos con PostgreSQL sin acoplar los modelos de dominio a detalles de Entity Framework Core.

## Acceptance Criteria

### Configuración

- Se añade la cadena de conexión de PostgreSQL en `appsettings.json` (o `.env`/config correspondiente) y se documenta para entornos local y productivo.
- Se instalan/actualizan los paquetes necesarios (`Npgsql.EntityFrameworkCore.PostgreSQL` o equivalente compatibles con el stack del proyecto).
- Se registra el `DbContext` en el contenedor de dependencias con la cadena de conexión configurada.
- El `DbContext` se define en la capa de infraestructura/persistencia.

### DbContext

- Se crea una clase `ApplicationDbContext` (o similar) que hereda de `DbContext`.
- Se configuran convenciones de nombres (snake_case por defecto si el proyecto lo requiere), mapeo de enums y timestamps.
- Se mantiene separación entre entidades de dominio y configuraciones de EF Core (`IEntityTypeConfiguration<T>`).
- No se exponen entidades de dominio en contratos HTTP ni en capas superiores.

### Migraciones

- Se genera la migración inicial vacía o se prepara el proyecto para ejecutar `dotnet ef migrations add`.
- Se documenta el comando para crear/aplicar migraciones en `README.md` o `docs/`.
- No se aplica automáticamente la migración en producción sin control explícito.

### Pruebas y calidad

- Se prueba que la aplicación inicia sin errores de configuración de DbContext.
- Se prueba que la conexión a PostgreSQL responde (health check simple opcional).
- Se verifica que `DbContextOptions` se inyectan correctamente.
- La solución compila.
- No se introduce lógica de negocio en esta historia.

## Out of Scope

- No crear tablas/entidades de preguntas en esta historia.
- No implementar repositorios.
- No implementar endpoints.
- No migrar datos.
- No implementar autenticación ni autorización.
