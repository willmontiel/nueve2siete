-- nueve2siete: the garland's projects and the order log.
-- Paste the whole file into the Supabase SQL Editor and run it. It can run again without breaking anything.
--
-- The site uses the publishable (anon) key, which anyone can read from the page, so row level security decides
-- everything a visitor may do: read published projects, and add orders without ever reading them back.

-- 1. Projects: the gift tags of the garland on the Home --------------------------------------------------------

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 28),
  occasion text not null check (occasion in ('party', 'business', 'event')),
  summary text not null check (char_length(summary) between 1 and 160),
  photo text not null,
  photo_alt text not null,
  photo_position text not null default '50% 50%',
  color text not null check (color in ('lavender', 'pink', 'lime', 'pine')),
  color_ids text[] not null default '{}',
  product_slug text,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

comment on table public.projects is 'Gift tags of the garland on the Home. Photos go in the "projects" storage bucket.';
comment on column public.projects.title is 'Set large on the tag: 28 characters at most.';
comment on column public.projects.occasion is 'party (Fiesta), business (Empresa) or event (Evento).';
comment on column public.projects.summary is 'The story on the back of the tag: one or two sentences, 160 characters at most.';
comment on column public.projects.photo is 'File name in the "projects" bucket (jungla.jpg), or a full https:// address.';
comment on column public.projects.photo_alt is 'What the photo shows, for people who cannot see it.';
comment on column public.projects.photo_position is 'Which part of the photo stays in the tall crop, as CSS object-position: "50% 50%" is the centre.';
comment on column public.projects.color is 'Colour of the tag: lavender, pink, lime or pine.';
comment on column public.projects.color_ids is 'Colours of the pieces, as catalog colour ids: {rojo,azul-cielo}. Unknown ids are skipped.';
comment on column public.projects.product_slug is 'Catalog piece the visitor can design: portamicrofono, clicker-fidget or portafotos-margarita. Optional.';
comment on column public.projects.sort_order is 'Position in the garland, smallest first.';
comment on column public.projects.published is 'Untick to hide the tag without deleting it.';

alter table public.projects enable row level security;

revoke all on public.projects from anon, authenticated;
grant select on public.projects to anon, authenticated;

drop policy if exists "Anyone can read published projects" on public.projects;
create policy "Anyone can read published projects" on public.projects
  for select to anon, authenticated
  using (published);

-- 2. Orders: one row per "Pedir por WhatsApp", so the history survives a lost chat ------------------------------

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  code text not null check (char_length(code) <= 12),
  product_slug text not null check (char_length(product_slug) <= 60),
  product_name text not null check (char_length(product_name) <= 60),
  colors jsonb not null check (jsonb_typeof(colors) = 'array' and jsonb_array_length(colors) <= 8),
  custom_text text check (char_length(custom_text) <= 40),
  price_cop integer check (price_cop >= 0),
  message text not null check (char_length(message) <= 2000)
);

comment on table public.orders is 'Orders sent from the product page. The code is also in the WhatsApp message. Visitors can add rows but never read them.';
comment on column public.orders.colors is 'One entry per part: {"part": "Mango", "color": "Negro", "hex": "#1C1C1E"}.';

alter table public.orders enable row level security;

-- Visitors may insert only these columns: id and created_at are always set by the database
revoke all on public.orders from anon, authenticated;
grant insert (code, product_slug, product_name, colors, custom_text, price_cop, message)
  on public.orders to anon, authenticated;

-- Any visitor may add an order (the checks above cap its size); there is no select, update or delete policy,
-- so only the dashboard can read the orders
drop policy if exists "Visitors can log an order" on public.orders;
create policy "Visitors can log an order" on public.orders
  for insert to anon, authenticated
  with check (true);

-- 3. Photos of the projects: a public bucket, uploaded from the dashboard -----------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('projects', 'projects', true, 2097152, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
  set public = excluded.public,
      file_size_limit = excluded.file_size_limit,
      allowed_mime_types = excluded.allowed_mime_types;
