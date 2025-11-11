# GitHub Repository Setup Guide

## Important: Configure GitHub Secrets

The CI/CD pipeline requires the following GitHub secrets to be configured:

### Required Secrets:

1. **JWT_SECRET**: 
   - Navigate to: Repository Settings → Secrets and variables → Actions → New repository secret
   - Name: `JWT_SECRET`
   - Value: A random secure string (e.g., generated using `openssl rand -base64 32`)

### Steps to Add Secrets:

1. Go to your repository: https://github.com/Anirudha98/SE-project
2. Click on **Settings**
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Add the `JWT_SECRET` with a secure random value

## CI/CD Pipeline

The repository includes a GitHub Actions workflow (`.github/workflows/ci.yml`) that:

- Runs on every push and pull request
- Installs dependencies for both frontend and backend
- Runs linting checks
- Executes tests with coverage
- Builds the frontend application
- Uploads build artifacts and coverage reports

## Local Development Setup

### Backend Setup
```bash
cd src/backend
npm install
# Create .env file based on .env.example
npm run dev
```

### Frontend Setup
```bash
cd src/frontend
npm install
npm start
```

### Running Tests
```bash
# Backend tests
cd src/backend
npm test

# Frontend tests
cd src/frontend
npm test
```

## Project Structure

- `.github/workflows/` - CI/CD pipeline configuration
- `src/backend/` - Node.js/Express backend API
- `src/frontend/` - React frontend application
- `docs/` - Project documentation

