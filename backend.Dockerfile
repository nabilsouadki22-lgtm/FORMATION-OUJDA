# Backend Dockerfile for Fly.io
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY backend/package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source
COPY backend/src ./src
COPY backend/prisma ./prisma

# Generate Prisma client
RUN npx prisma generate

# Expose port
EXPOSE 4000

# Health check endpoint (optional lightweight endpoint)
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
