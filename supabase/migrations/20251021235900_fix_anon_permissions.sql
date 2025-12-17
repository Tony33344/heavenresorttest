-- ============================================
-- FIX ANONYMOUS INSERT - GRANT PERMISSIONS FIRST
-- ============================================

-- Step 1: Grant INSERT permission to anon role on tables
GRANT INSERT ON bookings TO anon;
GRANT INSERT ON contact_messages TO anon;

-- Step 2: Grant USAGE on sequences (for auto-increment IDs)
GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Step 3: Drop all existing policies
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

-- Step 4: Enable RLS
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Step 5: Create permissive policies for INSERT
CREATE POLICY "bookings_anon_insert_policy"
ON bookings
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

CREATE POLICY "contact_anon_insert_policy"
ON contact_messages
AS PERMISSIVE
FOR INSERT
TO anon
WITH CHECK (true);

-- Step 6: Create policies for authenticated users
CREATE POLICY "bookings_auth_all_policy"
ON bookings
AS PERMISSIVE
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "contact_auth_all_policy"
ON contact_messages
AS PERMISSIVE
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);
