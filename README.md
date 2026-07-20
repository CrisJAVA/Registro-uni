# Sistema de Admisión - Universidad Nacional del Pacífico

Sistema web para la gestión del proceso de admisión universitaria, incluyendo registro de postulantes, verificación de pagos, gestión de documentos y panel de administración.

## Tecnologías

| Componente | Tecnología |
|------------|-----------|
| Backend | Java 21 + Spring Boot 3.3.4 |
| Frontend | HTML5, CSS3 (Tailwind CSS v4), JavaScript Vanilla |
| Base de datos | PostgreSQL |
| Seguridad | Spring Security + JWT (jjwt 0.12.6) |
| Reportes | Apache POI 5.3.0 (Excel), iText 2.1.7 (PDF), CSV |
| Documentos | Apache POI (plantilla Word) |
| Build | Maven + npm (CSS) |

## Estructura del Proyecto

```
Registro-uni/
├── backend/                          # Spring Boot
│   ├── pom.xml
│   └── src/main/java/com/unp/
│       ├── config/
│       │   ├── CorsConfig.java       # Configuración CORS
│       │   └── DataInitializer.java  # Datos semilla
│       ├── security/
│       │   ├── SecurityConfig.java   # Cadena de filtros Spring Security
│       │   ├── JwtTokenProvider.java # Generación/validación JWT
│       │   ├── JwtAuthenticationFilter.java # Filtro JWT
│       │   ├── CustomUserDetailsService.java # Carga de usuarios
│       │   ├── AdminPrincipal.java   # UserDetails para admin
│       │   └── EstudiantePrincipal.java # UserDetails para estudiante
│       ├── entity/
│       │   ├── Administrador.java    # admins
│       │   ├── UsuarioEstudiante.java # usuarios_estudiantes
│       │   ├── Postulante.java       # postulantes
│       │   ├── Area.java             # areas
│       │   ├── Carrera.java          # carreras
│       │   ├── Pago.java             # pagos
│       │   ├── ProcesoAdmision.java  # procesos_admision
│       │   └── DocumentoEstudiante.java # documentos_estudiante
│       ├── repository/
│       ├── dto/
│       ├── service/
│       ├── controller/
│       └── exception/
├── html/           # Plantillas HTML
├── js/             # JavaScript
├── css/            # Estilos Tailwind
├── BDD/            # Scripts SQL
└── Doc/            # Documentos
```

## Instalación y Ejecución

### Requisitos

- Java 21+
- Maven 3.9+
- PostgreSQL 15+
- Node.js 18+ (solo para build de CSS)

### Base de Datos

1. Crear la base de datos:
```sql
CREATE DATABASE registro_uni;
```

2. Las tablas se crean automáticamente con `ddl-auto: update`. Si se desea crear manualmente:

```sql
-- Ejecutar BDD/registro_uni.sql (adaptado)
```

### Configuración

Editar `backend/src/main/resources/application.yml`:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/registro_uni
    username: postgres
    password: tu_password
```

### Ejecutar

```powershell
# Iniciar backend (puerto 8080)
cd backend
mvn spring-boot:run

# Build CSS (opcional)
npm run build:css
```

O usando el script:
```powershell
.\iniciar.bat
```

### Acceso

| URL | Descripción |
|-----|-------------|
| `http://localhost:8080/html/index.html` | Landing page |
| `http://localhost:8080/html/admision.html` | Portal del postulante |
| `http://localhost:8080/html/login.html` | Login administrador |
| `http://localhost:8080/html/login-estudiante.html` | Login estudiante |
| `http://localhost:8080/html/admin.html` | Panel administración |
| `http://localhost:8080/html/estudiante.html` | Perfil estudiante |

## Credenciales de Prueba

### Administrador
- **Usuario:** `admin`
- **Contraseña:** `123456`

### Estudiante (registrarse desde el portal del postulante)
- Registrarse en `/html/admision.html` con un pago válido:
  - Código: `20174630`
  - Número de movimiento: `626235`
- Las credenciales iniciales son el DNI (8 dígitos) como usuario y contraseña.
- En el primer inicio de sesión, el sistema obliga a cambiar la contraseña.

## Flujo de Autenticación

### Administrador
1. Ingresa a `/html/login.html`
2. Envía `POST /api/auth/login` con `{ username, password }`
3. Backend valida contra BCrypt y genera JWT (24h)
4. Frontend almacena token en `localStorage['token']` y redirige a `admin.html`

### Estudiante
1. Se registra desde `/html/admision.html` (verificación de pago + formulario)
2. Recibe credenciales: DNI como usuario y contraseña
3. Ingresa a `/html/login-estudiante.html`
4. Envía `POST /api/auth/login-estudiante` con `{ username: DNI, password }`
5. Backend valida contra BCrypt y genera JWT (24h)
6. Frontend almacena token en `localStorage['estudianteToken']`
7. Si `debeCambiarPassword = true`, se muestra modal de cambio de contraseña
8. El cambio de contraseña llama a `PUT /api/auth/estudiante/cambiar-password`

### Cierre de sesión
- Se eliminan los tokens del `localStorage` y se redirige al login.

## API Endpoints

### Autenticación
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/auth/login` | Público | Login administrador |
| POST | `/api/auth/login-estudiante` | Público | Login estudiante |
| GET | `/api/auth/estudiante/perfil` | Autenticado | Perfil del estudiante |
| PUT | `/api/auth/estudiante/cambiar-password` | Estudiante | Cambiar contraseña |

### Postulantes
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/postulantes/registrar` | Público | Registrar postulante |
| GET | `/api/postulantes` | Admin | Listar postulantes |
| GET | `/api/postulantes/{id}` | Admin | Obtener postulante |
| PUT | `/api/postulantes/{id}` | Admin | Actualizar postulante |
| DELETE | `/api/postulantes/{id}` | Admin | Eliminar postulante |

### Áreas y Carreras
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/areas` | Público | Listar áreas |
| GET | `/api/carreras?areaId=` | Público | Listar carreras |

### Pagos
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| POST | `/api/pagos/verificar` | Público | Verificar pago |

### Documentos (Estudiante)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/documentos/plantilla` | Estudiante | Descargar plantilla Word |
| POST | `/api/documentos/subir` | Estudiante | Subir documento |
| GET | `/api/documentos/mis-documentos` | Estudiante | Listar documentos |
| GET | `/api/documentos/{id}/descargar` | Estudiante | Descargar documento |
| DELETE | `/api/documentos/{id}` | Estudiante | Eliminar/reemplazar |

### Documentos (Admin)
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/admin/documentos` | Admin | Listar todos |
| GET | `/api/admin/documentos/estudiante/{id}` | Admin | Documentos de estudiante |
| PUT | `/api/admin/documentos/{id}/estado` | Admin | Cambiar estado |
| GET | `/api/admin/documentos/{id}/descargar` | Admin | Descargar documento |

### Reportes
| Método | Ruta | Acceso | Descripción |
|--------|------|--------|-------------|
| GET | `/api/reportes/csv` | Admin | Exportar CSV |
| GET | `/api/reportes/excel` | Admin | Exportar Excel |
| GET | `/api/reportes/pdf` | Admin | Exportar PDF |

## Seguridad

- **Contraseñas:** Almacenadas con BCrypt, nunca en texto plano.
- **JWT:** Tokens con expiración de 24 horas, firmados con HMAC-SHA.
- **Roles:** `ROLE_ADMIN` y `ROLE_ESTUDIANTE` diferenciados en UserDetails.
- **Protección de rutas:** Endpoints admin verifican `AdminPrincipal` explícitamente.
- **Documentos:** Estudiantes solo ven sus propios archivos (filtro por postulanteId).
- **CORS:** Configurado para permitir orígenes locales.

## Solución de Errores Frecuentes

### Error: `relation "documentos_estudiante" does not exist`
Ejecutar:
```sql
CREATE TABLE documentos_estudiante (
    id BIGSERIAL PRIMARY KEY,
    postulante_id BIGINT NOT NULL REFERENCES postulantes(id),
    nombre_original VARCHAR(255) NOT NULL,
    nombre_almacenado VARCHAR(255) NOT NULL,
    tipo_archivo VARCHAR(50) NOT NULL,
    tamano BIGINT NOT NULL,
    tipo_documento VARCHAR(20) NOT NULL,
    estado VARCHAR(20) NOT NULL DEFAULT 'PENDIENTE',
    observacion TEXT,
    fecha_subida TIMESTAMP NOT NULL,
    fecha_revision TIMESTAMP,
    revisado_por BIGINT REFERENCES admins(id)
);
CREATE INDEX idx_doc_postulante ON documentos_estudiante(postulante_id);
```

### Error: `Failed to bind properties under 'spring.servlet.multipart'`
Verificar que no haya duplicados de `spring:` en `application.yml`.

### Error 401/403 en peticiones
- Verificar que el token JWT no haya expirado (24h).
- Verificar que el token se envíe en header `Authorization: Bearer <token>`.
- Verificar que el estudiante esté activo (`activo = true`).

### Error: La contraseña nueva no se guarda
**Causa:** Versión anterior del código donde `changePassword()` solo trabajaba en cliente.
**Solución:** Asegurar que `PUT /api/auth/estudiante/cambiar-password` tenga el body:
```json
{
  "passwordActual": "contraseña_anterior",
  "nuevaPassword": "nueva_contraseña"
}
```

## Historial de Correcciones

### 2026-07-19
- **CRÍTICO:** Implementado endpoint `PUT /api/auth/estudiante/cambiar-password` para persistir el cambio de contraseña en BD con BCrypt.
- **CRÍTICO:** Corregido `changePassword()` en `estudiante.js` para consumir el endpoint real.
- **ALTO:** Agregada verificación de rol admin en `PostulanteController` y `ReporteController`.
- **MEDIO:** Eliminados imports no usados en `DocumentoService`.
- **BAJO:** Eliminada propiedad `format_sql` duplicada en `application.yml`.
- **MEDIO:** Corregido placeholder engañoso en `login-estudiante.html`.
