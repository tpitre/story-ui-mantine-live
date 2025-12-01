#!/bin/bash

# Story UI Live Production Start Script
# Uses static Storybook build + MCP server behind Caddy reverse proxy

echo "Starting Story UI Live Environment..."

# Build Storybook static files (faster and more reliable than dev mode)
echo "Building Storybook static files..."
npm run build-storybook

# Check if build succeeded
if [ ! -d "storybook-static" ]; then
    echo "ERROR: Storybook build failed - no storybook-static directory"
    exit 1
fi

echo "Storybook build complete!"

# Start Story UI MCP server in background
echo "Starting Story UI MCP server on port 4005..."
npx story-ui start --port 4005 &
MCP_PID=$!

# Brief wait for MCP server to start
sleep 3

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
