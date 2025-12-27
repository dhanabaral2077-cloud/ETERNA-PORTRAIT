import { NextResponse } from 'next/server';
import { gelatoClient } from '@/lib/gelato/client';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const catalogUid = searchParams.get('catalog');
    const productUid = searchParams.get('product');

    try {
        if (productUid) {
            const product = await gelatoClient.getProduct(productUid);
            return NextResponse.json(product);
        } else if (catalogUid) {
            const products = await gelatoClient.getProducts(catalogUid);
            return NextResponse.json(products);
        } else {
            const catalogs = await gelatoClient.getCatalogs();
            return NextResponse.json(catalogs);
        }
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
