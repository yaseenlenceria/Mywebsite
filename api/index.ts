import { type Request, type Response } from 'express';
import { app } from '../server/app';
import { registerRoutes } from '../server/routes';

// Initialize routes (this is done once when the function cold starts)
let initialized = false;
async function initialize() {
  if (!initialized) {
    await registerRoutes(app);
    initialized = true;
  }
}

// Vercel serverless function handler
// Static files are served directly by Vercel from dist/public
// This function only handles API routes
export default async function handler(req: Request, res: Response) {
  await initialize();
  app(req, res);
}
