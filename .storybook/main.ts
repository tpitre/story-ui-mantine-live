import type { StorybookConfig } from '@storybook/react-vite';
import { defineConfig } from 'vite';
import fs from 'fs';
import path from 'path';
import { considerationsPlugin } from './considerations-plugin';

// Custom plugin to serve raw source files
const rawSourcePlugin = () => {
  return {
    name: 'raw-source-server',
    configureServer(server: any) {
      server.middlewares.use('/api/raw-source', (req: any, res: any) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const fileName = url.searchParams.get('file');
        
        if (!fileName) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, error: 'No file parameter' }));
          return;
        }
        
        try {
          // Try multiple possible paths for the story file
          const possiblePaths = [
            // Check generated directory first
            path.join(process.cwd(), 'src', 'stories', 'generated', `${fileName}.stories.tsx`),
            path.join(process.cwd(), 'src', 'stories', 'generated', `${fileName}.stories.ts`),
            // Then check other story locations
            path.join(process.cwd(), 'src', 'stories', `${fileName}.stories.tsx`),
            path.join(process.cwd(), 'src', 'stories', `${fileName}.stories.ts`),
            path.join(process.cwd(), 'src', fileName),
          ];
          
          let sourceCode = '';
          let foundPath = '';
          
          for (const filePath of possiblePaths) {
            if (fs.existsSync(filePath)) {
              sourceCode = fs.readFileSync(filePath, 'utf-8');
              foundPath = filePath;
              break;
            }
          }
          
          if (sourceCode) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: true, 
              source: sourceCode,
              path: foundPath
            }));
          } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              success: false, 
              error: 'File not found',
              searchedPaths: possiblePaths
            }));
          }
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: error instanceof Error ? error.message : 'Unknown error' 
          }));
        }
      });
    }
  };
};

const config: StorybookConfig = {
  "stories": [
    "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"
  ],
  "addons": [],
  "framework": {
    "name": "@storybook/react-vite",
    "options": {}
  },
  viteFinal: async (config) => {
    config.plugins?.push(rawSourcePlugin());
    config.plugins?.push(considerationsPlugin());

    // Deduplicate React to fix "Cannot read properties of null (reading 'useState')" error
    // This ensures packages that import React use the same instance as Storybook
    config.resolve = {
      ...config.resolve,
      dedupe: ['react', 'react-dom'],
    };

    // Configure HMR for Railway/proxy environments
    // When behind a reverse proxy (Caddy), Vite needs to know to connect through the proxy
    // not directly to the internal Storybook port (6006)
    if (process.env.RAILWAY_PUBLIC_DOMAIN) {
      config.server = {
        ...config.server,
        hmr: {
          // Use the Railway public domain
          host: process.env.RAILWAY_PUBLIC_DOMAIN,
          // External port is always 443 for Railway HTTPS (TLS termination)
          clientPort: 443,
          // Use secure WebSocket since Railway uses HTTPS
          protocol: 'wss',
        },
      };
    }

    // Pass environment variables to the client
    // Edge URL must be configured via environment variable (VITE_STORY_UI_EDGE_URL)
    // For Cloudflare Pages: Set in dashboard under Settings > Environment Variables
    config.define = {
      ...config.define,
      // For preview iframe (ESM format) - uses import.meta.env
      'import.meta.env.VITE_STORY_UI_EDGE_URL': JSON.stringify(
        process.env.VITE_STORY_UI_EDGE_URL || ''
      ),
      'import.meta.env.VITE_STORY_UI_PORT': JSON.stringify(
        process.env.VITE_STORY_UI_PORT || ''
      ),
      // For manager addon (IIFE format) - uses global constant
      // This is referenced by manager.tsx's EDGE_URL constant
      'EDGE_URL': JSON.stringify(
        process.env.VITE_STORY_UI_EDGE_URL || ''
      ),
    };

    return config;
  }
};
export default config;