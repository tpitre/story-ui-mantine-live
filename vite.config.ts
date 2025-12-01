import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

// Custom plugin to serve raw source files for Visual Builder
function rawSourcePlugin() {
  return {
    name: 'raw-source-plugin',
    configureServer(server: any) {
      server.middlewares.use('/api/raw-source', (req: any, res: any) => {
        const url = new URL(req.url, `http://${req.headers.host}`);
        const fileName = url.searchParams.get('file');
        const isEdited = url.searchParams.get('isEdited') === 'true';
        
        if (!fileName) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'File parameter is required' }));
          return;
        }
        
        console.log(`[Vite Plugin] Loading story: ${fileName}, isEdited: ${isEdited}`);
        
        try {
          let filePath: string;
          let sourceCode: string;
          
          // Priority-based file lookup: edited stories get priority in edited/ directory
          if (isEdited) {
            // For edited stories, check edited/ directory first
            const editedPath = path.join(process.cwd(), 'src', 'stories', 'edited', `${fileName}.stories.tsx`);
            const generatedPath = path.join(process.cwd(), 'src', 'stories', 'generated', `${fileName}.stories.tsx`);
            
            if (fs.existsSync(editedPath)) {
              filePath = editedPath;
              sourceCode = fs.readFileSync(filePath, 'utf-8');
            } else if (fs.existsSync(generatedPath)) {
              filePath = generatedPath;
              sourceCode = fs.readFileSync(filePath, 'utf-8');
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ 
                error: `File not found: ${fileName}`,
                searched: ['edited/', 'generated/'] 
              }));
              return;
            }
          } else {
            // For generated stories, check generated/ directory first
            const generatedPath = path.join(process.cwd(), 'src', 'stories', 'generated', `${fileName}.stories.tsx`);
            const editedPath = path.join(process.cwd(), 'src', 'stories', 'edited', `${fileName}.stories.tsx`);
            
            if (fs.existsSync(generatedPath)) {
              filePath = generatedPath;
              sourceCode = fs.readFileSync(filePath, 'utf-8');
            } else if (fs.existsSync(editedPath)) {
              filePath = editedPath;
              sourceCode = fs.readFileSync(filePath, 'utf-8');
            } else {
              res.statusCode = 404;
              res.end(JSON.stringify({ 
                error: `File not found: ${fileName}`,
                searched: ['generated/', 'edited/'] 
              }));
              return;
            }
          }
          
          console.log(`[Vite Plugin] Successfully loaded from: ${filePath}`);
          
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET');
          res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
          
          res.end(JSON.stringify({
            success: true,
            fileName: fileName,
            source: sourceCode,
            loadedFrom: filePath
          }));
          
        } catch (error) {
          console.error('Error reading source file:', error);
          res.statusCode = 500;
          res.end(JSON.stringify({ 
            error: 'Failed to read source file',
            details: error instanceof Error ? error.message : 'Unknown error'
          }));
        }
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), rawSourcePlugin()],
})
