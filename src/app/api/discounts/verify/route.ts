import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Code is required' }, { status: 400 });
        }

        const normalizedCode = code.toUpperCase().trim();

        // 1. Check Global Marketing Campaign first (Priority)
        const { data: campaign } = await supabase
            .from('marketing_campaigns')
            .select('*')
            .eq('is_active', true)
            .limit(1)
            .single();

        if (campaign && campaign.discount_code && campaign.discount_code.toUpperCase() === normalizedCode) {
            return NextResponse.json({
                valid: true,
                code: campaign.discount_code,
                percent: campaign.discount_percent,
                type: 'campaign',
                description: campaign.title
            });
        }

        // 2. Check Standalone Discount Codes
        const { data: discount } = await supabase
            .from('discount_codes')
            .select('*')
            .eq('code', normalizedCode)
            .eq('is_active', true)
            .single();

        if (discount) {
            // Increment usage count (optional fire-and-forget)
            await supabase.rpc('increment_discount_usage', { row_id: discount.id });

            return NextResponse.json({
                valid: true,
                code: discount.code,
                percent: discount.discount_percent,
                type: 'standalone',
                description: discount.description
            });
        }

        // 3. Fallback / Invalid
        return NextResponse.json({ valid: false, error: 'Invalid or expired code' }, { status: 404 });

    } catch (error) {
        console.error('Verify error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
