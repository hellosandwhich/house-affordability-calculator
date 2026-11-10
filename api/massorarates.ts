/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import type { Request, Response } from 'express';

const MAS_SORA_DAILY_URL =
  'https://eservices.mas.gov.sg/apimg-gw/server/monthly_statistical_bulletin_non610mssql/domestic_interest_rates_daily/views/domestic_interest_rates_daily';

export default async function handler(req: Request, res: Response) {
  res.setHeader('Content-Type', 'application/json');

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method Not Allowed. Only GET requests are accepted.',
    });
  }

  try {
    const accountKey = process.env.ACCOUNT_KEY || '';
    const headers: Record<string, string> = {
      Accept: 'application/json',
      'User-Agent': 'LionCity-HomeAfford-Calculator/1.0',
    };

    if (accountKey) {
      headers['AccountKey'] = accountKey;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const apiResponse = await fetch(MAS_SORA_DAILY_URL, {
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
        error: 'Failed to fetch domestic SORA rates from Monetary Authority of Singapore (MAS)',
        details: errorText.slice(0, 500),
      });
    }

    const data = await apiResponse.json();
    const records = data?.result?.records || data?.records || (Array.isArray(data) ? data : []);

    // Extract the most recent valid SORA record
    // Common fields in MAS SORA dataset:
    // sora, sora_compounded_1m, sora_compounded_3m, sora_compounded_6m, end_of_day
    let latestRecord = null;
    if (records.length > 0) {
      latestRecord = records[records.length - 1];
    }

    return res.status(200).json({
      success: true,
      count: records.length,
      latestRate: latestRecord
        ? {
            date: latestRecord.end_of_day || latestRecord.date || latestRecord.period,
            dailySora: Number(latestRecord.sora || latestRecord.daily_sora || 0),
            compounded1m: Number(latestRecord.sora_compounded_1m || latestRecord.compounded_1m || 0),
            compounded3m: Number(latestRecord.sora_compounded_3m || latestRecord.compounded_3m || 0),
            compounded6m: Number(latestRecord.sora_compounded_6m || latestRecord.compounded_6m || 0),
          }
        : null,
      records: records.slice(-10), // return last 10 records for history/trend
      raw: data,
    });
  } catch (error: any) {
    const isAbort = error.name === 'AbortError';
    return res.status(isAbort ? 504 : 500).json({
      success: false,
      error: isAbort
        ? 'Request timeout connecting to MAS eServices API'
        : (error.message || 'Internal server error while fetching MAS SORA rates'),
    });
  }
}
