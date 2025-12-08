-- Create a table for newsletter subscribers
create table if not exists newsletter_subscribers (
  id uuid default uuid_generate_v4() primary key,
  email text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  is_active boolean default true
);

-- Enable Row Level Security (RLS)
alter table newsletter_subscribers enable row level security;

-- Allow the service role (backend API) to insert/read data
create policy "Service role can do everything on newsletter_subscribers"
  on newsletter_subscribers
  for all
  using ( true )
  with check ( true );

-- Optional: Allow public to insert (if you weren't using the service role key in the API)
-- But since we use SERVICE_ROLE_KEY in the API route, the above policy is sufficient for the backend.
