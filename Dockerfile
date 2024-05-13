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
RUN yarn add react react-dom @next/env
RUN yarn run build

FROM base AS runner
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]