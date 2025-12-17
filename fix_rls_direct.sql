-- Drop all existing policies
DROP POLICY IF EXISTS "Allow public insert bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated read bookings" ON bookings;
DROP POLICY IF EXISTS "Allow authenticated update bookings" ON bookings;
DROP POLICY IF EXISTS "Enable insert for anon users" ON bookings;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON bookings;

DROP POLICY IF EXISTS "Allow public insert contact" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated read contact" ON contact_messages;
DROP POLICY IF EXISTS "Allow authenticated update contact" ON contact_messages;
DROP POLICY IF EXISTS "Enable insert for anon users" ON contact_messages;
DROP POLICY IF EXISTS "Enable all for authenticated users" ON contact_messages;

-- Create simple permissive policies for bookings
CREATE POLICY "anon_insert_bookings" ON bookings
  FOR INSERT 
  TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_all_bookings" ON bookings
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create simple permissive policies for contact_messages
CREATE POLICY "anon_insert_contact" ON contact_messages
  FOR INSERT 
  TO anon
  WITH CHECK (true);

CREATE POLICY "authenticated_all_contact" ON contact_messages
  FOR ALL 
  TO authenticated
  USING (true)
  WITH CHECK (true);
