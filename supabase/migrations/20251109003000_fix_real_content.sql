-- Clear fake data and add REAL content from the actual website

-- Clear all existing content
DELETE FROM public.events;
DELETE FROM public.accommodation_units;
DELETE FROM public.packages;
DELETE FROM public.gallery_images;
DELETE FROM public.content_blocks;

-- Add REAL hero content (SL and EN)
INSERT INTO public.content_blocks (section, lang, data) VALUES
('hero', 'sl', jsonb_build_object(
  'subtitle', 'TRANSFORMATIVNA IDOŽIVETJA',
  'description', 'Eleganten prostor za dogodke in transformativne izkušnje v objemu narave',
  'cta_text', 'Rezerviraj Zdaj',
  'background_image', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2560&auto=format&fit=crop'
)),
('hero', 'en', jsonb_build_object(
  'subtitle', 'TRANSFORMATIVE EXPERIENCES',
  'description', 'Elegant event space and transformative experiences embraced by nature',
  'cta_text', 'Book Now',
  'background_image', 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2560&auto=format&fit=crop'
));

-- Add REAL about content
INSERT INTO public.content_blocks (section, lang, data) VALUES
('about', 'sl', jsonb_build_object(
  'description1', 'HEAVEN Resort je edinstven prostor, kjer se eleganca sreča z naravo. Nahajamo se na vrhu hriba v bližini Šmarje pri Podčetrtku, obkroženi z osupljivimi razgledi in sončnimi zahodi.',
  'description2', 'Naš resort ponuja popolno kombinacijo luksuzne nastanitve, profesionalnih prostorov za dogodke in pristnega stika z naravo. Ustvarjamo transformativne izkušnje za poroke, korporativne dogodke, delavnice in zasebne praznovanja.',
  'description3', 'Z nastanitvijo za več kot 10 gostov v elegantnih notranjih prostorih in možnostjo kampiranja na prostem, nudimo fleksibilnost za dogodke vseh velikosti.',
  'image_url', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070'
)),
('about', 'en', jsonb_build_object(
  'description1', 'HEAVEN Resort is a unique space where elegance meets nature. We are located on a hilltop near Šmarje pri Podčetrtku, surrounded by stunning views and beautiful sunsets.',
  'description2', 'Our resort offers the perfect combination of luxury accommodation, professional event spaces, and authentic connection with nature. We create transformative experiences for weddings, corporate events, workshops, and private celebrations.',
  'description3', 'With accommodation for 10+ guests in elegant indoor spaces and outdoor camping options, we offer flexibility for events of all sizes.',
  'image_url', 'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070'
));

-- Add REAL events (from website)
INSERT INTO public.events (title_sl, title_en, description_sl, description_en, image_url, order_index, published) VALUES
('Poroke', 'Weddings', 'Sanjska poročna lokacija v objemu narave. Eleganten prostor za vaš poseben dan.', 'Dream wedding location embraced by nature. Elegant space for your special day.', 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070', 0, true),
('Korporativni Dogodki', 'Corporate Events', 'Profesionalni prostori za sestanke, team building in korporativne retreat-e.', 'Professional spaces for meetings, team building, and corporate retreats.', 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=2069', 1, true),
('Delavnice', 'Workshops', 'Navdihujoče okolje za osebno rast, jogo, meditacijo in kreativne delavnice.', 'Inspiring environment for personal growth, yoga, meditation, and creative workshops.', 'https://images.unsplash.com/photo-1545389336-cf090694435e?q=80&w=2070', 2, true),
('Zasebni Dogodki', 'Private Events', 'Praznujte rojstne dneve, obletnice in družinska srečanja v ekskluzivnem okolju.', 'Celebrate birthdays, anniversaries, and family gatherings in an exclusive setting.', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=2070', 3, true);

-- Add REAL accommodation (from website - only 2 types)
INSERT INTO public.accommodation_units (name_sl, name_en, description_sl, description_en, capacity, images, amenities_sl, amenities_en, order_index, published) VALUES
('Notranja Nastanitev', 'Indoor Accommodation', 'Elegantno opremljeni notranji prostori z nastanitvijo za 10+ gostov. Moderni komfort v harmoniji z naravo.', 'Elegantly furnished indoor spaces with accommodation for 10+ guests. Modern comfort in harmony with nature.', 10, ARRAY['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071'], ARRAY['Zasebne sobe', 'Skupni prostori', 'Moderna kopalnica', 'Wi-Fi'], ARRAY['Private rooms', 'Common areas', 'Modern bathroom', 'Wi-Fi'], 0, true),
('Kampiranje', 'Camping', 'Prostrani zunanji prostori z možnostjo kampiranja in šotorov. Idealno za večje dogodke in festivale.', 'Spacious outdoor areas with camping and tent options. Ideal for larger events and festivals.', 100, ARRAY['https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070'], ARRAY['Šotorski prostori', 'Sanitarije', 'Skupna kuhinja', 'Prostor za ogenj'], ARRAY['Tent spaces', 'Sanitary facilities', 'Shared kitchen', 'Fire pit area'], 1, true);

-- Add REAL packages (from website)
INSERT INTO public.packages (name_sl, name_en, description_sl, description_en, price_text_sl, price_text_en, includes_sl, includes_en, featured, order_index, published) VALUES
('Poročni Paket', 'Wedding Package', 'Popoln paket za vaš poseben dan.', 'Perfect package for your special day.', 'Od €3.500', 'From €3,500', ARRAY['Celodnevna uporaba lokacije', 'Nastanitev za 10 gostov', 'Poročna dekoracija', 'Koordinacija cateringa', 'Osebni koordinator'], ARRAY['Full-day venue use', 'Accommodation for 10 guests', 'Wedding decoration', 'Catering coordination', 'Personal coordinator'], true, 0, true),
('Korporativni Paket', 'Corporate Package', 'Profesionalni prostor za vaše poslovne dogodke.', 'Professional space for your business events.', 'Od €2.000', 'From €2,000', ARRAY['Konferenčni prostori', 'AV oprema', 'Catering', 'Nastanitev', 'Team building aktivnosti'], ARRAY['Conference spaces', 'AV equipment', 'Catering', 'Accommodation', 'Team building activities'], false, 1, true),
('Retreat Paket', 'Retreat Package', 'Transformativna izkušnja v naravi.', 'Transformative experience in nature.', 'Od €1.500', 'From €1,500', ARRAY['Večdnevna nastanitev', 'Delavniški prostori', 'Obroki', 'Joga/meditacija', 'Naravne aktivnosti'], ARRAY['Multi-day accommodation', 'Workshop spaces', 'Meals', 'Yoga/meditation', 'Nature activities'], false, 2, true),
('Po Meri', 'Custom', 'Prilagojeni paketi za vaše potrebe.', 'Customized packages for your needs.', 'Ponudba', 'Quote', ARRAY['Prilagojeni paketi', 'Fleksibilne možnosti', 'Osebna pomoč', 'Posebne zahteve', 'Kontaktirajte nas'], ARRAY['Customized packages', 'Flexible options', 'Personal assistance', 'Special requests', 'Contact us'], false, 3, true);

-- Add REAL gallery images
INSERT INTO public.gallery_images (url, title_sl, title_en, category, order_index, published) VALUES
('https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070', 'Narava', 'Nature', 'nature', 0, true),
('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070', 'Notranji prostori', 'Indoor spaces', 'venue', 1, true),
('https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070', 'Zunanji prostori', 'Outdoor spaces', 'venue', 2, true),
('https://images.unsplash.com/photo-1519167758481-83f29da8c2b6?q=80&w=2070', 'Dogodki', 'Events', 'events', 3, true),
('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=2070', 'Poroke', 'Weddings', 'events', 4, true),
('https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070', 'Kampiranje', 'Camping', 'accommodation', 5, true),
('https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=2071', 'Nastanitev', 'Accommodation', 'accommodation', 6, true),
('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070', 'Razgled', 'View', 'nature', 7, true);
