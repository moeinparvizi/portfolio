# Portfolio Website

A full-stack portfolio website with Angular frontend, NestJS backend, and PostgreSQL database.

## Tech Stack

- **Frontend:** Angular 22 (Signals, SSR, PWA)
- **Backend:** NestJS 11 (JWT Auth, Swagger)
- **Database:** PostgreSQL 16 + Prisma ORM
- **Design:** Liquid Glass morphism, Dark/Light mode
- **i18n:** 3 languages (English, Farsi, German) with RTL support

## Prerequisites

- Node.js 20+
- pnpm
- PostgreSQL 14+
- Docker & Docker Compose (optional)

---

## Running Locally

### 1. Install Dependencies

```bash
cd portfolio
pnpm install
```

### 2. Setup PostgreSQL

Make sure PostgreSQL is running and create the database:

```bash
psql -U postgres -c "CREATE DATABASE portfolio;"
```

### 3. Configure Environment

```bash
cd apps/backend
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/portfolio
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
```

### 4. Run Migrations & Seed

```bash
cd apps/backend

# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev

# Seed initial data (admin user, profile, settings)
npx ts-node prisma/seed.ts
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd apps/backend
pnpm start:dev
```

**Terminal 2 - Frontend:**
```bash
cd apps/frontend
pnpm start
```

### 6. Access the Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Backend API | http://localhost:3000/api |
| Swagger Docs | http://localhost:3000/api/docs |
| Health Check | http://localhost:3000/health |

### 7. Login to Admin Panel

- Navigate to: http://localhost:4200/admin/login
- Username: `admin`
- Password: `admin123`

**Important:** Change these credentials in production!

---

## Running with Docker

### 1. Setup

```bash
cd portfolio
cp .env.example .env
# Edit .env with your settings
```

### 2. Start Services

```bash
docker-compose up -d
```

### 3. Initialize Database

```bash
# Wait for PostgreSQL to be ready, then:
docker-compose exec backend npx prisma migrate dev
docker-compose exec backend npx ts-node prisma/seed.ts
```

### 4. Access

- Frontend: http://localhost:4200
- Backend: http://localhost:3000

---

## Testing

### Backend Tests

```bash
cd apps/backend

# Unit tests
pnpm test

# E2E tests
pnpm test:e2e

# Test coverage
pnpm test:cov
```

### Frontend E2E Tests

```bash
cd apps/frontend

# Install Playwright browsers (first time only)
npx playwright install

# Run e2e tests
pnpm e2e

# Run with UI
pnpm e2e:ui
```

---

## Project Structure

```
portfolio/
├── apps/
│   ├── frontend/              # Angular 22 SSR + PWA
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/      # Services, guards, interceptors
│   │   │   │   ├── shared/    # Reusable components, pipes
│   │   │   │   ├── layouts/   # Public & Admin layouts
│   │   │   │   └── pages/     # Page components
│   │   │   └── styles.scss    # Global styles + design tokens
│   │   └── e2e/               # Playwright tests
│   └── backend/               # NestJS 11 + Prisma
│       ├── src/
│       │   ├── auth/          # JWT authentication
│       │   ├── profile/       # Profile management
│       │   ├── skills/        # Skills CRUD
│       │   ├── projects/      # Projects CRUD
│       │   ├── experience/    # Experience CRUD
│       │   ├── education/     # Education CRUD
│       │   ├── testimonials/  # Testimonials
│       │   ├── contact/       # Contact messages
│       │   ├── settings/      # Site settings
│       │   ├── resume/        # PDF generation
│       │   └── upload/        # Image upload
│       ├── prisma/
│       │   ├── schema.prisma  # Database schema
│       │   └── seed.ts        # Seed script
│       └── test/              # E2E tests
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Features

### Public Site
- Responsive hero section with animated text
- Projects gallery with filtering
- Experience timeline
- Education section
- Testimonials carousel
- Contact form with reCAPTCHA support
- Multi-language support (EN/FA/DE)
- RTL layout for Farsi
- Dark/Light mode toggle
- PWA support (installable)
- SEO optimized (meta tags, sitemap, structured data)

### Admin Dashboard
- Secure JWT authentication
- Profile management with multi-language tabs
- Skills CRUD with drag-and-drop ordering
- Projects CRUD with image upload
- Experience & Education management
- Testimonial approval workflow
- Contact message inbox
- Site settings (theme, SEO, footer)
- Resume PDF generator (3 languages)
- Data export (JSON backup)

---

## API Endpoints

### Public Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/profile` | Get profile |
| GET | `/api/skills` | Get all skills |
| GET | `/api/projects` | Get published projects |
| GET | `/api/projects/:id` | Get project by ID |
| GET | `/api/experience` | Get experience |
| GET | `/api/education` | Get education |
| GET | `/api/testimonials` | Get approved testimonials |
| POST | `/api/testimonials` | Submit testimonial |
| POST | `/api/contact` | Send contact message |
| GET | `/api/settings/:key` | Get setting |

### Admin Endpoints (JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| POST | `/api/auth/refresh` | Refresh token |
| GET | `/api/auth/profile` | Get current user |
| PUT | `/api/profile` | Update profile |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/upload/image` | Upload image |
| POST | `/api/resume/generate` | Generate PDF |

Full API documentation: http://localhost:3000/api/docs

---

## Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
1. Push to GitHub
2. Import repository in Vercel
3. Set build command: `cd apps/frontend && pnpm install && pnpm build`
4. Set output directory: `apps/frontend/dist/frontend/browser`

**Backend (Railway):**
1. Push to GitHub
2. Create new project in Railway
3. Add PostgreSQL database
4. Set environment variables
5. Deploy

### Option 2: Docker on VPS

```bash
# Clone repository
git clone <your-repo>
cd portfolio

# Setup environment
cp .env.example .env
# Edit .env with production values

# Start with Docker
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx ts-node prisma/seed.ts
```

### Option 3: Manual Deployment

**Backend:**
```bash
cd apps/backend
pnpm install --prod
npx prisma generate
npx prisma migrate deploy
node dist/main.js
```

**Frontend:**
```bash
cd apps/frontend
pnpm install
pnpm build
# Serve dist/frontend/browser with nginx or similar
```

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | - |
| `JWT_SECRET` | JWT access token secret | - |
| `JWT_REFRESH_SECRET` | JWT refresh token secret | - |
| `JWT_EXPIRATION` | Access token expiry | `15m` |
| `REFRESH_EXPIRATION` | Refresh token expiry | `7d` |
| `PORT` | Backend port | `3000` |
| `CORS_ORIGINS` | Allowed origins | `http://localhost:4200` |
| `UPLOAD_DIR` | Upload directory | `./uploads` |
| `RECAPTCHA_SECRET` | reCAPTCHA secret key | - |
| `RECAPTCHA_SITE_KEY` | reCAPTCHA site key | - |

---

## License

MIT
