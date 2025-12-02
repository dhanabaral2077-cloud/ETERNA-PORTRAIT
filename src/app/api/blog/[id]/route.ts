import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { id } = params;

    const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 404 });
    }

    return NextResponse.json(data);
}

export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { id } = params;

    try {
        const body = await req.json();
        let { title, slug, excerpt, content, image, author, published } = body;

        // If no feature image is provided, try to extract the first image from the content
        if (!image && content) {
            const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
            if (imgMatch) {
                image = imgMatch[1];
            }
        }

        const { data, error } = await supabase
            .from('posts')
            .update({ title, slug, excerpt, content, image, author, published, updated_at: new Date().toISOString() })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data);
    } catch (error) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: { id: string } }
) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { id } = params;

    const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
