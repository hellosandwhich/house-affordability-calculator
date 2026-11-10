/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Request, Response } from 'express';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');
  return res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'LionCity HomeAfford SG API Gateway',
    endpoints: {
      health: '/api/health',
      hdbResalePrices: '/api/hdbresaleprices',
      masSoraRates: '/api/massorarates',
    },
  });
}
