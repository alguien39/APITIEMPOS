# APITIEMPOS

API basica con Node.js, Express y MySQL para un proyecto universitario de control de tiempo de aplicaciones.

## 1. Crear la base de datos

Abre MySQL Workbench, copia el contenido de:

```txt
sql/schema_simple.sql
```

y ejecutalo completo.

La base original fue simplificada para dejar solo las tablas necesarias para un CRUD:

- usuarios
- grupos
- grupo_miembros
- aplicaciones
- dispositivos
- restricciones
- uso_diario
- solicitudes_tiempo

## 2. Instalar dependencias

```bash
npm install
```

## 3. Configurar conexion

Copia `.env.example` a `.env` y ajusta tus datos de MySQL:

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=control_tiempo_apps
```

## 4. Ejecutar el servidor

```bash
npm run dev
```

O sin nodemon:

```bash
npm start
```

URL base:

```txt
http://localhost:3000
```

## Endpoints CRUD

Todos estos endpoints tienen:

- `GET /api/recurso`
- `GET /api/recurso/:id`
- `POST /api/recurso`
- `PUT /api/recurso/:id`
- `DELETE /api/recurso/:id`

Recursos disponibles:

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

## Ejemplos rapidos

Crear usuario:

```json
POST /api/usuarios
{
  "nombre": "Ana",
  "email": "ana@mail.com",
  "password": "123456"
}
```

Crear aplicacion:

```json
POST /api/aplicaciones
{
  "nombre": "TikTok",
  "paquete": "com.zhiliaoapp.musically"
}
```

Crear restriccion:

```json
POST /api/restricciones
{
  "grupo_id": 1,
  "usuario_id": 1,
  "aplicacion_id": 1,
  "limite_diario_minutos": 60
}
```

Registrar uso diario:

```json
POST /api/uso-diario
{
  "usuario_id": 1,
  "aplicacion_id": 1,
  "fecha": "2026-06-01",
  "minutos_usados": 20
}
```

Consultar tiempo disponible de una restriccion:

```txt
GET /api/restricciones/1/disponible
```

Respuesta:

```json
{
  "id": 1,
  "limite_diario_minutos": 60,
  "minutos_usados": "20",
  "minutos_disponibles": "40"
}
```
