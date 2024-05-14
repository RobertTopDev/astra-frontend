# Start from a Node.js 18 Alpine base image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY..

# Install yarn if it's not already installed
RUN apk add --no-cache yarn

FROM base AS deps
COPY package.json./
RUN yarn install

FROM base AS builder
COPY.env./.env
COPY --from=deps /app/node_modules./node_modules
# Add react, react-dom, and @next/env as dependencies
RUN yarn add react react-dom @next/env
# Build the application
RUN yarn run build

FROM base AS runner
ENV NODE_ENV production

# Create system group and user for running the application
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public./ public

# Prepare the.next directory
RUN mkdir.next
RUN chown nextjs:nodejs.next

# Copy.next/standalone and.next/static
COPY --from=builder --chown=nextjs:nodejs /app/.next/ standalone./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static./.next/ static

# Switch to the nextjs user
USER nextjs

# Expose port 8080
EXPOSE 8080

# Set environment variables
ENV PORT 8080
ENV HOSTNAME "0.0.0.0"

# Command to start the application
CMD ["node", "server.js"]
