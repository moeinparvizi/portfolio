# 📚 Portfolio Deployment & Developer Guide

Complete guide for deploying and developing this portfolio website.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Project Architecture](#project-architecture)
4. [Database Schema](#database-schema)
5. [API Reference](#api-reference)
6. [Frontend Architecture](#frontend-architecture)
7. [Deployment Options](#deployment-options)
8. [Docker Deployment](#docker-deployment)
9. [Production Configuration](#production-configuration)
10. [Troubleshooting](#troubleshooting)

---

## 🛠️ Prerequisites

### Required Software

| Software | Version | Download |
|----------|---------|----------|
| Node.js | 20+ | https://nodejs.org |
| pnpm | 8+ | https://pnpm.io |
| PostgreSQL | 14+ | https://postgresql.org |
| Git | 2+ | https://git-scm.com |

### Optional (for Docker deployment)

| Software | Version | Download |
|----------|---------|----------|
| Docker | 20+ | https://docker.com |
| Docker Compose | 2+ | https://docs.docker.com/compose |

---

## 🚀 Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/moeinparvizi/portfolio.git
cd portfolio
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This installs dependencies for both frontend and backend.

### Step 3: Setup PostgreSQL

Make sure PostgreSQL is running, then create the database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE portfolio;

# Exit psql
\q
```

### Step 4: Configure Environment Variables

```bash
# Navigate to backend
cd apps/backend

# Copy example env file
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/portfolio

# JWT Secrets (generate your own!)
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this

# Server
PORT=3000
CORS_ORIGINS=http://localhost:4200

# Upload
UPLOAD_DIR=./uploads
```

### Step 5: Run Database Migrations

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### Step 6: Seed Database

```bash
# Create admin user and default data
npx ts-node prisma/seed.ts
```

Default credentials:
- **Username:** admin
- **Password:** admin123

### Step 7: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm start:dev
```

Backend runs at: http://localhost:3000

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm start
```

Frontend runs at: http://localhost:4200

### Step 8: Verify Installation

Open browser and check:

| URL | Description |
|-----|-------------|
| http://localhost:4200/en | Public website |
| http://localhost:4200/admin/login | Admin login |
| http://localhost:3000/api/docs | Swagger docs |
| http://localhost:3000/health | Health check |

---

## 🏗️ Project Architecture

### Monorepo Structure

```
portfolio/
├── apps/
│   ├── frontend/          # Angular 22 Application
│   └── backend/           # NestJS 11 API
├── docker-compose.yml     # Docker configuration
├── .env.example           # Environment template
├── package.json           # Root package.json
└── pnpm-workspace.yaml    # pnpm workspace config
```

### Backend Architecture (NestJS)

```
apps/backend/src/
├── main.ts                    # Application entry point
├── app.module.ts              # Root module
├── prisma/                    # Database layer
│   ├── prisma.module.ts       # Prisma module
│   └── prisma.service.ts      # Prisma client service
├── auth/                      # Authentication
│   ├── auth.module.ts
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── strategies/            # JWT strategies
│   └── dto/                   # Data transfer objects
├── common/                    # Shared utilities
│   ├── guards/                # Auth guards
│   ├── decorators/            # Custom decorators
│   └── pipes/                 # Validation pipes
├── profile/                   # Profile module
├── skills/                    # Skills module
├── projects/                  # Projects module
├── experience/                # Experience module
├── education/                 # Education module
├── testimonials/              # Testimonials module
├── contact/                   # Contact messages
├── settings/                  # Site settings
├── resume/                    # PDF generation
└── upload/                    # File uploads
```

### Request Flow

```
Client Request
     ↓
Controller (handles HTTP)
     ↓
Service (business logic)
     ↓
PrismaService (database)
     ↓
PostgreSQL
```

### Frontend Architecture (Angular)

```
apps/frontend/src/
├── main.ts                    # Bootstrap
├── app/
│   ├── app.ts                 # Root component
│   ├── app.routes.ts          # Route definitions
│   ├── app.config.ts          # App configuration
│   ├── core/                  # Core services
│   │   ├── services/          # API, Auth, Theme services
│   │   ├── guards/            # Route guards
│   │   ├── interceptors/      # HTTP interceptors
│   │   └── models/            # TypeScript interfaces
│   ├── shared/                # Reusable components
│   │   ├── components/        # UI components
│   │   ├── pipes/             # Custom pipes
│   │   └── styles/            # SCSS tokens & mixins
│   ├── layouts/               # Layout components
│   │   ├── public-layout/     # Public site layout
│   │   └── admin-layout/      # Admin dashboard layout
│   └── pages/                 # Page components
│       ├── home/              # Homepage
│       ├── about/             # About page
│       ├── skills/            # Skills page
│       ├── projects/          # Projects page
│       ├── experience/        # Experience page
│       ├── education/         # Education page
│       ├── testimonials/      # Testimonials page
│       ├── contact/           # Contact page
│       ├── not-found/         # 404 page
│       └── admin/             # Admin pages
│           ├── dashboard/
│           ├── profile/
│           ├── skills/
│           ├── projects/
│           └── ...
└── styles.scss                # Global styles
```

### Component Communication

```
Parent Component
     ↓ @Input()
Child Component
     ↓ @Output()
Parent Component
```

### State Management

- **Signals** - Angular signals for reactive state
- **Services** - Injectable services for shared state
- **localStorage** - Persist user preferences

---

## 🗄️ Database Schema

### Core Tables

```sql
-- Users (Admin authentication)
User {
  id UUID (PK)
  username String (unique)
  passwordHash String
  createdAt DateTime
  updatedAt DateTime
}

-- Profile (Personal information)
Profile {
  id UUID (PK)
  fullName JSON      -- { en, fa, de }
  jobTitle JSON      -- { en, fa, de }
  summary JSON       -- { en, fa, de }
  avatarUrl String?
  socialLinks JSON
  heroText JSON      -- { en, fa, de }
  heroCtaLabel JSON  -- { en, fa, de }
  heroCtaLink String?
}

-- Skills
Skill {
  id UUID (PK)
  name JSON          -- { en, fa, de }
  category String?
  level Int?         -- 1-5
  icon String?
  sortOrder Int
}

-- Projects
Project {
  id UUID (PK)
  title JSON         -- { en, fa, de }
  description JSON   -- { en, fa, de }
  summary JSON       -- { en, fa, de }
  images JSON        -- string[]
  tags String[]
  category String?
  liveUrl String?
  githubUrl String?
  status Enum        -- draft | published
  featured Boolean
  includeInResume Boolean
}

-- Experience
Experience {
  id UUID (PK)
  company JSON       -- { en, fa, de }
  position JSON      -- { en, fa, de }
  description JSON   -- { en, fa, de }
  startDate DateTime
  endDate DateTime?
  isCurrent Boolean
  location String?
  includeInResume Boolean
}

-- Education
Education {
  id UUID (PK)
  institution JSON   -- { en, fa, de }
  degree JSON        -- { en, fa, de }
  fieldOfStudy JSON  -- { en, fa, de }
  description JSON   -- { en, fa, de }
  startDate DateTime
  endDate DateTime?
  includeInResume Boolean
}

-- Testimonials
Testimonial {
  id UUID (PK)
  name String
  role JSON?         -- { en, fa, de }
  company String?
  content JSON       -- { en, fa, de }
  avatarUrl String?
  rating Int?
  approved Boolean
  visible Boolean
}

-- Contact Messages
ContactMessage {
  id UUID (PK)
  name String
  email String
  subject String?
  message String
  read Boolean
  replied Boolean
}

-- Site Settings
SiteSettings {
  id UUID (PK)
  key String (unique)
  value JSON
}
```

### Translation Strategy

All user-facing text is stored as JSON with locale keys:

```json
{
  "en": "Hello",
  "fa": "سلام",
  "de": "Hallo"
}
```

Fallback chain: Current locale → English → First available

---

## 📡 API Reference

### Authentication

```bash
# Login
POST /api/auth/login
Body: { "username": "admin", "password": "admin123" }
Response: { "accessToken": "...", "refreshToken": "..." }

# Refresh Token
POST /api/auth/refresh
Body: { "refreshToken": "..." }
Response: { "accessToken": "...", "refreshToken": "..." }

# Get Profile
GET /api/auth/profile
Header: Authorization: Bearer <token>
```

### Public Endpoints

```bash
# Profile
GET /api/profile

# Skills
GET /api/skills
GET /api/skills/:id

# Projects
GET /api/projects
GET /api/projects/featured
GET /api/projects/:id

# Experience
GET /api/experience

# Education
GET /api/education

# Testimonials
GET /api/testimonials
POST /api/testimonials

# Contact
POST /api/contact

# Settings
GET /api/settings/:key
```

### Admin Endpoints (JWT Required)

```bash
# Profile
PUT /api/profile

# Skills
POST /api/skills
PUT /api/skills/:id
DELETE /api/skills/:id

# Projects
POST /api/projects
PUT /api/projects/:id
DELETE /api/projects/:id

# Experience
POST /api/experience
PUT /api/experience/:id
DELETE /api/experience/:id

# Education
POST /api/education
PUT /api/education/:id
DELETE /api/education/:id

# Testimonials
GET /api/testimonials/admin/all
PUT /api/testimonials/:id
PUT /api/testimonials/:id/approve
DELETE /api/testimonials/:id

# Contact
GET /api/contact
PUT /api/contact/:id/read
DELETE /api/contact/:id

# Settings
GET /api/settings
PUT /api/settings/:key

# Upload
POST /api/upload/image

# Resume
POST /api/resume/generate
```

### Example Request with Auth

```bash
# Get access token first
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}' \
  | jq -r '.accessToken')

# Use token in requests
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3000/api/profile
```

---

## 🎨 Frontend Architecture

### Routing Structure

```typescript
// Public routes
/:locale/              // Homepage
/:locale/about         // About page
/:locale/skills        // Skills page
/:locale/projects      // Projects list
/:locale/projects/:id  // Project detail
/:locale/experience    // Experience page
/:locale/education     // Education page
/:locale/testimonials  // Testimonials page
/:locale/contact       // Contact page

// Admin routes
/admin/login           // Login page
/admin/dashboard       // Dashboard
/admin/profile         // Profile management
/admin/skills          // Skills management
/admin/projects        // Projects management
/admin/experience      // Experience management
/admin/education       // Education management
/admin/testimonials    // Testimonials management
/admin/contact         // Messages
/admin/settings        // Settings
/admin/resume          // Resume builder
```

### Component Lifecycle

```
ngOnInit()       → Component initialized
ngOnChanges()    → Input properties change
ngAfterViewInit() → View initialized
ngOnDestroy()    → Component destroyed
```

### HTTP Interceptor Flow

```
Request → Add Token → Backend
Backend → Response → Check 401 → Redirect to Login
```

### State Management Pattern

```typescript
// Using Angular Signals
@Component({...})
export class MyComponent {
  // State
  items = signal<Item[]>([]);
  loading = signal(false);

  // Computed
  itemCount = computed(() => this.items().length);

  // Methods
  loadItems() {
    this.loading.set(true);
    this.api.getItems().subscribe({
      next: (items) => {
        this.items.set(items);
        this.loading.set(false);
      }
    });
  }
}
```

---

## 🚀 Deployment Options

### Option 1: Vercel (Frontend) + Railway (Backend)

#### Frontend on Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your repository
4. Configure:
   - **Framework Preset:** Angular
   - **Build Command:** `cd apps/frontend && pnpm install && pnpm build`
   - **Output Directory:** `apps/frontend/dist/frontend/browser`
5. Add environment variables
6. Deploy

#### Backend on Railway

1. Go to https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Deploy your backend
5. Set environment variables:
   ```
   DATABASE_URL=<from PostgreSQL service>
   JWT_SECRET=<your-secret>
   JWT_REFRESH_SECRET=<your-refresh-secret>
   ```

### Option 2: VPS with Docker

```bash
# SSH into your VPS
ssh user@your-server

# Clone repository
git clone https://github.com/moeinparvizi/portfolio.git
cd portfolio

# Create .env file
cp .env.example .env
nano .env  # Edit with your values

# Start with Docker
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx ts-node prisma/seed.ts
```

### Option 3: Manual Deployment

#### Backend

```bash
cd apps/backend

# Install production dependencies
pnpm install --prod

# Build
pnpm build

# Run with PM2 or similar
pm2 start dist/main.js --name portfolio-api
```

#### Frontend

```bash
cd apps/frontend

# Install dependencies
pnpm install

# Build for production
pnpm build

# Serve with nginx or similar
# Copy dist/frontend/browser to nginx html directory
```

---

## 🐳 Docker Deployment

### Docker Compose Files

**docker-compose.yml** (Development):
```yaml
version: '3.8'

services:
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: portfolio
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: portfolio
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  backend:
    build: ./apps/backend
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://portfolio:portfolio@db:5432/portfolio
    depends_on:
      - db

  frontend:
    build: ./apps/frontend
    ports:
      - "4200:80"
    depends_on:
      - backend

volumes:
  pgdata:
```

### Building Docker Images

```bash
# Build all services
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Running Docker Services

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

### Docker Commands Reference

```bash
# Enter backend container
docker-compose exec backend sh

# Enter database container
docker-compose exec db psql -U portfolio

# View running containers
docker-compose ps

# Restart a service
docker-compose restart backend
```

---

## ⚙️ Production Configuration

### Environment Variables

```env
# Database
DATABASE_URL=postgresql://user:password@host:5432/portfolio

# JWT (use strong secrets!)
JWT_SECRET=your-256-bit-secret-here
JWT_REFRESH_SECRET=your-256-bit-refresh-secret-here
JWT_EXPIRATION=15m
REFRESH_EXPIRATION=7d

# Server
PORT=3000
CORS_ORIGINS=https://yourdomain.com

# Upload
UPLOAD_DIR=/var/uploads

# reCAPTCHA (optional)
RECAPTCHA_SECRET=your-recaptcha-secret
RECAPTCHA_SITE_KEY=your-recaptcha-site-key
```

### Security Checklist

- [ ] Change default admin password
- [ ] Generate strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable Helmet.js headers
- [ ] Validate all inputs
- [ ] Sanitize user inputs
- [ ] Set up backups

### Performance Optimization

- [ ] Enable gzip compression
- [ ] Set up CDN for static assets
- [ ] Configure browser caching
- [ ] Optimize images (WebP format)
- [ ] Enable HTTP/2
- [ ] Set up database connection pooling

### Monitoring

```bash
# Health check endpoint
curl http://your-server:3000/health

# Response
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "uptime": 12345.678
}
```

---

## 🔧 Troubleshooting

### Common Issues

#### 1. Database Connection Error

```
Error: Can't reach database server
```

**Solution:**
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check connection
psql -U portfolio -h localhost
```

#### 2. Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find process using port
lsof -ti:3000

# Kill the process
kill -9 <PID>
```

#### 3. Prisma Migration Error

```
Error: Migration failed
```

**Solution:**
```bash
# Reset database
npx prisma migrate reset

# Re-run migrations
npx prisma migrate dev

# Re-seed
npx ts-node prisma/seed.ts
```

#### 4. Frontend Build Error

```
Error: Module not found
```

**Solution:**
```bash
# Clear node_modules
rm -rf node_modules

# Reinstall
pnpm install

# Rebuild
pnpm build
```

#### 5. JWT Token Expired

```bash
# Use refresh token to get new access token
curl -X POST http://localhost:3000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "your-refresh-token"}'
```

### Logs

```bash
# Backend logs (development)
pnpm start:dev

# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# PostgreSQL logs
docker-compose logs -f db
```

### Getting Help

- **GitHub Issues:** https://github.com/moeinparvizi/portfolio/issues
- **Swagger Docs:** http://localhost:3000/api/docs
- **NestJS Docs:** https://docs.nestjs.com
- **Angular Docs:** https://angular.dev

---

## 📝 License

MIT License - See [LICENSE](LICENSE) for details.

---

Built with ❤️ by [Moein Parvizi](https://github.com/moeinparvizi)
