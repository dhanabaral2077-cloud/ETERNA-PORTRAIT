-- Create products table
create table if not exists public.products (
  id text primary key, -- 'wood_print', 'canvas', etc.
  name text not null,
  description text,
  base_price numeric not null,
  plan text not null, -- 'classic', 'signature', 'masterpiece'
  image text not null,
  gallery text[] default '{}',
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.products enable row level security;

-- Policies
create policy "Public can view active products"
  on public.products for select
  using ( is_active = true );

create policy "Admins can manage products"
  on public.products for all
  using ( auth.role() = 'authenticated' );

-- Create storage bucket for product images
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Product images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

create policy "Admins can upload product images"
  on storage.objects for insert
  with check ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

create policy "Admins can update product images"
  on storage.objects for update
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );

create policy "Admins can delete product images"
  on storage.objects for delete
  using ( bucket_id = 'product-images' and auth.role() = 'authenticated' );
