-- Add image_url and delay_seconds columns to marketing_campaigns table
ALTER TABLE marketing_campaigns 
ADD COLUMN IF NOT EXISTS image_url text,
ADD COLUMN IF NOT EXISTS delay_seconds integer DEFAULT 3;
