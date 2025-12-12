-- Create a table for order drafts (Abandoned Carts)
create table if not exists order_drafts (
  id uuid default uuid_generate_v4() primary key,
  email text, -- Can be null if not yet provided, but usually we key off this or session_id
  session_id text, -- To track users before they enter email
  form_data jsonb, -- Stores the JSON structure of the order form
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  status text default 'active' -- active, recovered, abandoned
);

-- Enable RLS
alter table order_drafts enable row level security;

-- Service role policy
create policy "Service role can do everything on order_drafts"
  on order_drafts
  for all
  using ( true )
  with check ( true );
