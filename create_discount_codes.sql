-- Create discount_codes table
create table if not exists public.discount_codes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  code text not null unique,
  discount_percent integer not null,
  description text,
  is_active boolean default true,
  usage_count integer default 0
);

-- Enable RLS
alter table public.discount_codes enable row level security;

-- Policies
create policy "Enable read access for all users" on public.discount_codes for select using (true);
create policy "Enable insert/upd/del for authenticated users" on public.discount_codes for all using (auth.role() = 'authenticated');

-- Insert FRESHSTART2026 as a seeded code
INSERT INTO public.discount_codes (code, discount_percent, description, is_active)
VALUES ('FRESHSTART2026', 20, 'New Year Fresh Start Campaign', true)
ON CONFLICT (code) DO NOTHING;
