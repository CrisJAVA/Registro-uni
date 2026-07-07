# Sistema de Registro y Admisión - Universidad Nacional del Pacífico

Sistema web completo para la gestión del proceso de admisión de postulantes a la Universidad Nacional del Pacífico. Permite la validación de pagos, registro de postulantes, gestión administrativa y generación de reportes.

---

## Tecnologías Utilizadas

### Backend
- **Java 21**
- **Spring Boot 3.3.4**
- **Spring Security** con autenticación JWT
- **Spring Data JPA** + Hibernate
- **PostgreSQL** como base de datos
- **Lombok** para reducir código boilerplate
- **Apache POI** para exportación a Excel
- **iText** para exportación a PDF
- **Maven** como gestor de dependencias

### Frontend
- **HTML5**
- **CSS3** con **Tailwind CSS** (vía CDN)
- **JavaScript** vanilla (ES6+)
- **Google Fonts** (Inter)
- **Material Symbols** (iconos)

---

## Requisitos Previos

- **Java JDK 21** o superior
- **Maven 3.8+**
- **PostgreSQL 12+**
- **Navegador web** moderno (Chrome, Firefox, Edge)
- Un editor de código (VS Code, IntelliJ IDEA, etc.)

---

## Instalación del Backend

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu-usuario/Registro-uni.git
cd Registro-uni/backend
```

### 2. Compilar el proyecto

```bash
mvn clean install
```

### 3. Ejecutar el backend

```bash
mvn spring-boot:run
```

El servidor arrancará en `http://localhost:8080`.

---

## Instalación del Frontend

El frontend no requiere instalación. Es un sitio estático que se abre directamente en el navegador.

### Opción 1: Abrir directamente

Navega a la carpeta `html/` y abre `index.html` en tu navegador.

### Opción 2: Usar un servidor local (recomendado)

```bash
# Desde la raíz del proyecto
npx serve .
# o
python -m http.server 3000
```

Luego accede a `http://localhost:3000/html/index.html`.

---

## Configuración de la Base de Datos PostgreSQL

### 1. Crear la base de datos

Conéctate a PostgreSQL y ejecuta:

```sql
CREATE DATABASE registro_uni;
```

### 2. Configurar credenciales

Edita el archivo `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/registro_uni
    username: postgres
    password: postgres
```

> **Nota:** Las tablas se crean automáticamente al iniciar el backend gracias a `ddl-auto: update`.

---

## Variables y Archivos de Configuración

| Archivo | Variable | Descripción | Valor por defecto |
|---------|----------|-------------|-------------------|
| `application.yml` | `server.port` | Puerto del backend | `8080` |
| `application.yml` | `spring.datasource.url` | URL de PostgreSQL | `jdbc:postgresql://localhost:5432/registro_uni` |
| `application.yml` | `spring.datasource.username` | Usuario de PostgreSQL | `postgres` |
| `application.yml` | `spring.datasource.password` | Contraseña de PostgreSQL | `postgres` |
| `application.yml` | `app.jwt.secret` | Secreto para JWT (Base64) | *(definido en el archivo)* |
| `application.yml` | `app.jwt.expiration-ms` | Expiración del token JWT | `86400000` (24h) |
| `js/api.js` | `API_BASE` | URL base del backend API | `http://localhost:8080` |

---

## Cómo Ejecutar el Backend

```bash
cd backend
mvn spring-boot:run
```

El backend estará disponible en `http://localhost:8080`.

### Verificar funcionamiento

```bash
curl http://localhost:8080/api/areas
```

Debería retornar un JSON con las áreas pre-cargadas.

---

## Cómo Ejecutar el Frontend

```bash
# Desde la raíz del proyecto
npx serve .
```

Accede a `http://localhost:3000/html/index.html`.

> **Importante:** Asegúrate de que el backend esté ejecutándose en `http://localhost:8080` antes de usar el frontend.

---

## Credenciales de Prueba del Administrador

| Campo | Valor |
|-------|-------|
| **Usuario** | `admin` |
| **Contraseña** | `123456` |

Estas credenciales se crean automáticamente al iniciar el backend por primera vez.

---

## Estructura del Proyecto

```
Registro-uni/
├── backend/
│   ├── src/main/java/com/unp/
│   │   ├── UnpApplication.java          # Clase principal de Spring Boot
│   │   ├── config/
│   │   │   ├── CorsConfig.java          # Configuración CORS
│   │   │   └── DataInitializer.java     # Datos iniciales (admin, áreas, carreras)
│   │   ├── controller/
│   │   │   ├── AuthController.java      # Endpoint de autenticación
│   │   │   ├── PostulanteController.java # CRUD de postulantes
│   │   │   ├── PagoController.java      # Validación de pagos
│   │   │   ├── CarreraController.java   # Listado de carreras
│   │   │   ├── AreaController.java      # Listado de áreas
│   │   │   └── ReporteController.java   # Exportación de reportes
│   │   ├── dto/                         # Data Transfer Objects
│   │   ├── entity/                      # Entidades JPA
│   │   ├── exception/                   # Manejador de excepciones
│   │   ├── repository/                  # Repositorios JPA
│   │   ├── security/                    # Seguridad JWT
│   │   └── service/                     # Lógica de negocio
│   ├── src/main/resources/
│   │   └── application.yml              # Configuración de la aplicación
│   └── pom.xml                          # Dependencias Maven
├── html/
│   ├── index.html                       # Página principal
│   ├── login.html                       # Login de administrador
│   ├── admision.html                    # Validación de pago
│   ├── registro.html                    # Registro del postulante
│   └── admin.html                       # Panel de administración
├── js/
│   ├── api.js                           # Configuración y utilidades API
│   ├── script.js                        # Animaciones de la página principal
│   ├── login.js                         # Lógica de login
│   ├── admision.js                      # Lógica de validación de pago
│   ├── registro.js                      # Lógica de registro
│   └── admin.js                         # Lógica del panel admin
├── css/
│   └── style.css                        # Estilos personalizados
└── README.md
```

---

## Principales Funcionalidades

### Flujo del Postulante
1. **Validación de Pago** - El postulante ingresa su número de operación bancaria para verificar su pago de derecho de admisión.
2. **Registro** - Completa sus datos personales, selecciona área y carrera de postulación.

### Panel de Administración
1. **Login seguro** - Autenticación con JWT para administradores.
2. **Listado de postulantes** - Tabla con todos los postulantes registrados.
3. **Búsqueda y filtrado** - Por nombre, DNI, área y carrera.
4. **Detalle de postulante** - Vista completa de la información.
5. **Edición** - Modificar datos de cualquier postulante.
6. **Eliminación** - Borrar postulantes con confirmación.
7. **Reportes** - Descarga en CSV, Excel y PDF.
8. **Estadísticas** - Total de postulantes, carreras y áreas.

### API REST Endpoints

| Método | Ruta | Descripción | Auth |
|--------|------|-------------|------|
| `POST` | `/api/auth/login` | Iniciar sesión | No |
| `POST` | `/api/pagos/validar` | Validar pago | No |
| `POST` | `/api/postulantes/registrar` | Registrar postulante | No |
| `GET` | `/api/postulantes` | Listar/buscar postulantes | Sí |
| `GET` | `/api/postulantes/{id}` | Obtener postulante | Sí |
| `PUT` | `/api/postulantes/{id}` | Actualizar postulante | Sí |
| `DELETE` | `/api/postulantes/{id}` | Eliminar postulante | Sí |
| `GET` | `/api/areas` | Listar áreas | No |
| `GET` | `/api/carreras` | Listar carreras | No |
| `GET` | `/api/reportes/csv` | Exportar CSV | Sí |
| `GET` | `/api/reportes/excel` | Exportar Excel | Sí |
| `GET` | `/api/reportes/pdf` | Exportar PDF | Sí |

---

## Capturas de Pantura

<!-- Agregar capturas de pantalla aquí -->

### Página Principal
![Página Principal](screenshots/index.png)

### Login de Administrador
![Login](screenshots/login.png)

### Validación de Pago
![Validación de Pago](screenshots/admision.png)

### Registro del Postulante
![Registro](screenshots/registro.png)

### Panel de Administración
![Panel Admin](screenshots/admin.png)

---

## Licencia

Este proyecto es de uso académico. Universidad Nacional del Pacífico - 2024.
