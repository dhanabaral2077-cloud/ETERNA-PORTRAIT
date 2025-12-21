-- Ensure columns exist (Idempotent Migration)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketing_campaigns' AND column_name = 'top_bar_active') THEN
        ALTER TABLE marketing_campaigns ADD COLUMN top_bar_active boolean DEFAULT true;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketing_campaigns' AND column_name = 'top_bar_text') THEN
        ALTER TABLE marketing_campaigns ADD COLUMN top_bar_text text;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'marketing_campaigns' AND column_name = 'top_bar_link') THEN
        ALTER TABLE marketing_campaigns ADD COLUMN top_bar_link text;
    END IF;
END $$;

-- Activate the "Instant Joy" campaign (Dec 21-25)
UPDATE public.marketing_campaigns
SET 
    title = 'Instant Joy 🎁',
    description = 'Shipping deadlines have passed, but you can still give the perfect gift! Get a Digital Portrait instantly.',
    discount_code = 'INSTANT20',
    discount_percent = 20,
    is_active = true,
    delay_seconds = 2,
    top_bar_active = true,
    top_bar_text = '🎁 Too late to ship? Get a Digital Portrait instantly!',
    top_bar_link = '/shop/digital', 
    updated_at = NOW()
WHERE id IS NOT NULL;

-- Fallback Insert if empty
INSERT INTO public.marketing_campaigns (title, description, discount_code, discount_percent, is_active, delay_seconds, top_bar_active, top_bar_text, top_bar_link)
SELECT 'Instant Joy 🎁', 'Shipping deadlines have passed, but you can still give the perfect gift! Get a Digital Portrait instantly.', 'INSTANT20', 20, true, 2, true, '🎁 Too late to ship? Get a Digital Portrait instantly!', '/shop/digital'
WHERE NOT EXISTS (SELECT 1 FROM public.marketing_campaigns);
