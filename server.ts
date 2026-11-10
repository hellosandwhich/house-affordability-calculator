/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import API route handlers
import healthHandler from './api/health.ts';
import hdbResalePricesHandler from './api/hdbresaleprices.ts';
import masSoraRatesHandler from './api/massorarates.ts';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route mappings
app.all('/api/health', (req: Request, res: Response) => {
  return healthHandler(req, res);
});

app.all('/api/hdbresaleprices', (req: Request, res: Response) => {
  return hdbResalePricesHandler(req, res);
});

app.all('/api/massorarates', (req: Request, res: Response) => {
  return masSoraRatesHandler(req, res);
});

// Dev / Prod Vite integration
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
