# System Architecture

## Overview
The Handcrafted Marketplace is a three-tier web application following modern full-stack architecture principles. The system consists of a React frontend, Express.js backend API, and MySQL database, with automated CI/CD through GitHub Actions.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT TIER                             │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │              React Frontend (Port 3000)                │    │
│  │                                                         │    │
│  │  • React Router (SPA routing)                          │    │
│  │  • Context API (Cart, Auth state)                      │    │
│  │  • Axios (HTTP client)                                 │    │
│  │  • Protected Routes (RequireAuth)                      │    │
│  │  • Responsive UI Components                            │    │
│  └───────────────────────────────────────────────────────┘    │
│                            ↕ HTTP/HTTPS                         │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                       APPLICATION TIER                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │          Express.js Backend API (Port 5000)            │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │  Controllers  │  │  Middleware  │  │   Routes    │ │    │
│  │  │              │  │              │  │             │ │    │
│  │  │ • Auth       │  │ • JWT Auth   │  │ • /auth     │ │    │
│  │  │ • Products   │  │ • Error      │  │ • /products │ │    │
│  │  │ • Orders     │  │ • CORS       │  │ • /orders   │ │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │    │
│  │                                                         │    │
│  │  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │    │
│  │  │   Models      │  │   Utils      │  │   Config    │ │    │
│  │  │              │  │              │  │             │ │    │
│  │  │ • User       │  │ • Invoice    │  │ • Database  │ │    │
│  │  │ • Product    │  │ • PDF Gen    │  │ • Env Vars  │ │    │
│  │  │ • Order      │  │              │  │             │ │    │
│  │  │ • OrderItem  │  │              │  │             │ │    │
│  │  └──────────────┘  └──────────────┘  └─────────────┘ │    │
│  └───────────────────────────────────────────────────────┘    │
│                            ↕ Sequelize ORM                      │
└─────────────────────────────────────────────────────────────────┘
                               ↓
┌─────────────────────────────────────────────────────────────────┐
│                         DATA TIER                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │         MySQL Database (Port 3306/3307)                │    │
│  │                                                         │    │
│  │  Tables:                                                │    │
│  │  • users          (id, name, email, password_hash)     │    │
│  │  • products       (id, name, price, stock, imageUrl)   │    │
│  │  • orders         (id, userId, total, status)          │    │
│  │  • order_items    (id, orderId, productId, qty)        │    │
│  │                                                         │    │
│  │  Relationships:                                         │    │
│  │  • User → Orders (1:N)                                  │    │
│  │  • Order → OrderItems (1:N)                             │    │
│  │  • Product → OrderItems (1:N)                           │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │          Docker Container (Optional)                    │    │
│  │  mysql:8.0 with authentication plugin                   │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                       CI/CD PIPELINE                            │
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │              GitHub Actions Workflow                    │    │
│  │                                                         │    │
│  │  Trigger: Push/PR → Run Pipeline                        │    │
│  │                                                         │    │
│  │  Steps:                                                 │    │
│  │  1. Checkout code                                       │    │
│  │  2. Setup Node.js 18                                    │    │
│  │  3. Install dependencies (backend + frontend)           │    │
│  │  4. Run ESLint (code quality)                           │    │
│  │  5. Run Jest tests (with coverage)                      │    │
│  │  6. Build frontend (production)                         │    │
│  │  7. Upload artifacts (build + coverage)                 │    │
│  │                                                         │    │
│  │  Environment: JWT_SECRET from GitHub Secrets            │    │
│  └───────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### Frontend (React)
**Port:** 3000  
**Entry Point:** `src/frontend/src/index.js`

#### Key Components
- `App.js` - Main application router
- `Navbar.jsx` - Navigation with cart badge and auth menu
- `Home.jsx` - Landing page with hero and featured products
- `ProductList.jsx` - Product catalog with search
- `Cart.jsx` - Shopping cart management
- `Checkout.jsx` - Order placement interface
- `Orders.jsx` - Order history with invoice downloads
- `Login.jsx` / `Register.jsx` - Authentication forms
- `RequireAuth.jsx` - Protected route wrapper

#### State Management
- `CartContext` - Cart items and operations
- `AuthContext` - User session and JWT token
- `localStorage` - Persistence for cart and auth

#### Routing
```
/ (Home)
├── /products (Product Catalog)
├── /cart (Shopping Cart)
├── /checkout (Protected - Checkout)
├── /orders (Protected - Order History)
├── /login (Login)
└── /register (Register)
```

### Backend (Express.js)
**Port:** 5000  
**Entry Point:** `src/backend/server.js`

#### API Endpoints
```
/api/auth
├── POST /register    - Create new user account
├── POST /login       - Authenticate and get JWT
└── GET  /me          - Get current user (protected)

/api/products
├── GET  /            - List all products
└── POST /            - Create product (future: admin only)

/api/orders
├── POST /            - Place order (protected)
├── GET  /my          - Get user's orders (protected)
├── GET  /:id         - Get order details (protected)
└── GET  /:id/invoice - Download PDF invoice (protected)
```

#### Middleware Stack
1. `express.json()` - Parse JSON bodies
2. `cors()` - Enable cross-origin requests
3. `authenticate` - JWT validation (protected routes)
4. Route handlers
5. Error handler (500 responses)

#### Database ORM (Sequelize)
- Models define schema and relationships
- Migrations handled via `sync({ alter: true })`
- Transactions for order creation
- Pessimistic locking for stock management

### Database (MySQL)
**Port:** 3306 (or 3307 if port conflict)  
**Database:** `handcrafted_marketplace`

#### Schema

**users**
```sql
id            INT PRIMARY KEY AUTO_INCREMENT
name          VARCHAR(255) NOT NULL
email         VARCHAR(255) UNIQUE NOT NULL
password_hash VARCHAR(255) NOT NULL
role          ENUM('buyer', 'seller', 'admin') DEFAULT 'buyer'
createdAt     TIMESTAMP
updatedAt     TIMESTAMP
```

**products**
```sql
id          INT PRIMARY KEY AUTO_INCREMENT
name        VARCHAR(255) NOT NULL
description TEXT
price       DECIMAL(10,2) NOT NULL
stock       INT NOT NULL DEFAULT 0
imageUrl    VARCHAR(500)
artisanName VARCHAR(255)
createdAt   TIMESTAMP
updatedAt   TIMESTAMP
```

**orders**
```sql
id        INT PRIMARY KEY AUTO_INCREMENT
userId    INT NOT NULL FOREIGN KEY → users(id)
total     DECIMAL(10,2) NOT NULL
status    ENUM('PLACED', 'PROCESSING', 'SHIPPED', 'DELIVERED')
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

**order_items**
```sql
id        INT PRIMARY KEY AUTO_INCREMENT
orderId   INT NOT NULL FOREIGN KEY → orders(id)
productId INT NOT NULL FOREIGN KEY → products(id)
name      VARCHAR(255)
price     DECIMAL(10,2)
qty       INT
lineTotal DECIMAL(10,2)
createdAt TIMESTAMP
updatedAt TIMESTAMP
```

## Data Flow Examples

### User Registration Flow
```
1. User fills form → POST /api/auth/register
2. Backend validates input
3. Password hashed with bcrypt (10 rounds)
4. User record created in database
5. JWT token generated (24h expiry)
6. Response: { user, token }
7. Frontend stores token in localStorage
8. Context updates auth state
9. User redirected to /products
```

### Place Order Flow
```
1. User clicks "Place Order" → POST /api/orders
2. Backend validates JWT token
3. Start database transaction
4. Lock product rows (FOR UPDATE)
5. Verify stock availability
6. Decrement stock for each item
7. Create order record
8. Create order_item records
9. Commit transaction
10. Response: { orderId, total, status }
11. Frontend clears cart
12. Redirect to /orders
```

### Generate Invoice Flow
```
1. User clicks "Download Invoice" → GET /api/orders/:id/invoice
2. Backend validates JWT and ownership
3. Fetch order with user and items
4. Generate PDF using PDFKit
5. Stream PDF chunks to response
6. Response headers: application/pdf, attachment
7. Browser downloads invoice_<id>.pdf
```

## Security Architecture

### Authentication & Authorization
- **Password Security:** bcrypt with salt rounds (10)
- **Token-Based Auth:** JWT with 24-hour expiry
- **Token Storage:** localStorage (frontend)
- **Protected Routes:** middleware checks JWT on backend, RequireAuth on frontend
- **Role-Based Access:** user.role field (buyer/seller/admin)

### API Security
- **CORS:** Configured for cross-origin requests
- **Input Validation:** Request body validation in controllers
- **SQL Injection Prevention:** Sequelize parameterized queries
- **Error Handling:** No sensitive data in error responses

### Database Security
- **Connection:** Environment variables for credentials
- **Transactions:** ACID compliance for order operations
- **Locking:** Pessimistic locks prevent race conditions
- **Constraints:** Foreign keys enforce referential integrity

## Deployment Architecture

### Development Environment
```
Docker MySQL Container (port 3306/3307)
    ↓
Backend (npm start on port 5000)
    ↓
Frontend (npm start on port 3000)
```

### Production Environment (Recommended)
```
Cloud Platform (AWS/Heroku/Azure)
├── Frontend: Static hosting (S3 + CloudFront / Netlify)
├── Backend: Container service (ECS / Heroku)
└── Database: Managed MySQL (RDS / ClearDB)
```

## Technology Stack Summary

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Frontend | React | 18.3.1 | UI framework |
| Frontend | React Router | 6.23.1 | Client-side routing |
| Frontend | Axios | 1.7.7 | HTTP client |
| Backend | Node.js | 22.19.0 | Runtime |
| Backend | Express | 4.19.2 | Web framework |
| Backend | Sequelize | 6.37.7 | ORM |
| Database | MySQL | 8.0 | Relational DB |
| Auth | JWT | 9.0.2 | Token auth |
| Security | bcryptjs | 2.4.3 | Password hashing |
| PDF | PDFKit | 0.15.2 | Invoice generation |
| Testing | Jest | 29.7.0 | Test framework |
| Testing | Supertest | 7.1.1 | API testing |
| Testing | React Testing Library | 16.3.0 | Component testing |
| DevOps | Docker | Latest | MySQL containerization |
| CI/CD | GitHub Actions | Latest | Automated pipeline |

## Performance Considerations

### Frontend Optimization
- Code splitting via React Router
- Lazy loading for routes
- Production build minification
- Image optimization (Unsplash CDN)

### Backend Optimization
- Database connection pooling (Sequelize default)
- Transaction-based operations
- Streaming for large files (PDF invoices)
- Efficient queries (eager loading for associations)

### Database Optimization
- Indexes on foreign keys (auto-created)
- Pessimistic locking for concurrency
- Connection pooling
- Query optimization via Sequelize

## Scalability Path

### Horizontal Scaling
- Load balancer → Multiple backend instances
- Session-less architecture (JWT tokens)
- Database read replicas
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Database connection pool tuning
- Caching layer (Redis)
- File storage service (S3)

---
**Last Updated:** November 10, 2025  
**Maintained By:** Breaking Code Team
