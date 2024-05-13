# Stage 1: Build
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

FROM base AS deps
COPY package.json ./
RUN yarn install

FROM base AS builder
COPY .env ./.env
COPY --from=deps /app/node_modules ./node_modules
RUN yarn global add pnpm
RUN yarn add react react-dom @next/env
RUN yarn build

# Stage 2: Production
FROM node:18-alpine AS runner
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
