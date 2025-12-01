#!/bin/bash

# Story UI Live Production Start Script
# Runs Storybook + MCP server behind Caddy reverse proxy

echo "Starting Story UI Live Environment..."

# Function to wait for a port to be ready
wait_for_port() {
    local port=$1
    local name=$2
    local max_attempts=60
    local attempt=1

    echo "Waiting for $name on port $port..."
    while ! nc -z 127.0.0.1 $port 2>/dev/null; do
        if [ $attempt -ge $max_attempts ]; then
            echo "ERROR: $name failed to start on port $port after $max_attempts attempts"
            exit 1
        fi
        echo "  Attempt $attempt/$max_attempts - waiting for $name..."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo "$name is ready on port $port"
}

# Start Storybook dev server in background
echo "Starting Storybook dev server on port 6006..."
npm run storybook -- --port 6006 --host 127.0.0.1 --ci --no-open &
STORYBOOK_PID=$!

# Wait for Storybook to be ready
wait_for_port 6006 "Storybook"

# Start Story UI MCP server in background
echo "Starting Story UI MCP server on port 4005..."
npx story-ui start --port 4005 &
MCP_PID=$!

# Wait for MCP server to be ready
wait_for_port 4005 "Story UI MCP Server"

# Start Caddy reverse proxy (foreground)
echo ""
echo "============================================"
echo "Story UI Live Environment is running!"
echo "   Storybook:   http://yourdomain.com/"
echo "   MCP Server:  http://yourdomain.com/mcp"
echo "============================================"
echo ""

# Run Caddy in foreground (keeps container alive)
caddy run --config /app/Caddyfile --adapter caddyfile
