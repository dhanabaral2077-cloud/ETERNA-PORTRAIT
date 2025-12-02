-- Add announcement bar columns to marketing_campaigns table
ALTER TABLE marketing_campaigns 
ADD COLUMN IF NOT EXISTS top_bar_active boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS top_bar_text text DEFAULT 'Limited Time Offer: Free Shipping on All Orders!',
ADD COLUMN IF NOT EXISTS top_bar_link text;
