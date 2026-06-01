# Documentacion general del proyecto APITIEMPOS

## 1. Descripcion del proyecto

APITIEMPOS es una aplicacion para controlar el tiempo de uso de aplicaciones moviles. El sistema permite registrar usuarios, grupos, dispositivos, aplicaciones instaladas, restricciones de tiempo, uso diario y solicitudes para pedir tiempo adicional.

Este proyecto esta pensado para una implementacion universitaria, por lo que se prioriza una estructura sencilla, facil de entender y rapida de poner en funcionamiento.

La aplicacion general se divide en tres partes:

- Base de datos MySQL: guarda toda la informacion principal.
- API REST con Node.js y Express: permite crear, consultar, actualizar y eliminar datos.
- Cliente movil o frontend: consume la API para mostrar y administrar la informacion.

## 2. Objetivo general

Crear un sistema basico de control de tiempo de aplicaciones donde un usuario pueda pertenecer a grupos, registrar sus dispositivos, asociar aplicaciones y tener restricciones de tiempo diario.

## 3. Alcance del sistema

El sistema permite:

- Registrar usuarios.
- Crear grupos.
- Agregar miembros a grupos.
- Registrar aplicaciones.
- Registrar dispositivos de usuarios.
- Crear restricciones de tiempo por aplicacion.
- Registrar uso diario de una aplicacion.
- Solicitar tiempo adicional.
- Consultar el tiempo disponible de una restriccion.

El sistema no incluye en esta version:

- Inicio de sesion con JWT.
- Hash real de contrasenas.
- Subida de audios o imagenes.
- Bloqueo real de aplicaciones Android.
- Notificaciones push.
- Panel visual frontend.

Estas funcionalidades pueden agregarse despues si el proyecto crece.

## 4. Tecnologias utilizadas

- Node.js: entorno para ejecutar JavaScript en el servidor.
- Express: framework para crear la API.
- MySQL: base de datos relacional.
- mysql2: libreria para conectar Node.js con MySQL.
- dotenv: manejo de variables de entorno.
- cors: permite peticiones desde otros clientes.
- nodemon: reinicia el servidor automaticamente durante desarrollo.

## 5. Estructura del proyecto

```txt
APITIEMPOS/
├── sql/
│   └── schema_simple.sql
├── src/
│   ├── crudRouter.js
│   ├── db.js
│   └── server.js
├── .env.example
├── package.json
├── README.md
└── DOCUMENTACION.md
```

Descripcion de archivos:

- `sql/schema_simple.sql`: script para crear la base de datos en MySQL Workbench.
- `src/db.js`: configura la conexion con MySQL.
- `src/crudRouter.js`: contiene la logica CRUD generica.
- `src/server.js`: configura Express y registra las rutas.
- `.env.example`: ejemplo de variables de entorno.
- `package.json`: dependencias y comandos del proyecto.
- `README.md`: guia rapida de instalacion.
- `DOCUMENTACION.md`: documentacion general del sistema.

## 6. Modelo de base de datos simplificado

La base de datos se llama:

```txt
control_tiempo_apps
```

### 6.1 Tabla usuarios

Guarda los datos principales de cada usuario.

Campos principales:

- `id`: identificador unico.
- `nombre`: nombre del usuario.
- `email`: correo unico.
- `password`: contrasena o hash.
- `estado`: ACTIVO o INACTIVO.
- `creado_en`: fecha de creacion.

Ejemplo:

```json
{
  "nombre": "Ana Lopez",
  "email": "ana@mail.com",
  "password": "123456"
}
```

### 6.2 Tabla grupos

Representa grupos donde los usuarios pueden controlar o compartir restricciones.

Campos principales:

- `id`: identificador unico.
- `nombre`: nombre del grupo.
- `descripcion`: descripcion opcional.
- `creado_por`: usuario que creo el grupo.
- `creado_en`: fecha de creacion.

Ejemplo:

```json
{
  "nombre": "Familia",
  "descripcion": "Grupo familiar",
  "creado_por": 1
}
```

### 6.3 Tabla grupo_miembros

Relaciona usuarios con grupos.

Campos principales:

- `id`: identificador unico.
- `grupo_id`: grupo al que pertenece.
- `usuario_id`: usuario miembro.
- `rol`: ADMIN o MIEMBRO.

Ejemplo:

```json
{
  "grupo_id": 1,
  "usuario_id": 2,
  "rol": "MIEMBRO"
}
```

### 6.4 Tabla aplicaciones

Guarda las aplicaciones que podran tener restricciones.

Campos principales:

- `id`: identificador unico.
- `nombre`: nombre visible de la app.
- `paquete`: package name de Android.

Ejemplo:

```json
{
  "nombre": "TikTok",
  "paquete": "com.zhiliaoapp.musically"
}
```

### 6.5 Tabla dispositivos

Registra los dispositivos asociados a usuarios.

Campos principales:

- `id`: identificador unico.
- `usuario_id`: usuario dueno del dispositivo.
- `nombre`: nombre del dispositivo.
- `modelo`: modelo del equipo.

Ejemplo:

```json
{
  "usuario_id": 1,
  "nombre": "Telefono de Ana",
  "modelo": "Samsung A54"
}
```

### 6.6 Tabla restricciones

Define el limite diario de tiempo para una aplicacion.

Campos principales:

- `id`: identificador unico.
- `grupo_id`: grupo donde se crea la restriccion.
- `usuario_id`: usuario al que se aplica.
- `aplicacion_id`: aplicacion restringida.
- `limite_diario_minutos`: limite en minutos.
- `estado`: ACTIVA, PAUSADA o CANCELADA.

Ejemplo:

```json
{
  "grupo_id": 1,
  "usuario_id": 2,
  "aplicacion_id": 1,
  "limite_diario_minutos": 60
}
```

### 6.7 Tabla uso_diario

Guarda el tiempo usado por usuario, aplicacion y fecha.

Campos principales:

- `id`: identificador unico.
- `usuario_id`: usuario que uso la app.
- `aplicacion_id`: aplicacion usada.
- `fecha`: dia del registro.
- `minutos_usados`: tiempo usado en minutos.

Ejemplo:

```json
{
  "usuario_id": 2,
  "aplicacion_id": 1,
  "fecha": "2026-06-01",
  "minutos_usados": 25
}
```

### 6.8 Tabla solicitudes_tiempo

Permite solicitar mas tiempo para una restriccion.

Campos principales:

- `id`: identificador unico.
- `restriccion_id`: restriccion relacionada.
- `usuario_id`: usuario que solicita tiempo.
- `minutos_solicitados`: cantidad solicitada.
- `mensaje`: justificacion.
- `estado`: PENDIENTE, APROBADA o RECHAZADA.

Ejemplo:

```json
{
  "restriccion_id": 1,
  "usuario_id": 2,
  "minutos_solicitados": 30,
  "mensaje": "Necesito terminar una tarea."
}
```

## 7. Flujo general de uso

Un flujo basico para probar el sistema seria:

1. Crear un usuario administrador.
2. Crear otro usuario miembro.
3. Crear un grupo usando el usuario administrador.
4. Agregar ambos usuarios al grupo.
5. Crear una aplicacion.
6. Registrar un dispositivo para el usuario miembro.
7. Crear una restriccion para esa aplicacion.
8. Registrar el uso diario.
9. Consultar el tiempo disponible.
10. Crear una solicitud de tiempo adicional.
11. Actualizar la solicitud como APROBADA o RECHAZADA.

## 8. Instalacion del proyecto

### 8.1 Requisitos previos

Instalar:

- Node.js.
- MySQL Server.
- MySQL Workbench.
- Postman, Insomnia o Thunder Client para probar la API.

### 8.2 Instalar dependencias

Ejecutar:

```bash
npm install
```

### 8.3 Crear la base de datos

Abrir MySQL Workbench y ejecutar el script:

```txt
sql/schema_simple.sql
```

### 8.4 Configurar variables de entorno

Crear un archivo `.env` tomando como base `.env.example`:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=control_tiempo_apps
```

### 8.5 Ejecutar servidor

Modo desarrollo:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Servidor local:

```txt
http://localhost:3000
```

## 9. Endpoints disponibles

Todos los recursos tienen el mismo CRUD basico.

```txt
GET    /api/recurso
GET    /api/recurso/:id
POST   /api/recurso
PUT    /api/recurso/:id
DELETE /api/recurso/:id
```

Recursos:

```txt
/api/usuarios
/api/grupos
/api/grupo-miembros
/api/aplicaciones
/api/dispositivos
/api/restricciones
/api/uso-diario
/api/solicitudes-tiempo
```

## 10. Ejemplos de peticiones

### 10.1 Crear usuario

```http
POST http://localhost:3000/api/usuarios
Content-Type: application/json
```

```json
{
  "nombre": "Ana Lopez",
  "email": "ana@mail.com",
  "password": "123456"
}
```

### 10.2 Listar usuarios

```http
GET http://localhost:3000/api/usuarios
```

### 10.3 Obtener usuario por id

```http
GET http://localhost:3000/api/usuarios/1
```

### 10.4 Actualizar usuario

```http
PUT http://localhost:3000/api/usuarios/1
Content-Type: application/json
```

```json
{
  "nombre": "Ana Maria Lopez",
  "estado": "ACTIVO"
}
```

### 10.5 Eliminar usuario

```http
DELETE http://localhost:3000/api/usuarios/1
```

### 10.6 Crear grupo

```http
POST http://localhost:3000/api/grupos
Content-Type: application/json
```

```json
{
  "nombre": "Familia",
  "descripcion": "Grupo familiar",
  "creado_por": 1
}
```

### 10.7 Agregar miembro a grupo

```http
POST http://localhost:3000/api/grupo-miembros
Content-Type: application/json
```

```json
{
  "grupo_id": 1,
  "usuario_id": 2,
  "rol": "MIEMBRO"
}
```

### 10.8 Crear aplicacion

```http
POST http://localhost:3000/api/aplicaciones
Content-Type: application/json
```

```json
{
  "nombre": "Instagram",
  "paquete": "com.instagram.android"
}
```

### 10.9 Registrar dispositivo

```http
POST http://localhost:3000/api/dispositivos
Content-Type: application/json
```

```json
{
  "usuario_id": 2,
  "nombre": "Celular de Carlos",
  "modelo": "Motorola G84"
}
```

### 10.10 Crear restriccion

```http
POST http://localhost:3000/api/restricciones
Content-Type: application/json
```

```json
{
  "grupo_id": 1,
  "usuario_id": 2,
  "aplicacion_id": 1,
  "limite_diario_minutos": 60
}
```

### 10.11 Registrar uso diario

```http
POST http://localhost:3000/api/uso-diario
Content-Type: application/json
```

```json
{
  "usuario_id": 2,
  "aplicacion_id": 1,
  "fecha": "2026-06-01",
  "minutos_usados": 20
}
```

### 10.12 Consultar tiempo disponible

```http
GET http://localhost:3000/api/restricciones/1/disponible
```

Respuesta esperada:

```json
{
  "id": 1,
  "limite_diario_minutos": 60,
  "minutos_usados": "20",
  "minutos_disponibles": "40"
}
```

### 10.13 Crear solicitud de tiempo

```http
POST http://localhost:3000/api/solicitudes-tiempo
Content-Type: application/json
```

```json
{
  "restriccion_id": 1,
  "usuario_id": 2,
  "minutos_solicitados": 30,
  "mensaje": "Necesito mas tiempo para terminar una actividad."
}
```

### 10.14 Revisar solicitud

```http
PUT http://localhost:3000/api/solicitudes-tiempo/1
Content-Type: application/json
```

```json
{
  "estado": "APROBADA"
}
```

## 11. Explicacion de la API

La API usa un router CRUD generico ubicado en `src/crudRouter.js`.

Ese archivo recibe:

- El nombre de la tabla.
- Las columnas permitidas para insertar o actualizar.

Ejemplo:

```js
app.use('/api/usuarios', createCrudRouter('usuarios', [
  'nombre',
  'email',
  'password',
  'estado'
]));
```

Esto crea automaticamente las rutas:

```txt
GET /api/usuarios
GET /api/usuarios/:id
POST /api/usuarios
PUT /api/usuarios/:id
DELETE /api/usuarios/:id
```

## 12. Reglas importantes para usar la API

Antes de insertar datos que dependen de otros, se deben crear primero los registros padre.

Orden recomendado:

1. `usuarios`
2. `grupos`
3. `grupo_miembros`
4. `aplicaciones`
5. `dispositivos`
6. `restricciones`
7. `uso_diario`
8. `solicitudes_tiempo`

Por ejemplo, no se puede crear una restriccion si todavia no existe el usuario, el grupo o la aplicacion.

## 13. Guia para crear una aplicacion movil

Una aplicacion Android podria tener estas pantallas:

### 13.1 Pantalla de inicio

Opciones:

- Iniciar sesion.
- Registrarse.

En esta version basica, el login real todavia no existe. Se puede simular seleccionando un usuario creado en la base de datos.

### 13.2 Pantalla principal

Mostrar:

- Nombre del usuario.
- Grupos a los que pertenece.
- Restricciones activas.
- Tiempo restante por aplicacion.

Consumiria:

```txt
GET /api/usuarios/:id
GET /api/restricciones
GET /api/restricciones/:id/disponible
```

### 13.3 Pantalla de aplicaciones

Mostrar aplicaciones registradas y permitir agregar nuevas.

Consumiria:

```txt
GET /api/aplicaciones
POST /api/aplicaciones
PUT /api/aplicaciones/:id
DELETE /api/aplicaciones/:id
```

### 13.4 Pantalla de restricciones

Permite crear y administrar limites diarios.

Consumiria:

```txt
GET /api/restricciones
POST /api/restricciones
PUT /api/restricciones/:id
DELETE /api/restricciones/:id
```

### 13.5 Pantalla de solicitudes

Permite pedir mas tiempo y revisar solicitudes.

Consumiria:

```txt
GET /api/solicitudes-tiempo
POST /api/solicitudes-tiempo
PUT /api/solicitudes-tiempo/:id
```

## 14. Mejoras futuras recomendadas

Para una segunda version del proyecto se pueden agregar:

- Registro e inicio de sesion real.
- Encriptacion de contrasenas con bcrypt.
- Autenticacion con JWT.
- Validaciones mas estrictas con express-validator.
- Rutas separadas por controlador.
- Filtros por usuario, grupo o fecha.
- Historial detallado de sesiones.
- Notificaciones.
- Subida de imagenes o audios.
- Conexion con app Android real.
- Deploy en Railway, Render o VPS.

## 15. Posible arquitectura futura

Si el proyecto crece, la estructura podria cambiar a:

```txt
src/
├── config/
│   └── db.js
├── controllers/
│   ├── usuarios.controller.js
│   └── restricciones.controller.js
├── routes/
│   ├── usuarios.routes.js
│   └── restricciones.routes.js
├── middlewares/
│   └── auth.middleware.js
├── services/
│   └── tiempo.service.js
└── server.js
```

Para esta entrega universitaria se mantiene una estructura mas corta para facilitar la implementacion.

## 16. Pruebas sugeridas para exposicion

Durante la presentacion se puede demostrar:

1. Crear dos usuarios.
2. Crear un grupo.
3. Agregar los usuarios al grupo.
4. Crear una aplicacion.
5. Crear una restriccion de 60 minutos.
6. Registrar 20 minutos de uso.
7. Consultar tiempo disponible.
8. Crear una solicitud de 30 minutos.
9. Aprobar o rechazar la solicitud.

Esto demuestra el flujo principal sin depender de una app Android completa.

## 17. Conclusiones

Este proyecto implementa una API REST sencilla para administrar el control de tiempo de aplicaciones. La base de datos fue simplificada para que pueda ser creada rapidamente en MySQL Workbench y el backend utiliza un CRUD generico para reducir codigo repetido.

La estructura actual es suficiente para una entrega universitaria y tambien sirve como base para agregar autenticacion, frontend, app movil o reglas de negocio mas avanzadas en el futuro.