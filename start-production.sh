#!/bin/bash

# Story UI Live Production Start Script
# Runs Storybook + MCP server behind Caddy reverse proxy

echo "Starting Story UI Live Environment..."

# Function to wait for HTTP service to be ready
wait_for_http() {
    local port=$1
    local name=$2
    local path=${3:-"/"}
    local max_attempts=90
    local attempt=1

    echo "Waiting for $name on port $port..."

    # First wait for port to be open
    while ! nc -z 127.0.0.1 $port 2>/dev/null; do
        if [ $attempt -ge $max_attempts ]; then
            echo "ERROR: $name failed to bind port $port after $max_attempts attempts"
            exit 1
        fi
        echo "  Attempt $attempt/$max_attempts - waiting for port..."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo "  Port $port is open, waiting for HTTP readiness..."

    # Then wait for HTTP to respond
    attempt=1
    while true; do
        if curl -s -o /dev/null -w "%{http_code}" "http://127.0.0.1:$port$path" 2>/dev/null | grep -q "200\|304"; then
            echo "$name is ready on port $port"
            return 0
        fi
        if [ $attempt -ge $max_attempts ]; then
            echo "ERROR: $name HTTP not ready on port $port after $max_attempts attempts"
            exit 1
        fi
        echo "  Attempt $attempt/$max_attempts - waiting for HTTP..."
        sleep 2
        attempt=$((attempt + 1))
    done
}

# Start Storybook dev server in background (bind to 0.0.0.0 for container)
echo "Starting Storybook dev server on port 6006..."
npm run storybook -- --port 6006 --host 0.0.0.0 --ci --no-open &
STORYBOOK_PID=$!

# Wait for Storybook to be ready (check the iframe.html endpoint)
wait_for_http 6006 "Storybook" "/iframe.html"

# Start Story UI MCP server in background
echo "Starting Story UI MCP server on port 4005..."
npx story-ui start --port 4005 &
MCP_PID=$!

# Wait for MCP server to be ready
wait_for_http 4005 "Story UI MCP Server" "/"

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
