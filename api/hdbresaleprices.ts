/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Request, Response } from 'express';

const HDB_DATASTORE_URL =
  'https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only GET requests are accepted.',
    });
  }

  try {
    const limit = req.query.limit ? String(req.query.limit) : '5';
    const targetUrl = `${HDB_DATASTORE_URL}&limit=${encodeURIComponent(limit)}`;

    // Build headers including mandatory AccountKey from environment
    const accountKey = process.env.HDB_ACCOUNT_KEY || process.env.ACCOUNT_KEY || '';
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'LionCity-HomeAfford-Calculator/1.0',
    };

    if (accountKey) {
      headers['AccountKey'] = accountKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const apiResponse = await fetch(targetUrl, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!apiResponse.ok) {
      const errorText = await apiResponse.text().catch(() => '');
      return res.status(apiResponse.status).json({
        success: false,
        status: apiResponse.status,
        statusText: apiResponse.statusText,
        error: 'Failed to fetch HDB resale transaction data from data.gov.sg',
        details: errorText.slice(0, 500),
      });
    }

    const data = await apiResponse.json();

    // Extract records cleanly
    const records = data?.result?.records || [];
    const formattedRecords = records.map((record: any) => ({
      month: record.month,
      town: record.town,
      flatType: record.flat_type,
      block: record.block,
      streetName: record.street_name,
      storeyRange: record.storey_range,
      floorAreaSqm: Number(record.floor_area_sqm) || 0,
      flatModel: record.flat_model,
      leaseCommenceDate: record.lease_commence_date,
      remainingLease: record.remaining_lease,
      resalePrice: Number(record.resale_price) || 0,
    }));

    return res.status(200).json({
      success: true,
      totalCount: data?.result?.total || records.length,
      limit: Number(limit),
      records: formattedRecords,
      raw: data,
    });
  } catch (error: any) {
    const isAbort = error.name === 'AbortError';
    return res.status(isAbort ? 504 : 500).json({
      success: false,
      error: isAbort
        ? 'Request timeout connecting to data.gov.sg'
        : (error.message || 'Internal server error while fetching HDB resale prices'),
    });
  }
}
