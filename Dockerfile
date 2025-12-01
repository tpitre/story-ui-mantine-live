# Story UI Live Deployment
# Runs Storybook DEV MODE (required for hot reload story generation) with MCP server behind Caddy
# Build timestamp: 2025-12-01T04:20:00Z - fix: simpler port-only health check, dev mode

FROM node:20-slim

# Install Caddy and netcat (for port checking)
RUN apt-get update && apt-get install -y \
    curl \
    netcat-openbsd \
    debian-keyring \
    debian-archive-keyring \
    apt-transport-https \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg \
    && curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list \
    && apt-get update \
    && apt-get install -y caddy \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy project files
COPY . .

# Make start script executable
RUN chmod +x ./start-production.sh

# Expose single port (Caddy routes to both services internally)
EXPOSE 80

# Start all services
CMD ["./start-production.sh"]
