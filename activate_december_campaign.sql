-- Activate the "Holiday Rush" campaign for December 9-15
UPDATE public.marketing_campaigns
SET 
    title = 'Holiday Rush',
    description = 'Order by Dec 15 to ensure your masterpiece arrives for Christmas.',
    discount_code = 'HOLIDAY15',
    discount_percent = 15,
    is_active = true,
    delay_seconds = 3,
    updated_at = NOW()
WHERE id IS NOT NULL;

-- If for some reason no row exists, insert it
INSERT INTO public.marketing_campaigns (title, description, discount_code, discount_percent, is_active, delay_seconds)
SELECT 'Holiday Rush', 'Order by Dec 15 to ensure your masterpiece arrives for Christmas.', 'HOLIDAY15', 15, true, 3
WHERE NOT EXISTS (SELECT 1 FROM public.marketing_campaigns);
