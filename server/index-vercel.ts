import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import express from "express";
import { app } from "./app";
import { registerRoutes } from "./routes";

// Resolve paths - in Vercel, this file gets bundled and executed from api/
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try multiple possible paths for the static files
const possiblePaths = [
  path.resolve(__dirname, "../dist/public"),
  path.resolve(__dirname, "../../dist/public"),
  path.resolve(process.cwd(), "dist/public"),
  path.resolve("/var/task/dist/public"),
];

let distPath = possiblePaths[0];
for (const p of possiblePaths) {
  if (fs.existsSync(p)) {
    distPath = p;
    console.log(`Found static files at: ${p}`);
    break;
  }
}

// Register API routes
await registerRoutes(app);

// Serve static files
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // Fall through to index.html for client-side routing
  app.use("*", (_req, res) => {
    const indexPath = path.resolve(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send("Not found");
    }
  });
} else {
  console.error(`Static files not found. Tried: ${possiblePaths.join(", ")}`);
  app.use("*", (_req, res) => {
    res.status(500).send("Static files not found");
  });
}

export default app;
