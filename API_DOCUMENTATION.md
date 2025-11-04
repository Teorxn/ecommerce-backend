# API de Productos - E-commerce Backend

## Descripción

API REST para gestión de productos en un e-commerce de PCs construida con Node.js, Express, TypeScript y Firebase Firestore.

## Rutas Disponibles

### Base URL: `/api/products`

### CRUD Básico

#### 1. Obtener todos los productos

- **GET** `/api/products`
- **Respuesta**: Array de productos con contador

#### 2. Obtener producto por ID

- **GET** `/api/products/:id`
- **Parámetros**: `id` (string) - ID del producto
- **Respuesta**: Producto específico

#### 3. Crear nuevo producto

- **POST** `/api/products`
- **Body** (JSON):

```json
{
  "name": "string (requerido)",
  "description": "string (requerido)",
  "price": "number (requerido)",
  "category": ["string"] (requerido),
  "images": ["string"] (requerido),
  "stock": "number (requerido)",
  "rating": "number (0-5, opcional)",
  "discount": "number (0-100, opcional)",
  "specs": { "object (opcional)" },
  "usage": ["string"] (opcional)
}
```

#### 4. Actualizar producto

- **PUT** `/api/products/:id`
- **Parámetros**: `id` (string) - ID del producto
- **Body**: Mismos campos que crear, pero todos opcionales

#### 5. Eliminar producto

- **DELETE** `/api/products/:id`
- **Parámetros**: `id` (string) - ID del producto

### Búsqueda y Filtrado

#### 6. Buscar productos por nombre

- **GET** `/api/products/search/query?q=término`
- **Query Parameters**: `q` (string) - Término de búsqueda

#### 7. Filtrar por categoría

- **GET** `/api/products/category/:category`
- **Parámetros**: `category` (string) - Categoría a filtrar

#### 8. Filtrar por uso

- **GET** `/api/products/usage/:usage`
- **Parámetros**: `usage` (string) - Uso a filtrar

#### 9. Filtrar por rating mínimo

- **GET** `/api/products/rating/:rating`
- **Parámetros**: `rating` (number) - Rating mínimo

#### 10. Filtrar por descuento mínimo

- **GET** `/api/products/discount/:discount`
- **Parámetros**: `discount` (number) - Descuento mínimo

#### 11. Filtrar por rango de precio

- **GET** `/api/products/price/range?minPrice=100&maxPrice=2000`
- **Query Parameters**:
  - `minPrice` (number) - Precio mínimo
  - `maxPrice` (number) - Precio máximo

### Gestión de Stock

#### 12. Actualizar stock

- **PATCH** `/api/products/:id/stock`
- **Parámetros**: `id` (string) - ID del producto
- **Body**:

```json
{
  "stock": "number (requerido)"
}
```

## Respuestas

### Respuesta Exitosa

```json
{
  "success": true,
  "data": {}, // o array de productos
  "count": "number (opcional)"
}
```

### Respuesta de Error

```json
{
  "success": false,
  "message": "string",
  "error": "string (opcional)",
  "errors": [] // array de errores de validación (opcional)
}
```

## Códigos de Estado HTTP

- `200` - OK
- `201` - Creado
- `400` - Bad Request (errores de validación)
- `404` - No encontrado
- `500` - Error interno del servidor

## Validaciones

### Campos Requeridos (POST)

- `name`: String no vacío
- `description`: String no vacío
- `price`: Número >= 0
- `category`: Array con al menos un elemento
- `images`: Array
- `stock`: Número >= 0

### Campos Opcionales

- `rating`: Número entre 0 y 5
- `discount`: Número entre 0 y 100
- `specs`: Objeto
- `usage`: Array

## Variables de Entorno

Crear un archivo `.env` con:

```
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
PORT=4000
```

## Ejecutar el Proyecto

```bash
# Desarrollo
npm run dev

# Producción
npm run build
npm start
```
