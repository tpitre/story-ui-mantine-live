/**
 * Vite Plugin: Story UI Considerations Bundler
 *
 * This plugin bundles all files from the story-ui-docs/ directory into a single
 * story-ui-considerations.json file during the Storybook build.
 *
 * This enables environment parity between local development and production:
 * - Git-tracked considerations files are bundled at build time
 * - The bundled file is deployed with the Storybook static build
 * - Edge Worker fetches considerations from the deployed Storybook origin
 * - Any changes to considerations files sync automatically with deployments
 */

import fs from 'fs';
import path from 'path';
import type { Plugin } from 'vite';

interface ConsiderationsFile {
  path: string;
  content: string;
  type: 'markdown' | 'json' | 'text';
}

interface ConsiderationsBundle {
  version: string;
  generatedAt: string;
  source: 'storybook-build';
  files: ConsiderationsFile[];
  combinedContent: string;
}

/**
 * Recursively read all files from a directory
 */
function readFilesRecursively(dir: string, basePath: string = ''): ConsiderationsFile[] {
  const files: ConsiderationsFile[] = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.join(basePath, entry.name);

    if (entry.isDirectory()) {
      files.push(...readFilesRecursively(fullPath, relativePath));
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      let type: 'markdown' | 'json' | 'text' = 'text';

      if (ext === '.md') type = 'markdown';
      else if (ext === '.json') type = 'json';

      try {
        const content = fs.readFileSync(fullPath, 'utf-8');
        files.push({
          path: relativePath,
          content,
          type,
        });
      } catch (error) {
        console.warn(`[considerations-plugin] Failed to read ${fullPath}:`, error);
      }
    }
  }

  return files;
}

/**
 * Combine all considerations files into a single text block
 * This is what gets sent to the AI for story generation
 */
function combineConsiderations(files: ConsiderationsFile[]): string {
  const sections: string[] = [];

  // Group by type for better organization
  const markdownFiles = files.filter(f => f.type === 'markdown');
  const jsonFiles = files.filter(f => f.type === 'json');

  // Add markdown files (guidelines, component docs, patterns)
  for (const file of markdownFiles) {
    sections.push(`\n--- ${file.path} ---\n${file.content}`);
  }

  // Add JSON files (tokens) with context
  for (const file of jsonFiles) {
    sections.push(`\n--- ${file.path} (Design Tokens) ---\n${file.content}`);
  }

  return sections.join('\n');
}

/**
 * Create the considerations bundle
 */
function createBundle(docsDir: string): ConsiderationsBundle {
  const files = readFilesRecursively(docsDir);
  const combinedContent = combineConsiderations(files);

  return {
    version: '1.0.0',
    generatedAt: new Date().toISOString(),
    source: 'storybook-build',
    files,
    combinedContent,
  };
}

/**
 * Vite plugin that bundles considerations during build
 */
export function considerationsPlugin(): Plugin {
  const docsDir = path.resolve(process.cwd(), 'story-ui-docs');
  let bundle: ConsiderationsBundle | null = null;

  return {
    name: 'story-ui-considerations',

    // During development, serve considerations via middleware
    configureServer(server) {
      server.middlewares.use('/story-ui-considerations.json', (req, res) => {
        try {
          const freshBundle = createBundle(docsDir);
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Cache-Control', 'no-cache');
          res.end(JSON.stringify(freshBundle, null, 2));
        } catch (error) {
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to bundle considerations' }));
        }
      });
    },

    // During build, generate the bundle at the start
    buildStart() {
      console.log('[considerations-plugin] Bundling story-ui-docs/ for production...');
      bundle = createBundle(docsDir);
      console.log(`[considerations-plugin] Found ${bundle.files.length} consideration files`);
    },

    // Write the bundle to the output directory
    generateBundle() {
      if (!bundle) {
        bundle = createBundle(docsDir);
      }

      this.emitFile({
        type: 'asset',
        fileName: 'story-ui-considerations.json',
        source: JSON.stringify(bundle, null, 2),
      });

      // Emit _routes.json for Cloudflare Pages to serve static files correctly
      // This prevents the SPA fallback from intercepting JSON requests
      const routesConfig = {
        version: 1,
        include: ['/*'],
        exclude: [
          '/story-ui-considerations.json',
          '/index.json',
          '/project.json',
          '/*.svg',
          '/*.woff2',
          '/assets/*',
          '/sb-addons/*',
          '/sb-common-assets/*',
          '/sb-manager/*'
        ]
      };

      this.emitFile({
        type: 'asset',
        fileName: '_routes.json',
        source: JSON.stringify(routesConfig, null, 2),
      });

      console.log('[considerations-plugin] Emitted story-ui-considerations.json and _routes.json');
    },
  };
}

export default considerationsPlugin;
