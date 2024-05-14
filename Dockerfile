FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

FROM base AS deps
COPY package.json ./
RUN yarn install

FROM base AS builder

COPY .env ./.env
# Install pnpm globally
RUN npm install -g pnpm

# Then proceed with your existing commands
RUN yarn install
RUN yarn add react react-dom @next/env
RUN yarn run build



FROM base AS runner
ENV NODE_ENV production


RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
RUN chown -R nextjs:nodejs /app
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
RUN mkdir.next

USER nextjs

EXPOSE 8080

ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]