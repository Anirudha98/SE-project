# Deployment Guide

## Quick Start (One-Command Setup)

### Prerequisites
- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed
- PowerShell (Windows) or Bash (Linux/Mac)

### One-Command Deployment

**Windows (PowerShell):**
```powershell
# Clone and setup everything
git clone https://github.com/your-org/SE-project.git; cd SE-project; docker run -d --name mysql-handcraft -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=handcrafted_db -e MYSQL_USER=dbuser -e MYSQL_PASSWORD=dbpass -p 3307:3306 --default-authentication-plugin=mysql_native_password mysql:8.0; cd src/backend; npm install; Start-Process -NoNewWindow node server.js; cd ../frontend; npm install; npm start
```

**Linux/Mac (Bash):**
```bash
# Clone and setup everything
git clone https://github.com/your-org/SE-project.git && \
cd SE-project && \
docker run -d --name mysql-handcraft \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=handcrafted_db \
  -e MYSQL_USER=dbuser \
  -e MYSQL_PASSWORD=dbpass \
  -p 3307:3306 \
  --default-authentication-plugin=mysql_native_password \
  mysql:8.0 && \
cd src/backend && npm install && node server.js & \
cd ../frontend && npm install && npm start
```

---

## Step-by-Step Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-org/SE-project.git
cd SE-project
```

### 2. Database Setup (MySQL with Docker)

**Start MySQL Container:**
```bash
docker run -d \
  --name mysql-handcraft \
  -e MYSQL_ROOT_PASSWORD=rootpass \
  -e MYSQL_DATABASE=handcrafted_db \
  -e MYSQL_USER=dbuser \
  -e MYSQL_PASSWORD=dbpass \
  -p 3307:3306 \
  --default-authentication-plugin=mysql_native_password \
  mysql:8.0
```

**Verify Container is Running:**
```bash
docker ps
```

You should see:
```
CONTAINER ID   IMAGE       PORTS                    NAMES
abcd1234efgh   mysql:8.0   33060/tcp, 0.0.0.0:3307->3306/tcp   mysql-handcraft
```

**Test Database Connection:**
```bash
docker exec -it mysql-handcraft mysql -udbuser -pdbpass handcrafted_db -e "SELECT 1;"
```

Expected output:
```
+---+
| 1 |
+---+
| 1 |
+---+
```

---

### 3. Backend Setup

**Navigate to Backend:**
```bash
cd src/backend
```

**Install Dependencies:**
```bash
npm install
```

This installs:
- express (4.19.2)
- sequelize (6.37.7)
- mysql2 (3.11.5)
- jsonwebtoken (9.0.2)
- bcryptjs (2.4.3)
- pdfkit (0.15.2)
- cors (2.8.5)
- dotenv (16.4.7)

**Configure Environment (Optional):**

Create `.env` file if you need custom settings:
```bash
# Database
DB_HOST=localhost
DB_PORT=3307
DB_NAME=handcrafted_db
DB_USER=dbuser
DB_PASSWORD=dbpass

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Server
PORT=5000
```

**Start Backend Server:**
```bash
node server.js
```

Expected output:
```
Executing (default): SELECT 1+1 AS result
✓ Database connected!
✓ Database synced!
🚀 Server running on port 5000
```

**Test Backend API:**

Open new terminal and run:
```bash
curl http://localhost:5000/api
```

Expected: `Welcome to Handcrafted Marketplace API`

---

### 4. Frontend Setup

**Open New Terminal** and navigate to frontend:
```bash
cd src/frontend
```

**Install Dependencies:**
```bash
npm install
```

This installs:
- react (18.3.1)
- react-router-dom (6.23.1)
- axios (1.7.7)
- React Testing Library packages

**Start Development Server:**
```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000

Note that the development build is not optimized.
To create a production build, use npm run build.

webpack compiled successfully
```

**Access Application:**
Open browser to: `http://localhost:3000`

---

## Production Deployment

### Build Frontend for Production

```bash
cd src/frontend
npm run build
```

This creates optimized production build in `src/frontend/build/` directory.

Output:
```
Creating an optimized production build...
Compiled successfully.

File sizes after gzip:

  74.66 kB  build/static/js/main.abc123.js
  1.78 kB   build/static/css/main.xyz789.css

The build folder is ready to be deployed.
```

### Serve Production Build

**Option 1: Using serve package**
```bash
npm install -g serve
serve -s build -l 3000
```

**Option 2: Using Express static server**

Create `src/frontend/production-server.js`:
```javascript
const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Production server running on port ${PORT}`);
});
```

Run:
```bash
node production-server.js
```

---

## Docker Compose Deployment (Recommended)

Create `docker-compose.yml` in project root:

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: mysql-handcraft
    environment:
      MYSQL_ROOT_PASSWORD: rootpass
      MYSQL_DATABASE: handcrafted_db
      MYSQL_USER: dbuser
      MYSQL_PASSWORD: dbpass
    ports:
      - "3307:3306"
    command: --default-authentication-plugin=mysql_native_password
    volumes:
      - mysql-data:/var/lib/mysql
    networks:
      - handcraft-network

  backend:
    build: ./src/backend
    container_name: handcraft-backend
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_NAME: handcrafted_db
      DB_USER: dbuser
      DB_PASSWORD: dbpass
      JWT_SECRET: your-production-jwt-secret
      PORT: 5000
    ports:
      - "5000:5000"
    depends_on:
      - mysql
    networks:
      - handcraft-network

  frontend:
    build: ./src/frontend
    container_name: handcraft-frontend
    ports:
      - "3000:3000"
    depends_on:
      - backend
    networks:
      - handcraft-network

volumes:
  mysql-data:

networks:
  handcraft-network:
    driver: bridge
```

Create `src/backend/Dockerfile`:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
```

Create `src/frontend/Dockerfile`:
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
```

**Deploy with Docker Compose:**
```bash
docker-compose up -d
```

**Check Status:**
```bash
docker-compose ps
```

**View Logs:**
```bash
docker-compose logs -f
```

**Stop Services:**
```bash
docker-compose down
```

---

## Environment Configuration

### Development (.env files)

**Backend (`src/backend/.env`):**
```env
DB_HOST=localhost
DB_PORT=3307
DB_NAME=handcrafted_db
DB_USER=dbuser
DB_PASSWORD=dbpass
JWT_SECRET=dev-secret-key
PORT=5000
NODE_ENV=development
```

**Frontend (`src/frontend/.env`):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Production

**Backend:**
```env
DB_HOST=your-db-host.com
DB_PORT=3306
DB_NAME=handcrafted_db
DB_USER=prod_user
DB_PASSWORD=strong-production-password
JWT_SECRET=very-strong-jwt-secret-min-32-chars
PORT=5000
NODE_ENV=production
```

**Frontend:**
```env
REACT_APP_API_URL=https://api.your-domain.com/api
```

---

## Testing the Deployment

### 1. Health Checks

**Backend API:**
```bash
curl http://localhost:5000/api
```

**Frontend:**
```bash
curl http://localhost:3000
```

### 2. Database Connection

```bash
docker exec -it mysql-handcraft mysql -udbuser -pdbpass -e "SHOW DATABASES;"
```

### 3. Run Test Suites

**Backend Tests:**
```bash
cd src/backend
npm test
```

**Frontend Tests:**
```bash
cd src/frontend
npm test
```

**Linting:**
```bash
# Backend
cd src/backend
npm run lint

# Frontend
cd src/frontend
npm run lint
```

### 4. Smoke Test

**Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123","role":"buyer"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123"}'
```

**Get Products:**
```bash
curl http://localhost:5000/api/products
```

---

## Database Management

### Seed Sample Products

Use the provided PowerShell script:
```powershell
.\add-products.ps1
```

Or manually add via API:
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Handmade Ceramic Bowl",
    "description": "Beautiful handcrafted bowl",
    "price": 45.00,
    "stock": 10,
    "imageUrl": "https://example.com/image.jpg",
    "artisanName": "John Artisan"
  }'
```

### Database Backup

```bash
docker exec mysql-handcraft mysqldump -udbuser -pdbpass handcrafted_db > backup.sql
```

### Database Restore

```bash
docker exec -i mysql-handcraft mysql -udbuser -pdbpass handcrafted_db < backup.sql
```

### Reset Database

```bash
docker exec -it mysql-handcraft mysql -udbuser -pdbpass -e "DROP DATABASE handcrafted_db; CREATE DATABASE handcrafted_db;"
```

Then restart backend to sync tables:
```bash
cd src/backend
node server.js
```

---

## Troubleshooting

### Issue: "Cannot connect to MySQL"

**Solution 1:** Check Docker container is running
```bash
docker ps
docker logs mysql-handcraft
```

**Solution 2:** Verify port is not in use
```bash
# Windows
netstat -ano | findstr :3307

# Linux/Mac
lsof -i :3307
```

**Solution 3:** Restart MySQL container
```bash
docker restart mysql-handcraft
```

### Issue: "Port 5000 already in use"

**Windows:**
```powershell
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Linux/Mac:**
```bash
lsof -ti:5000 | xargs kill -9
```

### Issue: "Frontend can't connect to backend"

**Check 1:** Verify backend is running
```bash
curl http://localhost:5000/api
```

**Check 2:** Check CORS configuration in `src/backend/server.js`:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

**Check 3:** Verify API URL in frontend
Check `src/frontend/src/api/axios.js` has correct base URL.

### Issue: "JWT Token Invalid"

**Solution:** JWT secret must match between registration and login.

Check `src/backend/.env` has consistent `JWT_SECRET`.

Clear browser localStorage:
```javascript
// In browser console
localStorage.clear();
```

### Issue: "Tests Failing"

**Solution 1:** Install all dependencies
```bash
npm install
```

**Solution 2:** Ensure MySQL container is running (for integration tests)
```bash
docker ps
```

**Solution 3:** Clear Jest cache
```bash
npm test -- --clearCache
```

### Issue: "Docker Permission Denied"

**Windows:** Make sure Docker Desktop is running

**Linux:** Add user to docker group
```bash
sudo usermod -aG docker $USER
newgrp docker
```

### Issue: "Node Version Mismatch"

Check Node version:
```bash
node --version
```

Required: Node 18+

Update Node:
- Windows: Download from [nodejs.org](https://nodejs.org)
- Linux: `nvm install 18`
- Mac: `brew install node@18`

---

## CI/CD Pipeline

The project uses GitHub Actions for continuous integration.

**Workflow file:** `.github/workflows/ci.yml`

**Pipeline Steps:**
1. Checkout code
2. Setup Node.js 18
3. Install dependencies (backend + frontend)
4. Run ESLint (backend + frontend)
5. Run tests (backend + frontend)
6. Build production frontend
7. Upload build artifacts

**Trigger on:**
- Push to `main` or `develop` branches
- Pull requests to `main`

**View Pipeline Status:**
```bash
# After pushing to GitHub
git push origin develop
```

Check: `https://github.com/your-org/SE-project/actions`

---

## Production Checklist

### Security
- [ ] Change default JWT_SECRET
- [ ] Use strong database passwords
- [ ] Enable HTTPS/SSL
- [ ] Configure CORS whitelist
- [ ] Add rate limiting
- [ ] Enable SQL injection protection (Sequelize parameterized queries already used)
- [ ] Add helmet.js for security headers

### Performance
- [ ] Enable gzip compression
- [ ] Setup CDN for static assets
- [ ] Add Redis for session/cache
- [ ] Configure database indexes
- [ ] Enable query logging and optimization

### Monitoring
- [ ] Setup error tracking (Sentry, Rollbar)
- [ ] Add application monitoring (New Relic, Datadog)
- [ ] Configure logging (Winston, Bunyan)
- [ ] Setup uptime monitoring (Pingdom, UptimeRobot)

### Backup
- [ ] Automated database backups
- [ ] Code repository backups
- [ ] Environment variable backups
- [ ] Document recovery procedures

---

## Useful Commands

### Development

```bash
# Start everything (separate terminals)
docker start mysql-handcraft
cd src/backend && node server.js
cd src/frontend && npm start

# Run tests
cd src/backend && npm test
cd src/frontend && npm test

# Lint code
cd src/backend && npm run lint
cd src/frontend && npm run lint

# Build production
cd src/frontend && npm run build
```

### Docker Management

```bash
# List containers
docker ps -a

# View logs
docker logs mysql-handcraft -f

# Stop container
docker stop mysql-handcraft

# Remove container
docker rm mysql-handcraft

# Remove image
docker rmi mysql:8.0

# Clean up unused resources
docker system prune -a
```

### Git Workflow

```bash
# Feature branch
git checkout -b feature/new-feature
git add .
git commit -m "feat: Add new feature"
git push origin feature/new-feature

# Merge to develop
git checkout develop
git merge feature/new-feature
git push origin develop
```

---

## Support

**Documentation:**
- API Endpoints: `/docs/api-endpoints.md`
- System Architecture: `/docs/system-architecture.md`
- Sprint 3 Report: `/docs/sprint3-demo-report.md`

**Team Contact:**
- Backend Lead: backend-lead@example.com
- Frontend Lead: frontend-lead@example.com
- DevOps: devops@example.com

**Issue Tracking:**
GitHub Issues: `https://github.com/your-org/SE-project/issues`

---

**Last Updated:** November 10, 2025  
**Version:** 1.0.0  
**Maintained By:** Breaking Code Team
