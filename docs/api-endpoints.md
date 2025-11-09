# API Endpoints Documentation

## Base URL
**Development:** `http://localhost:5000/api`  
**Production:** `https://your-domain.com/api`

## Authentication
Most endpoints require a JWT token obtained from login/register.

**Header Format:**
```
Authorization: Bearer <your-jwt-token>
```

---

## Endpoints Overview

| Category | Endpoint | Method | Auth Required | Description |
|----------|----------|--------|---------------|-------------|
| **Root** | `/` | GET | No | API health check |
| **Auth** | `/auth/register` | POST | No | Create new user |
| **Auth** | `/auth/login` | POST | No | User login |
| **Auth** | `/auth/me` | GET | Yes | Get current user |
| **Products** | `/products` | GET | No | List all products |
| **Products** | `/products` | POST | No* | Create product |
| **Orders** | `/orders` | POST | Yes | Place order |
| **Orders** | `/orders/my` | GET | Yes | Get user's orders |
| **Orders** | `/orders/:id` | GET | Yes | Get order details |
| **Orders** | `/orders/:id/invoice` | GET | Yes | Download invoice PDF |

\* *Will require admin role in future*

---

## Root Endpoint

### Health Check
**Endpoint:** `GET /`  
**Auth:** Not required  
**Description:** Check if API is running

**Response:**
```
Welcome to Handcrafted Marketplace API
```

---

## Authentication Endpoints

### Register User
**Endpoint:** `POST /auth/register`  
**Auth:** Not required  
**Description:** Create a new user account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "SecurePass123",
  "role": "buyer"  // Optional: buyer (default), seller, admin
}
```

**Success Response (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing required fields
- `409` - Email already exists
- `500` - Server error

---

### Login
**Endpoint:** `POST /auth/login`  
**Auth:** Not required  
**Description:** Authenticate user and get JWT token

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- `400` - Missing email or password
- `401` - Invalid credentials
- `500` - Server error

---

### Get Current User
**Endpoint:** `GET /auth/me`  
**Auth:** Required  
**Description:** Get authenticated user's profile

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "role": "buyer"
  }
}
```

**Error Responses:**
- `401` - Invalid or missing token
- `404` - User not found
- `500` - Server error

---

## Product Endpoints

### List All Products
**Endpoint:** `GET /products`  
**Auth:** Not required  
**Description:** Get all products in the catalog

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Handwoven Ceramic Bowl",
    "description": "Beautiful oceanic-toned ceramic bowl...",
    "price": "45.00",
    "stock": 12,
    "imageUrl": "https://images.unsplash.com/...",
    "artisanName": "Priya Desai",
    "createdAt": "2025-11-10T10:30:00.000Z",
    "updatedAt": "2025-11-10T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Sterling Silver Pendant",
    "description": "Elegant handcrafted pendant...",
    "price": "89.00",
    "stock": 8,
    "imageUrl": "https://images.unsplash.com/...",
    "artisanName": "Sachin Patel",
    "createdAt": "2025-11-10T10:31:00.000Z",
    "updatedAt": "2025-11-10T10:31:00.000Z"
  }
]
```

**Error Responses:**
- `500` - Server error

---

### Create Product
**Endpoint:** `POST /products`  
**Auth:** Not required (will require admin role in future)  
**Description:** Add a new product to catalog

**Request Body:**
```json
{
  "name": "Handmade Wooden Box",
  "description": "Beautiful carved wooden storage box",
  "price": 35.50,
  "stock": 20,
  "imageUrl": "https://example.com/image.jpg",
  "artisanName": "Rajesh Kumar"
}
```

**Success Response (201):**
```json
{
  "id": 3,
  "name": "Handmade Wooden Box",
  "description": "Beautiful carved wooden storage box",
  "price": "35.50",
  "stock": 20,
  "imageUrl": "https://example.com/image.jpg",
  "artisanName": "Rajesh Kumar",
  "createdAt": "2025-11-10T11:00:00.000Z",
  "updatedAt": "2025-11-10T11:00:00.000Z"
}
```

**Error Responses:**
- `500` - Server error

---

## Order Endpoints

### Place Order
**Endpoint:** `POST /orders`  
**Auth:** Required  
**Description:** Create a new order with items from cart

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": 1,
      "qty": 2
    },
    {
      "productId": 3,
      "qty": 1
    }
  ]
}
```

**Success Response (201):**
```json
{
  "orderId": 15,
  "total": 125.50,
  "status": "PLACED"
}
```

**Error Responses:**
- `400` - Invalid request (missing items, invalid qty, insufficient stock)
- `401` - Unauthorized
- `500` - Server error

**Notes:**
- Transaction-based: Either all items succeed or none
- Stock is decremented atomically
- Product locks prevent race conditions
- Validates stock availability before creating order

---

### Get User's Orders
**Endpoint:** `GET /orders/my`  
**Auth:** Required  
**Description:** Get all orders for authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "orders": [
    {
      "id": 15,
      "total": "125.50",
      "status": "PLACED",
      "createdAt": "2025-11-10T12:00:00.000Z",
      "updatedAt": "2025-11-10T12:00:00.000Z",
      "items": [
        {
          "id": 30,
          "productId": 1,
          "name": "Handwoven Ceramic Bowl",
          "price": "45.00",
          "qty": 2,
          "lineTotal": "90.00"
        },
        {
          "id": 31,
          "productId": 3,
          "name": "Handmade Wooden Box",
          "price": "35.50",
          "qty": 1,
          "lineTotal": "35.50"
        }
      ]
    }
  ]
}
```

**Error Responses:**
- `401` - Unauthorized
- `500` - Server error

---

### Get Order Details
**Endpoint:** `GET /orders/:id`  
**Auth:** Required  
**Description:** Get detailed information for a specific order

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Order ID (integer)

**Success Response (200):**
```json
{
  "order": {
    "id": 15,
    "total": "125.50",
    "status": "PLACED",
    "createdAt": "2025-11-10T12:00:00.000Z",
    "updatedAt": "2025-11-10T12:00:00.000Z",
    "items": [
      {
        "id": 30,
        "productId": 1,
        "name": "Handwoven Ceramic Bowl",
        "price": "45.00",
        "qty": 2,
        "lineTotal": "90.00"
      }
    ]
  }
}
```

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not order owner or admin)
- `404` - Order not found
- `500` - Server error

---

### Download Invoice
**Endpoint:** `GET /orders/:id/invoice`  
**Auth:** Required  
**Description:** Download PDF invoice for an order

**Headers:**
```
Authorization: Bearer <token>
```

**URL Parameters:**
- `id` - Order ID (integer)

**Success Response (200):**
- Content-Type: `application/pdf`
- Content-Disposition: `attachment; filename=invoice_15.pdf`
- Body: PDF binary stream

**Invoice Contents:**
- Marketplace header
- Invoice number and date
- Seller information
- Buyer information (name, email)
- Line items table (item, qty, price, total)
- Subtotal, tax, grand total
- Order reference number

**Error Responses:**
- `401` - Unauthorized
- `403` - Forbidden (not order owner or admin)
- `404` - Order not found
- `500` - Server error

---

## Error Response Format

All error responses follow this format:

```json
{
  "message": "Error description",
  "error": "Optional detailed error message"
}
```

### Common HTTP Status Codes

| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET request |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Invalid input or validation error |
| 401 | Unauthorized | Missing or invalid JWT token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists (e.g., duplicate email) |
| 500 | Internal Server Error | Server-side error |

---

## Rate Limiting
**Current:** No rate limiting implemented  
**Recommended:** 100 requests per minute per IP for production

---

## CORS Policy
**Development:** Accepts requests from all origins  
**Production:** Configure whitelist of allowed origins

---

## Testing Endpoints

### Using cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Pass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Pass123"}'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

**Place Order:**
```bash
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-token>" \
  -d '{"items":[{"productId":1,"qty":2}]}'
```

**Download Invoice:**
```bash
curl -H "Authorization: Bearer <your-token>" \
  http://localhost:5000/api/orders/1/invoice \
  -o invoice.pdf
```

### Using PowerShell

**Register:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/auth/register" `
  -Method POST -ContentType "application/json" `
  -Body '{"name":"Test User","email":"test@example.com","password":"Pass123"}'
```

**Login:**
```powershell
$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST -ContentType "application/json" `
  -Body '{"email":"test@example.com","password":"Pass123"}' | ConvertFrom-Json
$token = $response.token
```

**Place Order:**
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/api/orders" `
  -Method POST -ContentType "application/json" `
  -Headers @{Authorization="Bearer $token"} `
  -Body '{"items":[{"productId":1,"qty":2}]}'
```

---

**Last Updated:** November 10, 2025  
**API Version:** 1.0.0  
**Maintained By:** Breaking Code Team
