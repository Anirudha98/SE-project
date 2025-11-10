# Online Marketplace for Handcrafted Goods

![CI](https://github.com/Anirudha98/SE-project-/actions/workflows/ci.yml/badge.svg?branch=develop)

**Project ID:** P30  
**Course:** UE23CS341A  
**Academic Year:** 2025  
**Semester:** 5th Sem  
**Campus:** RR  
**Branch:** AIML  
**Section:** A  
**Team:** Breaking Code

## 📋 Project Description

A storefront that allows artisans to list handmade items, buyers to place orders, and view simple sales and inventory reports. The project uses a relational database for product/catalog management, shopping-cart workflows, and PDF invoice generation.

This repository contains the source code and documentation for the Online Marketplace for Handcrafted Goods project, developed as part of the UE23CS341A course at PES University.

## 🧑‍💻 Development Team (Breaking Code)

- [@AkashGB-1234](https://github.com/AkashGB-1234) - Scrum Master
- [@pes1ug23am052anish](https://github.com/pes1ug23am052anish) - Developer Team
- [@Akshay2005K](https://github.com/Akshay2005K) - Developer Team
- [@Anirudha98](https://github.com/Anirudha98) - Developer Team

## 👨‍🏫 Teaching Assistant

- [@jash00007](https://github.com/jash00007)
- [@nh2seven](https://github.com/nh2seven)

## 👨‍⚖️ Faculty Supervisor

- [@prakasheeralli](https://github.com/prakasheeralli)


## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Docker Desktop installed and running
- Git installed

### Quick Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Anirudha98/SE-project-.git
   cd SE-project-
   ```

2. **Start MySQL Database (Docker)**
   ```bash
   docker run -d --name mysql-handcraft -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=handcrafted_db -e MYSQL_USER=dbuser -e MYSQL_PASSWORD=dbpass -p 3307:3306 mysql:8.0 --default-authentication-plugin=mysql_native_password
   ```

3. **Configure Backend Environment**
   ```powershell
   cd src/backend
   Copy-Item .env.example .env
   ```
   Update `src/backend/.env` if you tweaked database credentials or ports.

4. **Setup Backend**
   ```bash
   cd src/backend
   copy .env.example .env
   npm install
   node server.js
   ```

5. **Setup Frontend** (in new terminal)
   ```bash
   cd src/frontend
   npm install
   npm start
   ```

6. **Access Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000/api

📖 **For detailed setup instructions, see [Deployment Guide](docs/deployment-guide.md)**

## 📁 Project Structure

```
PESU_RR_AIML_A_P30_Online_Marketplace_for_Handcrafted_Goods_Breaking-Code/
├── src/                 # Source code
├── docs/               # Documentation
├── tests/              # Test files
├── .github/            # GitHub workflows and templates
├── README.md          # This file
└── ...
```

## 🛠️ Development Guidelines

### Branching Strategy
- `main`: Production-ready code
- `develop`: Development branch
- `feature/*`: Feature branches
- `bugfix/*`: Bug fix branches

### Commit Messages
Follow conventional commit format:
- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Test-related changes

### Code Review Process
1. Create feature branch from `develop`
2. Make changes and commit
3. Create Pull Request to `develop`
4. Request review from team members
5. Merge after approval

## 📚 Documentation

- [API Endpoints](docs/api-endpoints.md) - Complete API reference
- [System Architecture](docs/system-architecture.md) - Architecture diagrams and design
- [Deployment Guide](docs/deployment-guide.md) - Setup and deployment instructions
- [Sprint 3 Demo Report](docs/sprint3-demo-report.md) - Latest sprint deliverables

## 🧪 Testing

```bash
# Backend tests
cd src/backend
npm test

# Frontend tests
cd src/frontend
npm test

# Run with coverage
npm test -- --coverage
```

## ✨ Features

- 🔐 **User Authentication** - JWT-based login/register
- 🛍️ **Product Catalog** - Browse handcrafted items
- 🛒 **Shopping Cart** - Add items and checkout
- 📦 **Order Management** - Track orders and history
- 📄 **Invoice Generation** - Downloadable PDF invoices
- 🎨 **Modern UI** - Gradient navbar with cart badge
- ✅ **CI/CD Pipeline** - Automated testing and builds

## 🔧 Tech Stack

**Frontend:** React 18, React Router, Axios, Context API  
**Backend:** Node.js, Express, Sequelize, JWT  
**Database:** MySQL 8.0  
**Testing:** Jest, Supertest, React Testing Library  
**DevOps:** Docker, GitHub Actions, ESLint

## 📄 License

This project is developed for educational purposes as part of the PES University UE23CS341A curriculum.

---

**Course:** UE23CS341A  
**Institution:** PES University  
**Academic Year:** 2025  
**Semester:** 5th Sem
