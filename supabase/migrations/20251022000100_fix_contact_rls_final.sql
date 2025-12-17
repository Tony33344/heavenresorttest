-- FINAL FIX FOR CONTACT MESSAGES PUBLIC INSERT
-- The issue: GRANT permissions weren't applied correctly

-- Step 1: Grant table-level permissions to anon role
GRANT USAGE ON SCHEMA public TO anon;
GRANT INSERT ON TABLE public.contact_messages TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon;

-- Step 2: Drop and recreate the policy
DROP POLICY IF EXISTS "contact_public_insert" ON contact_messages;

-- Step 3: Create a simple, permissive policy
CREATE POLICY "contact_public_insert"
ON public.contact_messages
FOR INSERT
TO anon
WITH CHECK (true);

-- Verify RLS is enabled
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;
