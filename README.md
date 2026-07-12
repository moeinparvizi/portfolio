# 🚀 Portfolio Website

A full-stack portfolio website built with Angular 22 and NestJS 11, featuring a stunning galaxy-themed design with animated space background.

![Portfolio](https://img.shields.io/badge/Angular-22-DD0031?style=for-the-badge&logo=angular&logoColor=white)
![Portfolio](https://img.shields.io/badge/NestJS-11-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![Portfolio](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

## ✨ Features

### Public Website
- 🌌 **Galaxy Theme** - Animated space background with stars, planets, rockets, and shooting stars
- 🌓 **Dark/Light Mode** - Toggle between cosmic dark mode and sunny light mode
- 🌍 **Multi-Language** - English, Farsi (RTL), and German support
- 📱 **Fully Responsive** - Works on mobile, tablet, and desktop
- 🎨 **Glass Morphism** - Modern UI with glass effect cards
- ⚡ **Fast Performance** - Optimized with lazy loading and code splitting

### Admin Dashboard
- 📊 **Dashboard** - Overview with statistics and quick actions
- 👤 **Profile Management** - Edit personal info with photo upload
- 🛠️ **Skills CRUD** - Add, edit, delete skills with categories
- 📁 **Projects CRUD** - Full project management with images
- 💼 **Experience** - Work history management
- 🎓 **Education** - Education records management
- 💬 **Testimonials** - Review and approve testimonials
- ✉️ **Messages** - Contact form inbox
- ⚙️ **Settings** - Theme, footer, and general settings
- 📄 **Resume Builder** - Generate PDF resume with templates

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 22 (Signals, SSR, PWA) |
| Backend | NestJS 11 (JWT Auth, Swagger) |
| Database | PostgreSQL 16 + Prisma ORM |
| Design | Liquid Glass, Galaxy Theme |
| i18n | Transloco (EN/FA/DE) |
| PDF | Puppeteer |
| Docker | Docker Compose |

## 📦 Project Structure

```
portfolio/
├── apps/
│   ├── frontend/              # Angular 22 Frontend
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── core/      # Services, Guards, Interceptors
│   │   │   │   ├── shared/    # Reusable Components
│   │   │   │   ├── layouts/   # Public & Admin Layouts
│   │   │   │   └── pages/     # Page Components
│   │   │   └── styles.scss    # Global Styles
│   │   └── e2e/               # Playwright Tests
│   └── backend/               # NestJS 11 Backend
│       ├── src/
│       │   ├── auth/          # JWT Authentication
│       │   ├── profile/       # Profile Management
│       │   ├── skills/        # Skills CRUD
│       │   ├── projects/      # Projects CRUD
│       │   ├── experience/    # Experience CRUD
│       │   ├── education/     # Education CRUD
│       │   ├── testimonials/  # Testimonials
│       │   ├── contact/       # Contact Messages
│       │   ├── settings/      # Site Settings
│       │   ├── resume/        # PDF Generation
│       │   └── upload/        # Image Upload
│       └── prisma/
│           ├── schema.prisma  # Database Schema
│           └── seed.ts        # Seed Data
├── docker-compose.yml
├── .env.example
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20+ (https://nodejs.org)
- **pnpm** (https://pnpm.io)
- **PostgreSQL** 14+ (https://postgresql.org)
- **Git** (https://git-scm.com)

### 1. Clone the Repository

```bash
git clone https://github.com/moeinparvizi/portfolio.git
cd portfolio
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Setup Database

Make sure PostgreSQL is running, then:

```bash
# Create database
psql -U postgres -c "CREATE DATABASE portfolio;"
```

### 4. Configure Environment

```bash
cd apps/backend
cp .env.example .env
```

Edit `.env` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://your_user:your_password@localhost:5432/portfolio
JWT_SECRET=your-super-secret-key
JWT_REFRESH_SECRET=your-super-secret-refresh-key
```

### 5. Run Migrations & Seed

```bash
cd apps/backend

# Generate Prisma client
npx prisma generate

# Apply database migrations
npx prisma migrate dev

# Seed initial data
npx ts-node prisma/seed.ts
```

### 6. Start Development Servers

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

### 7. Access the Application

| Service | URL |
|---------|-----|
| **Public Website** | http://localhost:4200/en |
| **Admin Panel** | http://localhost:4200/admin/login |
| **Backend API** | http://localhost:3000/api |
| **Swagger Docs** | http://localhost:3000/api/docs |

### 8. Login to Admin

- **Username:** `admin`
- **Password:** `admin123`

⚠️ **Change these credentials in production!**

## 🐳 Docker Setup

### Quick Start with Docker

```bash
# Clone and setup
git clone https://github.com/moeinparvizi/portfolio.git
cd portfolio
cp .env.example .env

# Start all services
docker-compose up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy

# Seed database
docker-compose exec backend npx ts-node prisma/seed.ts
```

### Docker Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 4200 | Angular App |
| backend | 3000 | NestJS API |
| db | 5432 | PostgreSQL |

## 📚 API Documentation

Swagger documentation is available at: http://localhost:3000/api/docs

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
| PUT | `/api/profile` | Update profile |
| POST | `/api/skills` | Create skill |
| PUT | `/api/skills/:id` | Update skill |
| DELETE | `/api/skills/:id` | Delete skill |
| POST | `/api/projects` | Create project |
| PUT | `/api/projects/:id` | Update project |
| DELETE | `/api/projects/:id` | Delete project |
| POST | `/api/upload/image` | Upload image |
| POST | `/api/resume/generate` | Generate PDF |

## 🎨 Design System

### Galaxy Theme (Dark Mode)
- Deep space background with gradient
- Animated twinkling stars
- Purple nebula glow
- Indigo/Purple accent colors
- Glass cards with cosmic highlights

### Sunny Theme (Light Mode)
- Soft blue sky gradient
- Sun glow effect
- Subtle stars for depth
- Clean white glass cards

### Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | #6366F1 | Buttons, links, accents |
| Secondary | #A855F7 | Gradients, highlights |
| Accent | #06B6D4 | Skill bars, accents |
| Success | #10B981 | Success states |
| Warning | #F59E0B | Warning states |
| Error | #EF4444 | Error states |

## 🌍 Internationalization

The website supports 3 languages:

| Language | Code | Direction |
|----------|------|-----------|
| English | en | LTR |
| Farsi | fa | RTL |
| German | de | LTR |

### Adding New Languages

1. Add locale to `LocaleService`
2. Create translation file
3. Add language to the switcher component
4. Update route prefixes

## 🧪 Testing

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

### Frontend Tests

```bash
cd apps/frontend

# Unit tests
pnpm test

# E2E tests (Playwright)
pnpm e2e
```

## 🚀 Deployment

### Option 1: Vercel (Frontend) + Railway (Backend)

**Frontend (Vercel):**
1. Push to GitHub
2. Import repository in Vercel
3. Set build command: `cd apps/frontend && pnpm install && pnpm build`
4. Set output: `apps/frontend/dist/frontend/browser`

**Backend (Railway):**
1. Create new project in Railway
2. Add PostgreSQL database
3. Set environment variables
4. Deploy

### Option 2: Docker on VPS

```bash
# Clone repository
git clone https://github.com/moeinparvizi/portfolio.git
cd portfolio

# Setup environment
cp .env.example .env
# Edit .env with production values

# Start with Docker
docker-compose -f docker-compose.prod.yml up -d

# Run migrations
docker-compose exec backend npx prisma migrate deploy
```

## 🔧 Environment Variables

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

## 📝 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Angular](https://angular.dev) - Frontend framework
- [NestJS](https://nestjs.com) - Backend framework
- [Prisma](https://prisma.io) - Database ORM
- [Tailwind CSS](https://tailwindcss.com) - Utility classes

---

Built with ❤️ by [Moein Parvizi](https://github.com/moeinparvizi)
