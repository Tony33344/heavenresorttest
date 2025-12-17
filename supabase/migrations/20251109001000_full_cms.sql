-- Full CMS for all website sections
-- This allows admin to edit all content without redeploying

-- Content blocks for simple sections (hero, about, venue, footer, etc.)
-- Supports i18n with lang field
CREATE TABLE IF NOT EXISTS public.content_blocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  section text NOT NULL, -- 'hero', 'about', 'venue', 'footer', etc.
  lang text NOT NULL DEFAULT 'sl', -- 'sl' or 'en'
  data jsonb NOT NULL DEFAULT '{}', -- flexible JSON structure for each section
  UNIQUE(section, lang)
);

-- Events/Dogodki
CREATE TABLE IF NOT EXISTS public.events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  title_sl text NOT NULL,
  title_en text NOT NULL,
  description_sl text,
  description_en text,
  image_url text,
  capacity int,
  duration_hours int,
  order_index int DEFAULT 0,
  published boolean DEFAULT true
);

-- Accommodation units
CREATE TABLE IF NOT EXISTS public.accommodation_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name_sl text NOT NULL,
  name_en text NOT NULL,
  description_sl text,
  description_en text,
  price numeric(10,2),
  currency text DEFAULT 'EUR',
  price_text_sl text,
  price_text_en text,
  capacity int,
  images text[] DEFAULT '{}',
  amenities_sl text[] DEFAULT '{}',
  amenities_en text[] DEFAULT '{}',
  order_index int DEFAULT 0,
  published boolean DEFAULT true
);

-- Packages
CREATE TABLE IF NOT EXISTS public.packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name_sl text NOT NULL,
  name_en text NOT NULL,
  description_sl text,
  description_en text,
  price numeric(10,2),
  currency text DEFAULT 'EUR',
  price_text_sl text,
  price_text_en text,
  duration_days int,
  includes_sl text[] DEFAULT '{}',
  includes_en text[] DEFAULT '{}',
  image_url text,
  featured boolean DEFAULT false,
  order_index int DEFAULT 0,
  published boolean DEFAULT true
);

-- Gallery images (or we can reuse media_items)
CREATE TABLE IF NOT EXISTS public.gallery_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  url text NOT NULL,
  title_sl text,
  title_en text,
  category text, -- 'venue', 'events', 'accommodation', 'nature', etc.
  order_index int DEFAULT 0,
  published boolean DEFAULT true
);

-- RLS policies
ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.accommodation_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;

-- Public can read all published content
CREATE POLICY "content_blocks_public_select" ON public.content_blocks FOR SELECT USING (true);
CREATE POLICY "events_public_select" ON public.events FOR SELECT USING (published = true);
CREATE POLICY "accommodation_public_select" ON public.accommodation_units FOR SELECT USING (published = true);
CREATE POLICY "packages_public_select" ON public.packages FOR SELECT USING (published = true);
CREATE POLICY "gallery_public_select" ON public.gallery_images FOR SELECT USING (published = true);

-- Authenticated users can do everything (admin control)
CREATE POLICY "content_blocks_auth_all" ON public.content_blocks FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "events_auth_all" ON public.events FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "accommodation_auth_all" ON public.accommodation_units FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "packages_auth_all" ON public.packages FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "gallery_auth_all" ON public.gallery_images FOR ALL USING (auth.role() = 'authenticated');

-- Updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trg_content_blocks_updated_at BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_events_updated_at BEFORE UPDATE ON public.events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_accommodation_updated_at BEFORE UPDATE ON public.accommodation_units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_packages_updated_at BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Seed initial content blocks with current website content
INSERT INTO public.content_blocks (section, lang, data) VALUES
('hero', 'sl', '{"title": "HEAVEN Resort", "subtitle": "TRANSFORMATIVNA DOŽIVETJA", "description": "Eleganten prostor za dogodke in transformativne izkušnje v objemu narave", "cta_text": "Rezerviraj Zdaj", "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"}'),
('hero', 'en', '{"title": "HEAVEN Resort", "subtitle": "TRANSFORMATIVE EXPERIENCES", "description": "Elegant event space and transformative experiences embraced by nature", "cta_text": "Book Now", "image_url": "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920"}'),
('about', 'sl', '{"title": "O HEAVEN Resort", "subtitle": "Prostor za Transformacijo", "description": "HEAVEN Resort je več kot le prizorišče – je portal v transformativno izkušnjo..."}'),
('about', 'en', '{"title": "About HEAVEN Resort", "subtitle": "Space for Transformation", "description": "HEAVEN Resort is more than just a venue – it''s a portal to a transformative experience..."}'),
('venue', 'sl', '{"title": "Naš Prostor", "description": "Naša elegantna lokacija je skrbno oblikovana za ustvarjanje nepozabnih trenutkov..."}'),
('venue', 'en', '{"title": "Our Venue", "description": "Our elegant location is carefully designed to create unforgettable moments..."}')
ON CONFLICT (section, lang) DO NOTHING;
