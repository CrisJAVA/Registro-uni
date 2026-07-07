# Sistema de Registro y Admisión - Universidad Nacional del Pacífico

Sistema web para la gestión del proceso de admisión de postulantes a la Universidad Nacional del Pacífico. Permite la validación de pagos bancarios, el registro de postulantes, la gestión administrativa y la generación de reportes.

---

## Descripción del Proyecto

La aplicación está compuesta por un backend en **Spring Boot** y un frontend en **HTML, CSS y JavaScript vanilla**. El sistema sigue el siguiente flujo:

1. El postulante ingresa sus datos de pago bancario (código de verificación y número de movimiento).
2. Si el pago es válido, completa su registro con datos personales, selección de área y carrera.
3. Un administrador accede al panel para gestionar los postulantes: ver, editar, eliminar y exportar reportes.

Los datos de pago provienen de la base de datos, cargados inicialmente desde un archivo SQL que contiene registros reales del Banco de la Nación.

---

## Requisitos

| Componente | Versión requerida |
|------------|-------------------|
| Java JDK | 21 o superior |
| Maven | 3.8 o superior |
| PostgreSQL | 12 o superior |
| Navegador web | Chrome, Firefox o Edge (actualizado) |

No se requiere instalar Node.js ni ningún otro herramienta adicional.

---

## Instalación y Ejecución

### 1. Crear la base de datos

Conéctate a PostgreSQL y ejecuta:

```sql
CREATE DATABASE registro_uni;
```

### 2. Cargar los datos iniciales

Ejecuta el script SQL incluido en el proyecto:

```
BDD/registro_uni.sql
```

Este archivo crea las tablas necesarias e inserta los datos iniciales: áreas, carreras, proceso de admisión, administrador y registros de pagos.

> Si prefieres que las tablas se creen automáticamente al iniciar el backend, puedes omitir la creación de tablas del script y ejecutar únicamente los `INSERT`. Sin embargo, se recomienda ejecutar el script completo para garantizar la integridad de los datos.

### 3. Configurar la conexión a PostgreSQL

Abre el archivo `backend/src/main/resources/application.yml` y verifica las credenciales:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/registro_uni
    username: postgres
    password: 180706
```

### 4. Ejecutar el backend

Desde la carpeta `backend/`:

```bash
mvn clean install
mvn spring-boot:run
```

El servidor estará disponible en `http://localhost:8080`.

### 5. Ejecutar el frontend

Desde la raíz del proyecto, ejecuta un servidor local:

```bash
npx serve .
```

Luego accede a `http://localhost:3000/html/index.html`.

> Asegúrate de que el backend esté ejecutándose antes de abrir el frontend.

---

## Credenciales de Prueba

| Campo | Valor |
|-------|-------|
| **Usuario** | `admin` |
| **Contraseña** | `123456` |

Estas credenciales se crean automáticamente al iniciar el backend por primera vez. Se utilizan para acceder al panel de administración desde `login.html`.

---

## Datos para Realizar Pruebas

El proyecto incluye **20 registros de pagos** en la tabla `pagos`, cargados mediante el archivo SQL incluido en el repositorio. Estos datos corresponden a pagos reales del Banco de la Nación y se utilizan para probar el flujo de validación de pago.

Para probar la validación del pago durante el proceso de inscripción, utiliza los siguientes datos:

| Campo | Valor |
|-------|-------|
| **Código de Verificación** | `20173423` |
| **Número de Movimiento** | `626242` |

Estos datos se ingresasen en la página de admisión (`admision.html`) y permiten avanzar al formulario de registro del postulante.

---

## Funcionalidades Implementadas

### Flujo del Postulante
- Validación de pago bancario contra la base de datos.
- Registro de postulante con datos personales completos.
- Selección dinámica de departamento, provincia y distrito (con datos de Lima, Arequipa, La Libertad e Ica).
- Selección de área y carrera de postulación.
- Validación de DNI con exactamente 8 dígitos numéricos.

### Panel de Administración
- Inicio de sesión seguro con autenticación JWT.
- Listado de todos los postulantes registrados.
- Búsqueda por nombre, DNI, área y carrera.
- Visualización detallada de cada postulante.
- Edición de datos de postulantes.
- Eliminación de postulantes con confirmación.
- Exportación de reportes en CSV, Excel y PDF.
- Estadísticas: total de postulantes, carreras y áreas.

---

## Observaciones

- La base de datos utilizada es **PostgreSQL**.
- Los datos iniciales (áreas, carreras, administrador y pagos) se cargan mediante el archivo `BDD/registro_uni.sql` incluido en el repositorio.
- Las tablas se crean automáticamente al iniciar el backend gracias a la configuración `ddl-auto: update`.
- El backend expone una API REST en el puerto `8080`.
- El frontend es una aplicación estática que se comunica con el backend mediante llamadas HTTP.

---

## Licencia

Este proyecto es de uso académico. Universidad Nacional del Pacífico - 2024.
