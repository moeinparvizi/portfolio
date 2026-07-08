FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile
COPY apps/backend/ ./apps/backend/
COPY prisma/ ./apps/backend/prisma/
RUN cd apps/backend && npx prisma generate
RUN cd apps/backend && pnpm build

FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@latest --activate
WORKDIR /app
COPY --from=builder /app/apps/backend/dist ./dist
COPY --from=builder /app/apps/backend/node_modules ./node_modules
COPY --from=builder /app/apps/backend/prisma ./prisma
COPY --from=builder /app/apps/backend/generated ./generated
RUN mkdir -p /app/uploads
EXPOSE 3000
CMD ["node", "dist/main.js"]
