// src/app/api/shipping-methods/route.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const country = searchParams.get('country');
  
  if (!process.env.GELATO_API_KEY) {
    return NextResponse.json({ error: 'Gelato API key is not configured.' }, { status: 500 });
  }

  let gelatoApiUrl = 'https://shipment.gelatoapis.com/v1/shipment-methods';
  if (country) {
    gelatoApiUrl += `?country=${country}`;
  }

  try {
    const response = await fetch(gelatoApiUrl, {
      method: 'GET',
      headers: {
        'X-API-KEY': process.env.GELATO_API_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Gelato API Error:', errorData);
        return NextResponse.json({ error: 'Failed to fetch shipping methods from Gelato.' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err: any) {
    console.error('Internal API Error:', err);
    return NextResponse.json({ error: err.message || 'An unknown error occurred' }, { status: 500 });
  }
}
