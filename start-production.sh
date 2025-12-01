#!/bin/bash

# Story UI Live Production Start Script
# Runs Storybook dev mode + MCP server behind Caddy reverse proxy
# Dev mode is REQUIRED for Story UI's hot reload story generation

echo "Starting Story UI Live Environment..."

# Function to wait for port to be open
wait_for_port() {
    local port=$1
    local name=$2
    local max_attempts=120
    local attempt=1

    echo "Waiting for $name on port $port..."
    while ! nc -z 127.0.0.1 $port 2>/dev/null; do
        if [ $attempt -ge $max_attempts ]; then
            echo "ERROR: $name failed to start on port $port after $max_attempts attempts"
            exit 1
        fi
        echo "  Attempt $attempt/$max_attempts - waiting..."
        sleep 2
        attempt=$((attempt + 1))
    done
    echo "$name is listening on port $port"
}

# Start Storybook dev server in background
echo "Starting Storybook dev server on port 6006..."
npm run storybook -- --port 6006 --host 0.0.0.0 --ci --no-open &
STORYBOOK_PID=$!

# Start Story UI MCP server in background
echo "Starting Story UI MCP server on port 4005..."
npx story-ui start --port 4005 &
MCP_PID=$!

# Wait for both services to bind their ports
wait_for_port 6006 "Storybook"
wait_for_port 4005 "Story UI MCP Server"

# Give Storybook a moment to fully initialize after port is bound
echo "Allowing Storybook to fully initialize..."
sleep 10

# Start Caddy reverse proxy (foreground)
echo ""
echo "============================================"
echo "Story UI Live Environment is running!"
echo "   Storybook:   http://yourdomain.com/"
echo "   MCP Server:  http://yourdomain.com/story-ui/*"
echo "============================================"
echo ""

# Run Caddy in foreground (keeps container alive)
caddy run --config /app/Caddyfile --adapter caddyfile
