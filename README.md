# Backend Proyecto peliculas y series - Jean Paul

## Instalación

1. Clona el repositorio:

   ```bash
   git clone <repository_url>
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd backend-proyecto-peliculas-series-jean-paul
   ```

3. Cambiar a la rama `dev`:

   ```bash
   git switch dev
   ```

4. Instala las dependencias:

   ```bash
   npm install
   ```

5. Crea un archivo `.env` basado en el archivo `.env-example` y configura tus variables de entorno:

   ```bash
   cp .env-example .env
   ```

   Luego, edita el archivo `.env` para agregar tu configuración personalizada, como el puerto y la URI de MongoDB.

6. Inicia el servidor:
   ```bash
   npm start
   ```
   Para desarrollo con recarga automática, puedes usar:
   ```bash
   npm run dev
   ```

## Seeders

Si deseas poblar la base de datos con datos de ejemplo, puedes ejecutar el seeder:

```bash
npm run seed
```

## Uso

Una vez que el servidor esté en funcionamiento, puedes acceder a la API a través de `http://localhost:<PORT>/api`, donde `<PORT>` es el puerto que configuraste en tu archivo `.env`.

### Obtener todas las películas

metodo GET a `/api/movies` para obtener una lista de todas las películas.

response:

```json
[
  {
    "_id": "6a2...",
    "title": "Breaking Bad",
    "genre": "Drama",
    "year": 2008,
    "image": "https://picsum.photos/300/400?random=1",
    "featured": true,
    "createdAt": "2026-06-05T17:31:02.907Z",
    "updatedAt": "2026-06-05T17:31:02.907Z"
  }
]
```

### Obtener una película por ID

metodo GET a `/api/movies/:id` para obtener los detalles de una película específica por su ID.

response:

status: 200

```json
{
  "_id": "6a2...",
  "title": "Breaking Bad",
  "genre": "Drama",
  "year": 2008,
  "image": "https://picsum.photos/300/400?random=1",
  "featured": true,
  "createdAt": "2026-06-05T17:31:02.907Z",
  "updatedAt": "2026-06-05T17:31:02.907Z"
}
```

status: 404

```json
{
  "message": "Pelicula no encontrada"
}
```
