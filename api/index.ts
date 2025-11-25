import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import express, { type Request, type Response } from 'express';
import { app } from '../server/app';
import { registerRoutes } from '../server/routes';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find the dist/public directory
const possiblePaths = [
  path.join(__dirname, '../dist/public'),
  path.join(process.cwd(), 'dist/public'),
  path.join('/var/task', 'dist/public'),
];

let distPath: string | null = null;
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    console.log(`[Vercel] Found static files at: ${p}`);
    break;
  }
}

// Initialize routes (this is done once when the function cold starts)
let initialized = false;
async function initialize() {
  if (!initialized) {
    await registerRoutes(app);

    // Serve static files
    if (distPath && fs.existsSync(distPath)) {
      app.use(express.static(distPath));

      // Fallback to index.html for client-side routing (SPA)
      app.use('*', (req, res, next) => {
        // Skip API routes
        if (req.path.startsWith('/api')) {
          return next();
        }

        const indexPath = path.join(distPath as string, 'index.html');
        if (fs.existsSync(indexPath)) {
          res.sendFile(indexPath);
        } else {
          res.status(404).send('Not found');
        }
      });
    } else {
      console.error('[Vercel] Static files not found at any of:', possiblePaths);
    }

    initialized = true;
  }
}

// Vercel serverless function handler
export default async function handler(req: Request, res: Response) {
  await initialize();
  app(req, res);
}
