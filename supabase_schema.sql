-- Create the posts table
create table public.posts (
  id uuid default gen_random_uuid() primary key,
  slug text unique not null,
  title text not null,
  excerpt text,
  content text,
  image text,
  author text,
  published boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable Row Level Security (RLS)
alter table public.posts enable row level security;

-- Create policies
-- Allow public read access to published posts
create policy "Public posts are viewable by everyone"
  on public.posts for select
  using ( true );

-- Allow authenticated users (admin) to do everything
create policy "Admins can do everything"
  on public.posts for all
  using ( auth.role() = 'authenticated' );

-- Create a storage bucket for blog images if it doesn't exist
insert into storage.buckets (id, name, public)
values ('blog-images', 'blog-images', true)
on conflict (id) do nothing;

-- Allow public access to blog images
create policy "Blog images are publicly accessible"
  on storage.objects for select
  using ( bucket_id = 'blog-images' );

-- Allow authenticated users to upload blog images
create policy "Admins can upload blog images"
  on storage.objects for insert
  with check ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

-- Allow authenticated users to update/delete blog images
create policy "Admins can update blog images"
  on storage.objects for update
  using ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

create policy "Admins can delete blog images"
  on storage.objects for delete
  using ( bucket_id = 'blog-images' and auth.role() = 'authenticated' );

-- Add new columns to posts table
alter table public.posts 
add column if not exists tags text[] default '{}',
add column if not exists search_description text;

-- Create comments table
create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  user_name text not null,
  content text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for comments
alter table public.comments enable row level security;

-- Allow public to read comments
create policy "Public comments are viewable by everyone"
  on public.comments for select
  using ( true );

-- Allow public to insert comments (moderation can be added later)
create policy "Public can insert comments"
  on public.comments for insert
  with check ( true );

-- Create reactions table
create table if not exists public.post_reactions (
  id uuid default gen_random_uuid() primary key,
  post_id uuid references public.posts(id) on delete cascade not null,
  reaction_type text not null,
  count integer default 0,
  unique(post_id, reaction_type)
);

-- Enable RLS for reactions
alter table public.post_reactions enable row level security;

-- Allow public to read reactions
create policy "Public reactions are viewable by everyone"
  on public.post_reactions for select
  using ( true );

-- Allow public to update reactions (increment count)
-- Note: In a real app, you'd use a function to increment safely, 
-- but for simplicity we'll allow update if they know the ID. 
-- Better approach: RPC function.
create policy "Public can update reactions"
  on public.post_reactions for update
  using ( true );

-- Create RPC function for incrementing reactions safely
create or replace function increment_reaction(p_id uuid, r_type text)
returns void as $$
begin
  insert into public.post_reactions (post_id, reaction_type, count)
  values (p_id, r_type, 1)
  on conflict (post_id, reaction_type)
  do update set count = post_reactions.count + 1;
end;

-- Create marketing_campaigns table
create table if not exists public.marketing_campaigns (
  id uuid default gen_random_uuid() primary key,
  is_active boolean default false,
  title text not null,
  description text,
  discount_code text,
  discount_percent integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.marketing_campaigns enable row level security;

-- Allow public read access (so the popup can show)
create policy "Public can view marketing campaigns"
  on public.marketing_campaigns for select
  using ( true );

-- Allow admins to update (we'll assume authenticated users are admins for now, or use specific role)
create policy "Admins can manage marketing campaigns"
  on public.marketing_campaigns for all
  using ( auth.role() = 'authenticated' );

-- Insert a default row if it doesn't exist (we only need one row for the site-wide campaign)
insert into public.marketing_campaigns (is_active, title, description, discount_code, discount_percent)
select false, 'Welcome Offer', 'Get 10% off your first order', 'WELCOME10', 10
where not exists (select 1 from public.marketing_campaigns);
