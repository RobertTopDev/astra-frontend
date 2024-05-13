# Stage 1: Build
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .

# Install pnpm and dependencies
RUN npm install -g pnpm
RUN yarn install

# Build the project
RUN yarn build

# Stage 2: Production
FROM node:18-alpine AS runner
ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

WORKDIR /app

# Copy necessary files from the build stage
COPY --from=base /app/public ./public
COPY --from=base /app/.next ./.next

RUN chown -R nextjs:nodejs .

USER nextjs

EXPOSE 8080

CMD ["node", "server.js"]
