# Dockerfile for Azure Container Apps Deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy application source code
COPY . .

# Expose API port
EXPOSE 5000

ENV PORT=5000
ENV NODE_ENV=production

CMD ["node", "src/index.js"]
