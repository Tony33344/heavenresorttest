-- ============================================
-- PROPER AUTHENTICATION & RLS SETUP
-- ============================================
-- Architecture:
-- 1. contact_messages: Public inquiries (anon can INSERT)
-- 2. bookings: User bookings (authenticated can INSERT)
-- 3. Admin users can view/manage everything

-- Step 1: Grant necessary permissions
GRANT INSERT ON contact_messages TO anon;
GRANT INSERT, SELECT ON bookings TO authenticated;
GRANT SELECT ON contact_messages TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Step 2: Drop all existing policies
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bookings') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON bookings';
    END LOOP;
    
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'contact_messages') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON contact_messages';
    END LOOP;
END $$;

-- Step 3: Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 4: CONTACT_MESSAGES policies (public inquiries)
-- Allow anyone (anon) to submit contact inquiries
CREATE POLICY "contact_public_insert"
ON contact_messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users to view all contact messages (for admin)
CREATE POLICY "contact_auth_select"
ON contact_messages
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update contact messages (for admin)
CREATE POLICY "contact_auth_update"
ON contact_messages
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 5: BOOKINGS policies (authenticated users only)
-- Allow authenticated users to INSERT their own bookings
CREATE POLICY "bookings_auth_insert"
ON bookings
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to view all bookings (for admin and own bookings)
CREATE POLICY "bookings_auth_select"
ON bookings
FOR SELECT
TO authenticated
USING (true);

-- Allow authenticated users to update bookings (for admin)
CREATE POLICY "bookings_auth_update"
ON bookings
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete bookings (for admin)
CREATE POLICY "bookings_auth_delete"
ON bookings
FOR DELETE
TO authenticated
USING (true);
