# Posts & Comments Manager

Aplicacion full-stack para gestionar publicaciones y comentarios.
Construida con NestJS, MongoDB y Angular.

---

## Requisitos previos

- Node.js 20 o superior
- npm 10 o superior
- Una instancia de MongoDB accesible (local o en la nube, por ejemplo MongoDB Atlas)
- Docker Desktop (opcional, solo si quieres levantar el backend y MongoDB con Docker)

---

## Estructura del repositorio

```
posts-comments-manager/
├── backend/   # API REST en NestJS
└── frontend/  # Aplicacion Angular con SSR
```

---

## Configuracion del backend

### 1. Instalar dependencias

```bash
cd backend
npm install
```

### 2. Crear el archivo de variables de entorno

Crea un archivo `.env` dentro de `backend/` con el siguiente contenido:

```env
# Cadena de conexion a MongoDB
MONGODB_URI=mongodb://localhost:27017/posts-comments-manager

# Puerto en el que escucha el servidor (opcional, por defecto 3000)
PORT=3000

# URL del frontend, usada para configurar CORS (opcional, por defecto http://localhost:4200)
FRONTEND_URL=http://localhost:4200

# Credenciales de acceso al sistema
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123

# Configuracion del token JWT
JWT_SECRET=cambia-este-valor-en-produccion
JWT_EXPIRES_IN_SECONDS=3600
```

> Los valores de `AUTH_USERNAME`, `AUTH_PASSWORD` y `JWT_SECRET` son los que se usaran
> al iniciar sesion desde el frontend. En produccion cambia `JWT_SECRET` por un valor seguro.

### 3. Levantar el servidor en modo desarrollo

```bash
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

---

## Ejecutar backend con Docker

El backend incluye un `Dockerfile` y un `compose.yaml` dentro de `backend/`.
Puedes usar Docker de dos maneras:

- Con `docker compose`: levanta la API y MongoDB juntos.
- Con `Dockerfile`: construye solo la imagen de la API; necesitas tener MongoDB aparte.

### Opcion 1: API + MongoDB con Docker Compose

Desde la raiz del repositorio:

```bash
cd backend
docker compose up --build
```

Esto levanta:

- API NestJS en `http://localhost:3000`
- MongoDB en `localhost:27017`

El `compose.yaml` ya define las variables necesarias para desarrollo:

```env
MONGODB_URI=mongodb://mongo:27017/posts-comments-manager
FRONTEND_URL=http://localhost:4200
AUTH_USERNAME=admin
AUTH_PASSWORD=admin123
JWT_SECRET=dev-jwt-secret
JWT_EXPIRES_IN_SECONDS=3600
```

Para detener los servicios:

```bash
docker compose down
```

Para detenerlos y borrar tambien los datos guardados en el volumen de MongoDB:

```bash
docker compose down -v
```

### Opcion 2: Construir solo la API con el Dockerfile

Usa esta opcion si ya tienes MongoDB corriendo localmente o en otro servicio.

Desde la raiz del repositorio:

```bash
cd backend
docker build -t posts-comments-api .
```

Ejecuta el contenedor apuntando a MongoDB local:

```bash
docker run --rm -p 3000:3000 ^
  -e PORT=3000 ^
  -e MONGODB_URI=mongodb://host.docker.internal:27017/posts-comments-manager ^
  -e FRONTEND_URL=http://localhost:4200 ^
  -e AUTH_USERNAME=admin ^
  -e AUTH_PASSWORD=admin123 ^
  -e JWT_SECRET=dev-jwt-secret ^
  -e JWT_EXPIRES_IN_SECONDS=3600 ^
  posts-comments-api
```

El ejemplo anterior usa continuacion de linea de `cmd`. En PowerShell puedes usar una sola linea:

```bash
docker run --rm -p 3000:3000 -e PORT=3000 -e MONGODB_URI=mongodb://host.docker.internal:27017/posts-comments-manager -e FRONTEND_URL=http://localhost:4200 -e AUTH_USERNAME=admin -e AUTH_PASSWORD=admin123 -e JWT_SECRET=dev-jwt-secret -e JWT_EXPIRES_IN_SECONDS=3600 posts-comments-api
```

---

## Configuracion del frontend

### 1. Instalar dependencias

```bash
cd frontend
npm install
```

### 2. Levantar la aplicacion en modo desarrollo

```bash
npm start
```

El frontend queda disponible en `http://localhost:4200`.

Las peticiones al API se envian a `/api/*` y el proxy de desarrollo las redirige
automaticamente a `http://localhost:3000`. No se requiere configuracion adicional
para el entorno local.

---

## Credenciales de acceso

La autenticacion usa usuario y contrasena definidos en el `.env` del backend.
Con los valores del ejemplo:

| Campo      | Valor      |
|------------|------------|
| Usuario    | `admin`    |
| Contrasena | `admin123` |

Las rutas de creacion y edicion de posts, eliminacion de comentarios y carga masiva
requieren haber iniciado sesion.

---

## Referencia de endpoints

### Autenticacion

| Metodo | Ruta         | Descripcion            | Requiere token |
|--------|--------------|------------------------|----------------|
| POST   | /auth/login  | Iniciar sesion y obtener JWT | No       |

### Posts

| Metodo | Ruta             | Descripcion                        | Requiere token |
|--------|------------------|------------------------------------|----------------|
| GET    | /posts           | Listar posts (soporta paginacion y busqueda) | No |
| GET    | /posts/:id       | Obtener un post por ID             | No             |
| POST   | /posts           | Crear un post                      | Si             |
| PUT    | /posts/:id       | Editar un post                     | Si             |
| DELETE | /posts/:id       | Eliminar un post                   | No             |
| POST   | /posts/bulk      | Carga masiva de posts              | Si             |

Parametros de busqueda para `GET /posts`:

| Parametro | Tipo   | Descripcion                        |
|-----------|--------|------------------------------------|
| page      | number | Numero de pagina (por defecto 1)   |
| limit     | number | Resultados por pagina (por defecto 10) |
| search    | string | Filtrar por titulo (opcional)      |

### Comentarios

| Metodo | Ruta              | Descripcion                          | Requiere token |
|--------|-------------------|--------------------------------------|----------------|
| GET    | /comments?postId= | Listar comentarios de un post        | No             |
| POST   | /comments         | Crear un comentario                  | No             |
| DELETE | /comments/:id     | Eliminar un comentario               | Si             |

---

## Formato de respuesta

Todos los endpoints devuelven la misma estructura:

```json
{
  "success": true,
  "message": "Descripcion del resultado",
  "data": {}
}
```

En caso de error:

```json
{
  "success": false,
  "message": "Descripcion del error",
  "status": 400
}
```

---

## Carga masiva de posts

Para insertar multiples posts en una sola operacion usa `POST /posts/bulk`.
El cuerpo debe ser un arreglo JSON. Consulta el archivo `bulk-posts-example.json`
en la raiz del repositorio para ver un ejemplo completo.

Ejemplo minimo:

```json
[
  { "title": "Titulo del post", "body": "Contenido del post", "author": "Nombre del autor" },
  { "title": "Otro titulo",     "body": "Otro contenido",     "author": "Otro autor" }
]
```

---

## Probar endpoints con PowerShell

Antes de ejecutar estos comandos, asegurate de que el backend este corriendo en
`http://localhost:3000`.

### Variables base

```powershell
$base = "http://localhost:3000"
$root = "C:\Users\david.LAPTOP-RHBMMHCD\posts-comments-manager"
```

### Login y token

```powershell
$loginBody = '{"username":"admin","password":"admin123"}'
$login = Invoke-RestMethod -Uri "$base/auth/login" -Method POST -Body $loginBody -ContentType "application/json;charset=utf-8"
$token = $login.data.accessToken

$headers = @{
  Authorization = "Bearer $token"
  "Content-Type" = "application/json;charset=utf-8"
}
```

### Listar posts

```powershell
Invoke-RestMethod -Uri "$base/posts?page=1&limit=6" -Method GET
```

### Listar posts con busqueda

```powershell
Invoke-RestMethod -Uri "$base/posts?page=1&limit=6&search=Angular" -Method GET
```

### Crear un post

```powershell
$createBody = '{"title":"Post desde PowerShell","body":"Contenido de prueba con mas de diez caracteres.","author":"Tester"}'
$created = Invoke-RestMethod -Uri "$base/posts" -Method POST -Body $createBody -Headers $headers
$postId = $created.data._id
$postId
```

### Obtener un post por ID

```powershell
Invoke-RestMethod -Uri "$base/posts/$postId" -Method GET
```

### Editar un post

```powershell
$updateBody = '{"title":"Titulo actualizado","body":"Cuerpo actualizado con mas de diez caracteres.","author":"Tester"}'
Invoke-RestMethod -Uri "$base/posts/$postId" -Method PUT -Body $updateBody -Headers $headers
```

### Crear un comentario

```powershell
$commentBody = "{`"postId`":`"$postId`",`"name`":`"Ana Tester`",`"email`":`"ana@test.local`",`"body`":`"Comentario de prueba`"}"
$newComment = Invoke-RestMethod -Uri "$base/comments" -Method POST -Body $commentBody -ContentType "application/json;charset=utf-8"
$commentId = $newComment.data._id
$commentId
```

### Listar comentarios de un post

```powershell
Invoke-RestMethod -Uri "$base/comments?postId=$postId" -Method GET
```

### Eliminar un comentario

```powershell
Invoke-RestMethod -Uri "$base/comments/$commentId" -Method DELETE -Headers @{ Authorization = "Bearer $token" }
```

### Carga masiva de posts

```powershell
$bulkJson = Get-Content -Raw "$root\bulk-posts-example.json"
Invoke-RestMethod -Uri "$base/posts/bulk" -Method POST -Body $bulkJson -Headers $headers
```

### Eliminar un post

```powershell
Invoke-RestMethod -Uri "$base/posts/$postId" -Method DELETE
```

### Probar un error controlado

```powershell
try {
  Invoke-RestMethod -Uri "$base/posts/bulk" -Method POST -Body "[]" -Headers $headers
} catch {
  $_.Exception.Response.StatusCode.value__
  $_.ErrorDetails.Message
}
```

---

## Ejecutar los tests

### Backend

```bash
cd backend
npm test
```

### Frontend

```bash
cd frontend
npm test
```

---

## Coleccion de API

En la raiz del repositorio se incluye el archivo `postman-collection.json` con todos
los endpoints listos para importar en Postman o Thunder Client.
