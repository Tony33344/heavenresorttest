-- ============================================
-- COMPLETE DATABASE SETUP WITH PROPER RLS
-- Based on Supabase Documentation
-- ============================================

-- Step 1: Drop ALL existing policies dynamically
DO $$ 
DECLARE
    r RECORD;
BEGIN
    -- Drop all policies from bookings table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'bookings') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON bookings';
    END LOOP;
    
    -- Drop all policies from contact_messages table
    FOR r IN (SELECT policyname FROM pg_policies WHERE tablename = 'contact_messages') LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || r.policyname || '" ON contact_messages';
    END LOOP;
END $$;

-- Step 2: Ensure RLS is enabled on both tables
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 3: Create policies for BOOKINGS table
-- Allow anonymous users (public/anon role) to INSERT bookings
CREATE POLICY "bookings_anon_insert"
ON bookings
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users full access to bookings
CREATE POLICY "bookings_auth_all"
ON bookings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Step 4: Create policies for CONTACT_MESSAGES table
-- Allow anonymous users (public/anon role) to INSERT contact messages
CREATE POLICY "contact_anon_insert"
ON contact_messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Allow authenticated users full access to contact messages
CREATE POLICY "contact_auth_all"
ON contact_messages
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
