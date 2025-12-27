// src/app/api/shipping-methods/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { gelatoClient } from '@/lib/gelato/client';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country');

  if (!process.env.GELATO_API_KEY) {
    return NextResponse.json({ error: 'Gelato API key is not configured.' }, { status: 500 });
  }

  try {
    // If country is not provided, Gelato might return all or error, 
    // but the client method expects a country code usually for best results.
    // The original code handled it as optional query param.
    // Let's pass it if present.
    // However, the client method signature in my thought was specific.
    // Let's check the client implementation I wrote.
    // It takes `countryCode: string`.
    // If country is missing, let's error or default?
    // Original code: `if (country) gelatoApiUrl += ...` implies it works without it?
    // Let's check client.ts content I wrote in Step 38.
    // `async getShipmentMethods(countryCode: string): Promise<any> { ... ?country=${countryCode} }`
    // It constructs the URL with the param. If countryCode is empty strings, it might fail or return all.

    if (!country) {
      // Fallback or just try without it if the API supports it
      // But for safety let's require it or pass undefined if the client supports it?
      // The client simply interpolates.
      return NextResponse.json({ error: 'Country code is required' }, { status: 400 });
    }

    const data = await gelatoClient.getShipmentMethods(country);
    return NextResponse.json(data);

  } catch (err: any) {
    console.error('Internal API Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
