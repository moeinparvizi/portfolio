# Moein Parvizi — Portfolio

Multilingual portfolio with an Angular frontend, a NestJS API, PostgreSQL/Prisma, a protected admin dashboard, image storage, and PDF resumes in English, Farsi and German.

- **Website:** https://moeinparvizi.vercel.app/fa
- **Admin:** https://moeinparvizi.vercel.app/admin/login
- **Development and deployment guide (فارسی):** [DEVELOPMENT.fa.md](DEVELOPMENT.fa.md)

## Stack and deployment

Node.js **24.x**, pnpm **11.10.0**. The frontend and API are deployed together as Vercel Services using the root `vercel.json`. Supabase provides PostgreSQL and persistent image storage. PDF generation uses Puppeteer and serverless Chromium; Persian fonts are bundled with the backend.

## Local development

```bash
nvm install
nvm use
npm install -g pnpm@11.10.0
pnpm install --frozen-lockfile
cp apps/backend/.env.example apps/backend/.env
```

Configure a separate development database and JWT secrets in `apps/backend/.env`, then:

```bash
docker compose up -d db
pnpm --filter backend exec prisma generate
pnpm db:deploy
node --env-file=apps/backend/.env scripts/seed-production.mjs
```

The initialization script requires `ADMIN_USERNAME` and a unique `ADMIN_PASSWORD` of at least 20 characters. It preserves existing records and does not reset an existing admin password. Do not use the legacy demo seed on the production database.

Run in separate terminals:

```bash
pnpm --filter backend run start:dev
pnpm --filter frontend start
```

Open http://localhost:4200/fa and http://localhost:4200/admin/login. API docs are at http://localhost:3000/api/docs. For PDF generation locally, install Puppeteer's Chrome with `pnpm --filter backend exec puppeteer browsers install chrome`. See the Persian guide for Supabase image storage configuration.

## Validation

```bash
pnpm --filter backend run test --runInBand
pnpm --filter backend run build
pnpm --filter frontend run build --output-mode=static
git diff --check
```

## Updates

With the GitHub integration enabled and `main` selected as the production branch, pushing to `main` triggers a Vercel production deployment. Environment variable changes require a new deployment. Database migrations are applied separately; the build generates Prisma Client but does not migrate the live database.

Profile, projects, skills and other content edited through the admin dashboard are stored in PostgreSQL and do not require redeployment.

Keep real environment files and admin credentials out of Git. The tracked `.env.example` files contain placeholders only. Full instructions: [DEVELOPMENT.fa.md](DEVELOPMENT.fa.md).
