docker logs -f handcrafted-db
Local Development Setup (Node)

This document explains how to run the backend and frontend locally without Docker. If you prefer using containers, you can reintroduce a docker-compose setup; currently the repository ships without an opinionated container configuration.

Prerequisites
- Node.js (v16+ recommended)
- npm
- (Optional) MySQL server if you want a persistent database

1) Configure backend environment
Copy the example env file and update the JWT secret and DB connection values:

```powershell
copy .\src\backend\.env.example .\src\backend\.env
# Edit src/backend/.env and set JWT_SECRET and DB credentials (DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
```

If you don't have MySQL, install it locally and create a database named in `DB_NAME` or change `DB_NAME` to an existing DB. Alternatively, run the test suite which uses in-memory DB behavior in test mode.

2) Install dependencies
```powershell
# from repo root
npm install --prefix src/backend
npm install --prefix src/frontend
```

3) Start backend and frontend
Start the backend and frontend in separate terminals (recommended):

Terminal A (backend):
```powershell
cd src/backend
npm start
# or: node server.js
```

Terminal B (frontend):
```powershell
cd src/frontend
npm start
```

4) Verify endpoints and UI
- Backend API: http://localhost:5000/api/products
- Catalog endpoint: http://localhost:5000/api/catalog
- Frontend App: http://localhost:3000 (CRA default)

5) Run tests
```powershell
# backend tests
npm test --prefix src/backend
# frontend tests
npm test --prefix src/frontend -- --watchAll=false
```

Notes
- The backend `src/backend/.env.example` includes placeholders for DB credentials and `JWT_SECRET`.
- For CI, ensure `JWT_SECRET` is stored in GitHub repository secrets and injected into the CI workflow.
