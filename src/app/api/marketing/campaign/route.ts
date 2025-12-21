import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const dynamic = 'force-dynamic';

export async function GET() {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        // Fetch the most recently updated campaign (or just the single row we maintain)
        const { data, error } = await supabase
            .from('marketing_campaigns')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            // If no rows, return null (no active campaign)
            if (error.code === 'PGRST116') {
                return NextResponse.json(null);
            }
            throw error;
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Error fetching campaign:', error);
        return NextResponse.json({ error: 'Failed to fetch campaign' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    try {
        const body = await req.json();
        const { id, ...updates } = body;

        // We assume there's only one main campaign row we keep updating, 
        // or we create one if it doesn't exist.

        // First, check if a row exists
        const { data: existing } = await supabase
            .from('marketing_campaigns')
            .select('id')
            .limit(1)
            .single();

        let result;
        if (existing) {
            // Update existing
            result = await supabase
                .from('marketing_campaigns')
                .update({ ...updates, updated_at: new Date().toISOString() })
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Create new
            result = await supabase
                .from('marketing_campaigns')
                .insert([{ ...updates, updated_at: new Date().toISOString() }])
                .select()
                .single();
        }

        if (result.error) throw result.error;

        return NextResponse.json(result.data);
    } catch (error) {
        console.error('Error updating campaign:', error);
        return NextResponse.json({ error: 'Failed to update campaign' }, { status: 500 });
    }
}
