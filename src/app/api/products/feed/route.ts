import { NextResponse } from 'next/server';
import { PRODUCT_PRICES } from '@/lib/pricing';

const BASE_URL = 'https://eternaportrait.com';

function getProductImage(key: string) {
  if (key.includes('canvas')) return `${BASE_URL}/portfolio/The_Craftsman_Hero.png`;
  if (key.includes('framed')) return `${BASE_URL}/portfolio/collector1.png`;
  return `${BASE_URL}/portfolio/Brenden Dog1.jpg`;
}

export async function GET() {
  const products = Object.entries(PRODUCT_PRICES).filter(([key, product]) => product.plan !== 'gift');

  const xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Eterna Portrait Products</title>
<link>${BASE_URL}</link>
<description>Handcrafted Custom Pet Portraits</description>
${products.map(([key, product]) => {
    // Use the specific image from pricing.ts if available, otherwise fallback
    const imageUrl = (product as any).image
      ? `${BASE_URL}${(product as any).image}`
      : getProductImage(key);

    return `
<item>
<g:id>${key}</g:id>
<g:title>${product.name}</g:title>
<g:description>Turn your pet into a masterpiece with our ${product.name}. Handcrafted digital art available in Poster, Canvas, or Framed options. 100% Satisfaction Guarantee.</g:description>
<g:link>${BASE_URL}/order?plan=${product.plan}&amp;mode=gmc</g:link>
<g:image_link>${imageUrl}</g:image_link>
<g:condition>new</g:condition>
<g:availability>in_stock</g:availability>
<g:price>${product.basePrice}.00 USD</g:price>
<g:brand>Eterna Portrait</g:brand>
<g:google_product_category>Home &amp; Garden &gt; Decor &gt; Artwork &gt; Posters, Prints &amp; Visual Artwork</g:google_product_category>
<g:shipping>
  <g:country>US</g:country>
  <g:service>Standard</g:service>
  <g:price>0.00 USD</g:price>
</g:shipping>
${['GB', 'CA', 'AU', 'NZ', 'DE', 'FR', 'IT', 'ES', 'NL', 'IE', 'SE', 'NO', 'DK', 'FI', 'CH', 'BE', 'AT'].map(country => `
<g:shipping>
  <g:country>${country}</g:country>
  <g:service>International</g:service>
  <g:price>14.99 USD</g:price>
</g:shipping>`).join('')}
</item>
`;
  }).join('')}
</channel>
</rss>`;

  return new NextResponse(xml, {
    headers: {
      'Content-Type': 'text/xml',
      'Cache-Control': 's-maxage=3600, stale-while-revalidate',
    },
  });
}
