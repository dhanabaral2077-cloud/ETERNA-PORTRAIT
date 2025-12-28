-- Migration to add Automated Discount attributes to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS cost_of_goods_sold numeric, 
ADD COLUMN IF NOT EXISTS auto_pricing_min_price numeric;

-- Optional: Comment explaining the columns
COMMENT ON COLUMN products.cost_of_goods_sold IS 'COGS for Google Merchant Center Automated Discounts';
COMMENT ON COLUMN products.auto_pricing_min_price IS 'Minimum price for Google Merchant Center Automated Discounts';
