# Sprint 2 Notes

## Feature Highlights
- **Backend Auth (P30-13)** – Added Sequelize `User` model, secure bcrypt hashing, JWT issuance (24h), `/api/auth/register|login|me` endpoints, and middleware for token/role enforcement.
- **Orders & Stock (P30-14)** – Implemented `Order`/`OrderItem` models, transactional stock checks, `/api/orders` CRUD (create, my orders, detail), and strict error messaging for low inventory.
- **Invoice PDF (P30-15)** – Generated branded PDF invoices with product line-items and totals, protected via owner/admin checks at `/api/orders/:id/invoice`.
- **Frontend Auth + Orders (P30-16—18)** – Added Auth context with persistence, login/register screens, protected routes (`/cart`, `/checkout`, `/orders`), checkout flow that calls backend orders API, and Orders page with invoice download.
- **DevOps (P30-19)** – CI now injects `JWT_SECRET` from GitHub secrets, enforces 70% coverage thresholds, and uploads build/test/coverage artifacts for traceability.

## Key Endpoints
| Endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Create account, returns `{ user, token }`. |
| `/api/auth/login` | POST | Issue JWT for existing user. |
| `/api/auth/me` | GET | Authenticated profile lookup. |
| `/api/orders` | POST | Place order (`items: [{ productId, qty }]`), handles stock decrements. |
| `/api/orders/my` | GET | Orders belonging to authenticated user. |
| `/api/orders/:id` | GET | Order details (owner/admin). |
| `/api/orders/:id/invoice` | GET | Streams PDF invoice (owner/admin). |

## Frontend Flows
1. **Register / Login** – Forms post to auth API, store `{ token, user }` in context + `localStorage`, and redirect to `/products`.
2. **Protected Routes** – `RequireAuth` guards `/cart`, `/checkout`, `/orders`, redirecting to `/login` with the original destination in state.
3. **Checkout** – Cart summary calls `createOrder`, clears cart, then navigates to `/orders` once backend responds.
4. **Orders + Invoice** – Orders page fetches `/orders/my`, lists totals/status, and downloads invoices via blob when requested.

## Screenshots
> Replace placeholders with actual captures before submission.

- `assets/backend-auth.png` – Postman flow showing register/login/me.
- `assets/frontend-auth-flow.png` – Login screen + protected route redirect.
- `assets/checkout-success.png` – Checkout confirmation and Orders page.

## Next Up
- Expand automated tests to cover auth/orders controllers for even stronger coverage guarantees.
- Add artisan/admin role-specific UI (e.g., order management dashboards).
- Integrate real MySQL credentials via GitHub environments and Terraform-managed secrets.
