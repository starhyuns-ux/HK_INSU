-- schema.sql

-- Enable RLS
alter table auth.users enable row level security;

-- 1. Create tables
create table companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  homepage_url text,
  created_at timestamptz default now()
);

create table riders (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references companies(id) on delete cascade not null,
  name text not null,
  category text, -- 'cancer', 'brain_heart', 'injury', 'hospitalization', 'surgery', etc.
  summary text,
  notes text,
  source_url text,
  created_at timestamptz default now()
);

-- Competition/Compare Feed Items
create table comparisons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

create table comparison_items (
  id uuid primary key default gen_random_uuid(),
  comparison_id uuid references comparisons(id) on delete cascade not null,
  rider_id uuid references riders(id) on delete cascade not null,
  pros text,
  cons text,
  rationale text,
  score int,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Plans (User created)
create table plans (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  created_by uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now()
);

create table plan_items (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid references plans(id) on delete cascade not null,
  rider_id uuid references riders(id) on delete cascade not null,
  custom_note text,
  sort_order int default 0,
  created_at timestamptz default now()
);

-- Rider Limits (User customization per rider)
create table rider_limits (
  id uuid primary key default gen_random_uuid(),
  rider_id uuid references riders(id) on delete cascade not null,
  created_by uuid references auth.users(id) on delete cascade not null,
  max_amount bigint, -- currency in KRW won
  age_min int,
  age_max int,
  term_options text, -- e.g. "20y/100y"
  waiting_period text, -- e.g. "90 days 50%"
  exclusions text, -- e.g. "1 year limit"
  reference_url text,
  updated_at timestamptz default now(),
  unique(rider_id, created_by)
);

-- Share Links
create table share_links (
  id uuid primary key default gen_random_uuid(),
  created_by uuid references auth.users(id) on delete cascade not null,
  type text check (type in ('plan', 'comparison')),
  target_id uuid not null, -- plan_id or comparison_id
  token text unique not null,
  is_active boolean default true,
  created_at timestamptz default now()
);

-- 2. RLS Policies

-- Companies: Public read, Admin write (but for this MVP maybe allow authenticated users to add?)
-- Requirement says "User(planner) inputs/manages company riders". So Authenticated users can INSERT/UPDATE.
alter table companies enable row level security;
create policy "Companies are viewable by everyone" on companies for select using (true);
create policy "Authenticated users can insert companies" on companies for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update companies" on companies for update using (auth.role() = 'authenticated');

alter table riders enable row level security;
create policy "Riders are viewable by everyone" on riders for select using (true);
create policy "Authenticated users can insert riders" on riders for insert with check (auth.role() = 'authenticated');
create policy "Authenticated users can update riders" on riders for update using (auth.role() = 'authenticated');

-- Comparisons: Private to creator + Public via Share Link?
-- "RLS: Own data only CRUD".
alter table comparisons enable row level security;
create policy "Users can CRUD their own comparisons" on comparisons using (auth.uid() = created_by);
-- Also allow reading if a valid share link exists? (This requires a function or just make share_links queryable public with token)
-- For specific shared pages, we might use a Postgres function `get_shared_comparison(token)` with security definer to bypass RLS.

alter table comparison_items enable row level security;
create policy "Users can CRUD their own comparison items" on comparison_items using (
  exists (select 1 from comparisons c where c.id = comparison_id and c.created_by = auth.uid())
);

-- Plans: Private to creator
alter table plans enable row level security;
create policy "Users can CRUD their own plans" on plans using (auth.uid() = created_by);

alter table plan_items enable row level security;
create policy "Users can CRUD their own plan items" on plan_items using (
  exists (select 1 from plans p where p.id = plan_id and p.created_by = auth.uid())
);

-- Rider Limits: Private to creator
alter table rider_limits enable row level security;
create policy "Users can CRUD their own rider limits" on rider_limits using (auth.uid() = created_by);

-- Share Links: Private to creator to manage. Public read by token?
-- Actually the public access will be done via API with service role or a specific RLS.
-- Let's keep strict RLS for direct table access.
alter table share_links enable row level security;
create policy "Users can CRUD their own share links" on share_links using (auth.uid() = created_by);
create policy "Public can read share links by token" on share_links for select using (true); -- Allow looking up by token
