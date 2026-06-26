# Backend Proyecto Productos PC

API REST para gestion de autenticacion, categorias y productos de una tienda de computacion.

## Stack

- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticacion
- Bcrypt para hash de contrasenas
- Mocha + Chai + Supertest para tests

## Scripts disponibles

```bash
npm install
npm run dev
npm start
npm test
npm run seed
```

Descripcion de scripts:

- `npm run dev`: inicia el servidor con `node --watch index.js`.
- `npm start`: inicia el servidor en modo normal.
- `npm test`: ejecuta tests con Mocha usando `test/setup.js`.
- `npm run seed`: ejecuta el seeder de productos y categorias (`src/seeders/product.seeder.js`).

## Variables de entorno

Basado en `.env-example`:

```env
PORT=
MONGODB_URI=
JWT_SECRET=
```

Variables usadas por la aplicacion:

- `PORT`: puerto del servidor (si no existe, usa `3001`).
- `MONGODB_URI`: URI de conexion a MongoDB.
- `JWT_SECRET`: clave para firmar y validar JWT.

Para pruebas, `test/setup.js` carga `test/.env.test`.

## Instalacion y ejecucion

1. Clona el repositorio.
2. Entra a la carpeta del proyecto.
3. Instala dependencias:

```bash
npm install
```

4. Crea tu archivo `.env` (puedes copiar `.env-example`) y completa valores.
5. Inicia la app:

```bash
npm run dev
```

Servidor:

- Base URL local: `http://localhost:3000`
- Mensaje de prueba: `GET /`

## Arquitectura de la API

Prefijos de rutas:

- `/api/auth`
- `/api/products`
- `/api/categories`

Middlewares:

- `authMiddleware`: valida header `Authorization: Bearer <token>`.
- `adminMiddleware`: requiere usuario autenticado con `admin: true`.

## Modelo de datos

### User

Campos:

- `name` (String, requerido)
- `email` (String, requerido, unico, lowercase)
- `password` (String, requerido)
- `admin` (Boolean, default `false`)
- `createdAt`, `updatedAt` (timestamps)

### Category

Campos:

- `name` (String, requerido, unico)
- `description` (String, requerido)
- `createdAt`, `updatedAt` (timestamps)

### Product

Campos:

- `name` (String, requerido, minimo 3 caracteres)
- `category` (ObjectId, ref `Category`, requerido)
- `description` (String, default `""`)
- `price` (Number, requerido, minimo 0)
- `stock` (Number, requerido)
- `image` (String, requerido)
- `featured` (Boolean, default `false`)
- `createdAt`, `updatedAt` (timestamps)

## Autenticacion

### Registrar usuario

- Metodo: `POST /api/auth/register`
- Body:

```json
{
  "name": "Roger",
  "email": "roger@mail.com",
  "password": "abc12345"
}
```

Validaciones principales:

- Todos los campos son obligatorios.
- Email con formato valido.
- Password con minimo 6 caracteres.
- Email unico.

Respuestas comunes:

- `201`: usuario creado.
- `400`: email ya registrado.
- `422`: datos invalidos o incompletos.
- `500`: error interno.

### Login

- Metodo: `POST /api/auth/login`
- Body:

```json
{
  "email": "roger@mail.com",
  "password": "abc12345"
}
```

Respuestas comunes:

- `200`: retorna token + datos del usuario.
- `401`: credenciales invalidas.
- `422`: datos invalidos o incompletos.
- `500`: error interno.

Ejemplo de respuesta exitosa:

```json
{
  "message": "Login correcto",
  "token": "<jwt>",
  "user": {
    "_id": "...",
    "name": "Roger",
    "email": "roger@mail.com",
    "admin": false
  }
}
```

## Endpoints de categorias

### Crear categoria (admin)

- Metodo: `POST /api/categories`
- Auth: `Bearer token` + usuario admin
- Body:

```json
{
  "name": "gaming",
  "description": "Productos orientados al gaming"
}
```

Respuestas comunes:

- `201`: categoria creada.
- `400`: la categoria ya existe (comparacion case-insensitive).
- `403`: acceso denegado (no admin).
- `422`: campos faltantes o validacion.
- `500`: error interno.

### Listar categorias

- Metodo: `GET /api/categories`
- Query params opcionales:

- `page` (default `1`)
- `limit` (default `4`)
- `sortBy` (default `name`)
- `order` (`asc` o `desc`, default `asc`)
- `search` (busca en `name` y `description`)
- `description` (filtro exacto)

Respuesta exitosa (`200`):

```json
{
  "categories": [
    {
      "_id": "...",
      "name": "accesorios",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "totalCategories": 3,
  "totalPages": 1,
  "currentPage": 1
}
```

Nota: en este listado se excluyen `description` y `__v`.

### Obtener categoria por ID

- Metodo: `GET /api/categories/:id`

Respuestas comunes:

- `200`: categoria encontrada.
- `404`: categoria no encontrada.
- `500`: error interno.

### Actualizar categoria (admin)

- Metodo: `PUT /api/categories/:id`
- Auth: `Bearer token` + usuario admin

Reglas actuales:

- Si `name` no es string, responde `422`.
- Usa validaciones del modelo (`runValidators: true`).

Respuestas comunes:

- `200`: categoria actualizada.
- `403`: acceso denegado.
- `404`: id invalido (CastError).
- `422`: validacion.
- `500`: error interno.

### Eliminar categoria (admin)

- Metodo: `DELETE /api/categories/:id`
- Auth: `Bearer token` + usuario admin

Respuestas comunes:

- `200`: categoria borrada.
- `404`: categoria no encontrada.
- `403`: acceso denegado.
- `500`: error interno.

Nota: esta operacion tiene una espera artificial de 3 segundos antes de borrar.

## Endpoints de productos

### Crear producto (admin)

- Metodo: `POST /api/products`
- Auth: `Bearer token` + usuario admin
- Body esperado:

```json
{
  "name": "Mouse Gamer X",
  "category": "<categoryId>",
  "description": "Mouse ergonomico",
  "price": 59.9,
  "stock": 10,
  "image": "https://...",
  "featured": false
}
```

Validaciones principales:

- `name` obligatorio, no vacio y minimo 3 caracteres.
- Todos los campos de negocio requeridos en la logica (`name`, `description`, `price`, `stock`).
- Validaciones adicionales desde Mongoose (por ejemplo `category`, `image`, `price >= 0`).

Respuestas comunes:

- `201`: producto creado.
- `403`: acceso denegado.
- `422`: validacion o campos faltantes.
- `500`: error interno.

### Listar productos

- Metodo: `GET /api/products`
- Query params opcionales:

- `page` (default `1`)
- `limit` (default `4`)
- `sortBy` (default `name`)
- `order` (`asc` o `desc`, default `asc`)
- `search` (busca en `name` y `description`)
- `description` (filtro exacto)

Respuesta exitosa (`200`):

```json
{
  "products": [
    {
      "_id": "...",
      "name": "Teclados",
      "category": "...",
      "price": 114.99,
      "stock": 15,
      "image": "https://...",
      "featured": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "totalProducts": 12,
  "totalPages": 3,
  "currentPage": 1
}
```

Nota: en este listado se excluyen `description` y `__v`.

### Listar productos por categoria

- Metodo: `GET /api/products/category/:category`
- `:category` debe ser el ID de categoria.

Respuestas comunes:

- `200`: array de productos de esa categoria.
- `404`: categoria no encontrada.
- `500`: error interno.

### Obtener producto por ID

- Metodo: `GET /api/products/:id`

Respuestas comunes:

- `200`: producto encontrado.
- `404`: producto no encontrado.
- `500`: error interno.

### Actualizar producto (admin)

- Metodo: `PUT /api/products/:id`
- Auth: `Bearer token` + usuario admin

Reglas actuales:

- Si `name` no es string, responde `422`.
- Usa validaciones del modelo (`runValidators: true`).

Respuestas comunes:

- `200`: producto actualizado.
- `403`: acceso denegado.
- `404`: id invalido (CastError).
- `422`: validacion.
- `500`: error interno.

### Eliminar producto (admin)

- Metodo: `DELETE /api/products/:id`
- Auth: `Bearer token` + usuario admin

Respuestas comunes:

- `200`: producto borrado.
- `404`: producto no encontrado.
- `403`: acceso denegado.
- `500`: error interno.

Nota: esta operacion tiene una espera artificial de 3 segundos antes de borrar.

## Seeders

### Seeder principal (productos + categorias)

Comando:

```bash
npm run seed
```

Comportamiento:

- Inserta/actualiza categorias base: `accesorios`, `gaming`, `componentes`.
- Resuelve los nombres de categoria a `_id` antes de insertar productos.
- Borra todos los productos y vuelve a cargar dataset de ejemplo.

### Seeder de usuarios

Archivo disponible: `src/seeders/user.seeder.js`

Este seeder:

- Borra todos los usuarios.
- Inserta dos usuarios de ejemplo (`user@example.com` y `admin@example.com`).

Nota importante: este seeder guarda passwords en texto plano, por lo que esos usuarios no podran autenticarse por login mientras no se hasheen las contrasenas.

## Testing

Comando:

```bash
npm test
```

Cobertura actual de pruebas:

- `test/app.test.js`: prueba endpoint raiz `GET /`.
- `test/auth.test.js`: registro, usuario duplicado y login.
- `test/products.test.js`: escenario inicial de CRUD de productos.

## Resumen de permisos

- Publico:
  - `GET /`
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/products`
  - `GET /api/products/category/:category`
  - `GET /api/products/:id`
  - `GET /api/categories`
  - `GET /api/categories/:id`

- Solo admin autenticado:
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`
  - `POST /api/categories`
  - `PUT /api/categories/:id`
  - `DELETE /api/categories/:id`

## Mensaje raiz

`GET /` responde:

```json
{
  "message": "Bienvenidos a la API de productos de PC"
}
```
