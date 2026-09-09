# Production Dockerfile for Rakhi Gift Application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY server/prisma ./server/prisma/
RUN npm ci

# Generate Prisma Client & Build Client Bundle
COPY . .
RUN npm run db:generate
RUN npm run build

# Production Runner Stage
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/server ./server

EXPOSE 5000

CMD ["node", "server/index.js"]
