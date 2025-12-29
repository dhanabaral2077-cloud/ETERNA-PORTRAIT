
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const BASE_URL = 'https://eternaportrait.com';

export async function GET() {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service key for server-side
  );

  const { data: products, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_active', true)
    .neq('plan', 'gift');

  if (error || !products) {
    console.error('Feed generation error:', error);
    return new NextResponse('Error generating feed', { status: 500 });
  }

  const xml = `<?xml version="1.0"?>
<rss xmlns:g="http://base.google.com/ns/1.0" version="2.0">
<channel>
<title>Eterna Portrait Products</title>
<link>${BASE_URL}</link>
<description>Handcrafted Custom Pet Portraits</description>
${products.map((product) => {
    // Ensure absolute URL
    const imageUrl = product.image.startsWith('http')
      ? product.image
      : `${BASE_URL}${product.image}`;

    return `
<item>
<g:id>${product.id}</g:id>
<g:title>${product.name}</g:title>
<g:description>Turn your pet into a masterpiece with our ${product.name}. Handcrafted digital art available in Poster, Canvas, or Framed options. 100% Satisfaction Guarantee.</g:description>
<g:link>${BASE_URL}/order?plan=${product.plan}&amp;mode=gmc</g:link>
<g:image_link>${imageUrl}</g:image_link>
${product.gallery && Array.isArray(product.gallery) ? product.gallery.map((img: string) => `
<g:additional_image_link>${img.startsWith('http') ? img : `${BASE_URL}${img}`}</g:additional_image_link>`).join('') : ''}
<g:condition>new</g:condition>
<g:availability>in_stock</g:availability>
<g:price>${product.base_price}.00 USD</g:price>
<g:brand>Eterna Portrait</g:brand>
<g:google_product_category>Home &amp; Garden &gt; Decor &gt; Artwork &gt; Posters, Prints &amp; Visual Artwork</g:google_product_category>
<g:shipping>
  <g:country>US</g:country>
  <g:service>Standard</g:service>
  <g:price>0.00 USD</g:price>
</g:shipping>
${[
        'AE', 'AO', 'AR', 'AT', 'AU', 'BD', 'BE', 'BH', 'BR', 'BY', 'CA', 'CH', 'CI', 'CL', 'CM', 'CO', 'CR', 'CZ', 'DE', 'DK', 'DO', 'DZ', 'EC', 'EG', 'ES', 'ET', 'FI', 'FR', 'GB', 'GE', 'GH', 'GR', 'GT', 'HK', 'HU', 'ID', 'IE', 'IL', 'IN', 'IT', 'JO', 'JP', 'KE', 'KH', 'KR', 'KW', 'LB', 'LK', 'MA', 'MG', 'MM', 'MU', 'MX', 'MY', 'MZ', 'NG', 'NI', 'NL', 'NO', 'NP', 'NZ', 'OM', 'PA', 'PE', 'PH', 'PK', 'PL', 'PR', 'PT', 'PY', 'RO', 'RU', 'SA', 'SE', 'SG', 'SK', 'SN', 'SV', 'TH', 'TN', 'TR', 'TW', 'TZ', 'UA', 'UG', 'UY', 'UZ', 'VE', 'VN', 'ZA', 'ZM', 'ZW'
      ].map((country) => `
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
