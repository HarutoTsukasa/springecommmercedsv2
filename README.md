# Spring eCommerce (ecommerceDSv2)

Aplicación de e-commerce con Spring Boot: landing para clientes y dashboard
de administración. Sin Spring Security por ahora (autenticación básica
contra endpoint `/api/usuarios/login`).

## Stack

- Java 25
- Spring Boot (versión del `pom.xml`)
- Spring Data JPA + Hibernate
- Thymeleaf (solo para servir las vistas HTML existentes, sin motor de plantillas avanzado)
- MySQL (`com.mysql:mysql-connector-j`)
- Bootstrap 5 + DataTables + Chart.js (vía CDN, en el frontend)
- Lombok

## Requisitos

- JDK 25
- MySQL 8 en `localhost:3306`
- Usuario `root` / contraseña `root` (configurable en `application.properties`)

La base de datos `ecommercedbdsv2` se crea automáticamente
(`createDatabaseIfNotExist=true`) y el esquema se mantiene con
`spring.jpa.hibernate.ddl-auto=update`.

## Arranque

```bash
# Linux/Mac
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run