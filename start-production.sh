#!/bin/bash

# Story UI Live Production Start Script
# Runs Storybook + MCP server behind Caddy reverse proxy

echo "Starting Story UI Live Environment..."

# Start Storybook dev server in background
echo "Starting Storybook dev server on port 6006..."
npm run storybook -- --port 6006 --host 0.0.0.0 --ci --no-open &
STORYBOOK_PID=$!

# Wait for Storybook to initialize
sleep 5

# Start Story UI MCP server in background
echo "Starting Story UI MCP server on port 4005..."
npx story-ui start --port 4005 &
MCP_PID=$!

# Wait for MCP server to initialize
sleep 2

# Start Caddy reverse proxy (foreground)
echo "Starting Caddy reverse proxy on port 80..."
echo ""
echo "Story UI Live Environment is running!"
echo "   Storybook:   http://yourdomain.com/"
echo "   MCP Server:  http://yourdomain.com/mcp"
echo ""

# Run Caddy in foreground (keeps container alive)
caddy run --config /app/Caddyfile --adapter caddyfile
