-- Crear base de datos
CREATE DATABASE registro_uni;

-- Conectarse a la base de datos

-- Tabla: areas
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(10) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla: carreras
CREATE TABLE carreras (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    area_id BIGINT,
    FOREIGN KEY (area_id) REFERENCES areas(id)
);

-- Tabla: admins
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password TEXT NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL
);

-- Tabla: procesos_admision
CREATE TABLE procesos_admision (
    id SERIAL PRIMARY KEY,
    anio VARCHAR(4) NOT NULL,
    periodo VARCHAR(50) NOT NULL,
    fecha_inicio DATE,
    fecha_fin DATE,
    estado VARCHAR(20) NOT NULL
);

-- Tabla: postulantes
CREATE TABLE postulantes (
    id SERIAL PRIMARY KEY,
    tipo_documento VARCHAR(30),
    numero_documento VARCHAR(20),
    nombres VARCHAR(100),
    apellidos VARCHAR(100),
    fecha_nacimiento DATE,
    sexo VARCHAR(10),
    email VARCHAR(150),
    telefono VARCHAR(15),
    direccion VARCHAR(255),
    departamento VARCHAR(100),
    provincia VARCHAR(100),
    distrito VARCHAR(100),
    tipo_colegio VARCHAR(50),
    area_id BIGINT,
    carrera_id BIGINT,
    fecha_registro DATE,
    FOREIGN KEY (area_id) REFERENCES areas(id),
    FOREIGN KEY (carrera_id) REFERENCES carreras(id)
);
CREATE TABLE pagos (
    id SERIAL PRIMARY KEY,
    nombre_cliente VARCHAR(255) NOT NULL,
    codigo VARCHAR(20) NOT NULL,
    descripcion_pago VARCHAR(255) NOT NULL,
    importe_pagar DECIMAL(10,2) NOT NULL,
    importe_pagado DECIMAL(10,2) NOT NULL,
    oficina VARCHAR(10),
    numero_movimiento VARCHAR(20) NOT NULL UNIQUE,
    fecha_pago TIMESTAMP NOT NULL,
    fecha_proceso DATE NOT NULL,
    forma_pago VARCHAR(10),
    canal VARCHAR(10)
);

INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('MUNOA AVALOS ANA ELIZABETH', '20173423', '051 CARTA PRESENTACION 2 FAC. DE.CCPP', 15.0, 15.0, '7799', '626242', '2023-12-18 23:11:23', '2023-12-19', '02', '04');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('JOYO CASAVILCA KELLY BRIGGITH', '20174630', '029 CONSTA. LABO. INTERNO FAC. FAR.BIQ', 15.0, 16.5, '0817', '626235', '2023-12-18 20:25:20', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('JOYO CASAVILCA KELLY BRIGGITH', '20174630', '030 CONST. LABO. EXTERNO FAC. FAR.BIQ', 15.0, 16.5, '0817', '626234', '2023-12-18 20:24:25', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('JOYO CASAVILCA KELLY BRIGGITH', '20174630', '034 CONST. NO ADEU LIBR UNI FAC. FAR.BIQ', 15.0, 16.5, '0817', '626233', '2023-12-18 20:23:39', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('JOYO CASAVILCA KELLY BRIGGITH', '20174630', '027 CONST. INGRESO UNICA FAC. FAR.BIQ', 25.0, 26.5, '0817', '626232', '2023-12-18 20:22:47', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('JOYO CASAVILCA KELLY BRIGGITH', '20174630', '032 CONST. NO ADEU DINE UNI FAC. FAR.BIQ', 15.0, 16.5, '0817', '626231', '2023-12-18 20:22:03', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '040 CONST. 1RA MAT. SUNEDU FAC. ENFRIA.', 15.0, 16.5, '0817', '626230', '2023-12-18 20:18:15', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '024 CONSTANCIA EGRESADO FAC. ENFRIA.', 20.0, 21.5, '0817', '626229', '2023-12-18 20:17:18', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '722 CONSTANCIA CREDITAJE FAC. ENFRIA.', 15.0, 16.5, '0817', '626227', '2023-12-18 20:14:49', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '028 CONST. INSC. LIBR. ING. FAC. ENFRIA.', 15.0, 16.5, '0817', '626226', '2023-12-18 20:13:48', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '049 CERTIFICADO ESTUDIOS FAC. ENFRIA.', 50.0, 51.5, '0817', '626225', '2023-12-18 20:12:51', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '064 DERECHO CUADERNILLO FAC. ENFRIA.', 20.0, 21.5, '0817', '626223', '2023-12-18 20:11:51', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '030 CONST. LABO. EXTERNO FAC. ENFRIA.', 15.0, 16.5, '0817', '626221', '2023-12-18 20:10:44', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ALVAREZ GUERRA GIANELLA TIFFAN', '20150767', '029 CONSTA. LABO. INTERNO FAC. ENFRIA.', 15.0, 16.5, '0817', '626220', '2023-12-18 20:09:35', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('RODRIGUEZ ALARCON SUAMY KAREL', '20186092', '051 CARTA PRESENTACION 2 FAC. DE.CCPP', 15.0, 16.5, '0817', '626218', '2023-12-18 20:05:59', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('BERNAOLA ROMUCHO ZIRTAED ALIAN', '20172129', '079 ENV REG A LIMA SUNEDU FAC. EDUCAC.', 15.0, 16.5, '0817', '626204', '2023-12-18 19:37:00', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('BERNAOLA ROMUCHO ZIRTAED ALIAN', '20172129', '069 CERTIF. DIPLOMA COPIA FAC. EDUCAC.', 5.0, 6.5, '0817', '626203', '2023-12-18 19:35:59', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('BERNAOLA ROMUCHO ZIRTAED ALIAN', '20172129', '065 DERECHO CALIGRAFIADO FAC. EDUCAC.', 20.0, 21.5, '0817', '626201', '2023-12-18 19:35:00', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('BERNAOLA ROMUCHO ZIRTAED ALIAN', '20172129', '064 DERECHO CUADERNILLO FAC. EDUCAC.', 20.0, 21.5, '0817', '626198', '2023-12-18 19:34:02', '2023-12-18', '01', '06');
INSERT INTO pagos (nombre_cliente, codigo, descripcion_pago, importe_pagar, importe_pagado, oficina, numero_movimiento, fecha_pago, fecha_proceso, forma_pago, canal) VALUES ('ITO YARMAS LUIS ALBERTO', '20190860', '051 CARTA PRESENTACION 2 FAC. CONTAB.', 15.0, 16.5, '0817', '626196', '2023-12-18 19:30:25', '2023-12-18', '01', '06');