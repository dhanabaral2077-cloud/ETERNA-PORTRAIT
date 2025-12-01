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
