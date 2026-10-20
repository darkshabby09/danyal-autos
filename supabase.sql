-- Run this once: Supabase dashboard > SQL Editor > New query > paste > Run
create table if not exists settings (k text primary key, v text);
create table if not exists categories (id bigint generated always as identity primary key, name text not null, logo text);
create table if not exists stock (
  id bigint generated always as identity primary key, category_id bigint, title text not null, price text, year text,
  details text, image text, status text default 'Available', installment text default 'Yes', created timestamptz default now());
create table if not exists accessories (
  id bigint generated always as identity primary key, title text not null, price text, details text, image text,
  status text default 'In stock', created timestamptz default now());
create table if not exists gallery (id bigint generated always as identity primary key, title text, image text, created timestamptz default now());

-- Tables are private: only the website server (service role key) can read or write them.
alter table settings enable row level security;
alter table categories enable row level security;
alter table stock enable row level security;
alter table accessories enable row level security;
alter table gallery enable row level security;

-- Public bucket for photos
insert into storage.buckets (id, name, public) values ('images', 'images', true) on conflict (id) do nothing;

-- Starting categories
insert into categories (name) select x from unnest(array['Honda','Highspeed','Unique','Electric Scooters']) x
where not exists (select 1 from categories);
