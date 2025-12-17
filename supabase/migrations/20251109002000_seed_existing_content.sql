-- Seed existing website content into CMS tables
-- This populates the database with current site content

-- Events (from translations)
INSERT INTO public.events (title_sl, title_en, description_sl, description_en, image_url, capacity, order_index, published) VALUES
('Poroke', 'Weddings', 'Ustvarite nepozabne spomine na vaš poseben dan v naši elegantni lokaciji, obkroženi z naravo.', 'Create unforgettable memories on your special day in our elegant venue, surrounded by nature.', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070', 150, 0, true),
('Poslovni dogodki', 'Corporate Events', 'Popoln prostor za konference, seminarje in poslovne zabave s sodobno opremo.', 'Perfect space for conferences, seminars, and corporate parties with modern equipment.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069', 100, 1, true),
('Delavnice', 'Workshops', 'Intimni prostor za transformativne delavnice, jogo in wellness programe.', 'Intimate space for transformative workshops, yoga, and wellness programs.', 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2070', 30, 2, true),
('Zasebna praznovanja', 'Private Celebrations', 'Od rojstnih dni do obletnic - praznujte življenjske mejnike v stilu.', 'From birthdays to anniversaries - celebrate life''s milestones in style.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070', 80, 3, true)
ON CONFLICT DO NOTHING;

-- Accommodation Units (from current site)
INSERT INTO public.accommodation_units (name_sl, name_en, description_sl, description_en, price, currency, capacity, images, amenities_sl, amenities_en, order_index, published) VALUES
('Vila HEAVEN', 'HEAVEN Villa', 'Luksuzna vila z zasebnim vrtom in panoramskim razgledom. Popolna za večje skupine ali družine.', 'Luxury villa with private garden and panoramic views. Perfect for larger groups or families.', 450, 'EUR', 12, ARRAY['https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920', 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920'], ARRAY['Zasebna kuhinja', 'Zunanja terasa', 'Parking', 'WiFi', 'Klimatizacija'], ARRAY['Private kitchen', 'Outdoor terrace', 'Parking', 'WiFi', 'Air conditioning'], 0, true),
('Premium Apartma', 'Premium Apartment', 'Prostoren apartma s kuhinjo in dnevnim prostorom. Idealen za daljše bivanje.', 'Spacious apartment with kitchen and living area. Ideal for extended stays.', 280, 'EUR', 6, ARRAY['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920'], ARRAY['Kuhinja', 'Terasa', 'WiFi', 'TV'], ARRAY['Kitchen', 'Terrace', 'WiFi', 'TV'], 1, true),
('Deluxe Soba', 'Deluxe Room', 'Elegantno opremljena soba z vsemi ugodji. Popolna za pare ali manjše skupine.', 'Elegantly furnished room with all amenities. Perfect for couples or small groups.', 180, 'EUR', 4, ARRAY['https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920'], ARRAY['Zasebna kopalnica', 'WiFi', 'Mini bar', 'TV'], ARRAY['Private bathroom', 'WiFi', 'Mini bar', 'TV'], 2, true)
ON CONFLICT DO NOTHING;

-- Packages (from current site)
INSERT INTO public.packages (name_sl, name_en, description_sl, description_en, price, currency, duration_days, includes_sl, includes_en, image_url, featured, order_index, published) VALUES
('Vikend Oddih', 'Weekend Retreat', 'Popoln pobeg iz vsakdana. Uživajte v miru narave in transformativnih izkušnjah.', 'Perfect escape from everyday life. Enjoy the peace of nature and transformative experiences.', 890, 'EUR', 3, ARRAY['2 nočitvi', 'Zajtrk in večerja', 'Joga seje', 'Wellness tretmaji', 'Dostop do objektov'], ARRAY['2 nights', 'Breakfast and dinner', 'Yoga sessions', 'Wellness treatments', 'Facility access'], 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920', true, 0, true),
('Poročni Paket Premium', 'Premium Wedding Package', 'Vse za vaš popoln dan. Od lokacije do aranžmajev in pogostitve.', 'Everything for your perfect day. From venue to arrangements and catering.', 8500, 'EUR', 1, ARRAY['Najem lokacije (12 ur)', 'Dekoracija', 'Pogostitev (100 oseb)', 'Poročna torta', 'Koordinator dogodka'], ARRAY['Venue rental (12 hrs)', 'Decoration', 'Catering (100 guests)', 'Wedding cake', 'Event coordinator'], 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=1920', true, 1, true),
('Poslovni Retreat', 'Corporate Retreat', 'Ojačajte svojo ekipo v inspirativnem okolju. Vključuje prostor, prehrano in dejavnosti.', 'Strengthen your team in an inspiring environment. Includes space, meals, and activities.', 2400, 'EUR', 2, ARRAY['Konferenčna oprema', 'Polni penzion', 'Team building', 'Nastanitev', 'WiFi in tehnična podpora'], ARRAY['Conference equipment', 'Full board', 'Team building', 'Accommodation', 'WiFi and tech support'], 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920', false, 2, true),
('Wellness Vikend', 'Wellness Weekend', 'Revitalizirajte telo in um. Joga, meditacija, masaže in zdrava prehrana.', 'Revitalize body and mind. Yoga, meditation, massages, and healthy cuisine.', 650, 'EUR', 2, ARRAY['2 nočitvi', 'Zdrava prehrana', 'Dnevna joga', '2 masaži', 'Meditacija'], ARRAY['2 nights', 'Healthy cuisine', 'Daily yoga', '2 massages', 'Meditation'], 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=1920', false, 3, true)
ON CONFLICT DO NOTHING;

-- Gallery Images (sample from current site)
INSERT INTO public.gallery_images (url, title_sl, title_en, category, order_index, published) VALUES
('https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920', 'Zunanjost resorta', 'Resort exterior', 'venue', 0, true),
('https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1920', 'Notranji prostor', 'Interior space', 'venue', 1, true),
('https://images.unsplash.com/photo-1519741497674-611481863552?w=1920', 'Poročna lokacija', 'Wedding venue', 'events', 2, true),
('https://images.unsplash.com/photo-1511578314322-379afb476865?w=1920', 'Konferenčna dvorana', 'Conference hall', 'events', 3, true),
('https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=1920', 'Apartma', 'Apartment', 'accommodation', 4, true),
('https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=1920', 'Soba', 'Room', 'accommodation', 5, true),
('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920', 'Narava okoli', 'Surrounding nature', 'nature', 6, true),
('https://images.unsplash.com/photo-1540541338287-41700207dee6?w=1920', 'Terasa s pogledom', 'Terrace with view', 'venue', 7, true)
ON CONFLICT DO NOTHING;
