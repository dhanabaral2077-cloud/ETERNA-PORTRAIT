-- Create customers table
create table if not exists public.customers (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text,
  name text,
  address_line1 text,
  address_line2 text,
  city text,
  state_province_region text,
  postal_code text,
  country text
);

-- Enable RLS
alter table public.customers enable row level security;

-- Policies for customers (Adjust strictness as needed for production)
create policy "Enable read access for all users" on public.customers for select using (true);
create policy "Enable insert access for all users" on public.customers for insert with check (true);
create policy "Enable update for users based on email" on public.customers for update using (auth.jwt() ->> 'email' = email);

-- Create orders table
create table if not exists public.orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  customer_id uuid references public.customers(id),
  status text default 'pending',
  price numeric,
  package text,
  photo_urls text[],
  notes text,
  pet_name text,
  style text,
  storage_folder text,
  currency text default 'USD',
  metadata jsonb,
  items jsonb
);

-- Enable RLS
alter table public.orders enable row level security;

-- Policies for orders
create policy "Enable read access for all users" on public.orders for select using (true);
create policy "Enable insert access for all users" on public.orders for insert with check (true);

-- Create storage bucket for order uploads if it doesn't exist
insert into storage.buckets (id, name, public)
values ('orders', 'orders', true)
on conflict (id) do nothing;

-- Storage policies
create policy "Public Access" on storage.objects for select using ( bucket_id = 'orders' );
create policy "Public Insert" on storage.objects for insert with check ( bucket_id = 'orders' );
