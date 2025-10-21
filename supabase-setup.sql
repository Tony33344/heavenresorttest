-- HEAVEN Resort - Supabase Database Setup
-- Run this SQL in your Supabase SQL Editor

-- ============================================
-- BOOKINGS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS bookings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  event_type TEXT,
  event_date DATE,
  guests INTEGER,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================
-- CONTACT MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  reply TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_event_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_status ON contact_messages(status);
CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES
-- ============================================

-- Allow public to insert bookings (for website form submissions)
DROP POLICY IF EXISTS "Allow public insert bookings" ON bookings;
CREATE POLICY "Allow public insert bookings" ON bookings
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all bookings (for admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated read bookings" ON bookings;
CREATE POLICY "Allow authenticated read bookings" ON bookings
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update bookings (for admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated update bookings" ON bookings;
CREATE POLICY "Allow authenticated update bookings" ON bookings
  FOR UPDATE TO authenticated
  USING (true);

-- Allow public to insert contact messages (for website form submissions)
DROP POLICY IF EXISTS "Allow public insert contact" ON contact_messages;
CREATE POLICY "Allow public insert contact" ON contact_messages
  FOR INSERT TO anon
  WITH CHECK (true);

-- Allow authenticated users to view all contact messages (for admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated read contact" ON contact_messages;
CREATE POLICY "Allow authenticated read contact" ON contact_messages
  FOR SELECT TO authenticated
  USING (true);

-- Allow authenticated users to update contact messages (for admin dashboard)
DROP POLICY IF EXISTS "Allow authenticated update contact" ON contact_messages;
CREATE POLICY "Allow authenticated update contact" ON contact_messages
  FOR UPDATE TO authenticated
  USING (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- ============================================
-- TRIGGERS
-- ============================================

-- Trigger for bookings updated_at
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for contact_messages updated_at
DROP TRIGGER IF EXISTS update_contact_messages_updated_at ON contact_messages;
CREATE TRIGGER update_contact_messages_updated_at
    BEFORE UPDATE ON contact_messages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================

-- Uncomment to insert sample booking
-- INSERT INTO bookings (name, email, phone, event_type, event_date, guests, message, status)
-- VALUES ('John Doe', 'john@example.com', '+386 40 123 456', 'wedding', '2025-06-15', 50, 'Looking for a beautiful wedding venue', 'pending');

-- Uncomment to insert sample contact message
-- INSERT INTO contact_messages (name, email, phone, message, status)
-- VALUES ('Jane Smith', 'jane@example.com', '+386 41 234 567', 'I would like more information about corporate retreats', 'new');

-- ============================================
-- VERIFICATION QUERIES
-- ============================================

-- Check if tables were created successfully
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('bookings', 'contact_messages');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('bookings', 'contact_messages');

-- View all policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename IN ('bookings', 'contact_messages');

-- ============================================
-- NOTES
-- ============================================
-- 1. After running this script, go to Supabase Dashboard > Settings > API
-- 2. Copy your project URL and anon/public key
-- 3. Add them to your .env.local file:
--    NEXT_PUBLIC_SUPABASE_URL=your_project_url
--    NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
-- 4. For admin access, you'll need to set up authentication
-- 5. Consider setting up email notifications for new bookings
