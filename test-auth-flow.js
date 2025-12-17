// Test complete auth flow
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testFlow() {
  console.log('🧪 Testing Heaven Resort Auth Flow\n');

  // Test 1: Public contact message (anon)
  console.log('1️⃣ Testing public contact message (no auth)...');
  const { data: contactData, error: contactError } = await supabase
    .from('contact_messages')
    .insert({
      name: 'Public Test User',
      email: 'public@test.com',
      phone: '+386 40 111 222',
      message: 'This is a public inquiry - no login required!'
    })
    .select()
    .single();

  if (contactError) {
    console.log('❌ Contact message failed:', contactError.message);
  } else {
    console.log('✅ Contact message created:', contactData.id);
  }

  // Test 2: Sign in with test user
  console.log('\n2️⃣ Signing in as testuser@example.com...');
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'testuser@example.com',
    password: 'TestPass123'
  });

  if (authError) {
    console.log('❌ Sign in failed:', authError.message);
    return;
  }
  console.log('✅ Signed in successfully! User ID:', authData.user.id);

  // Test 3: Create booking (authenticated)
  console.log('\n3️⃣ Creating booking as authenticated user...');
  const { data: bookingData, error: bookingError } = await supabase
    .from('bookings')
    .insert({
      name: 'Authenticated User Booking',
      email: 'testuser@example.com',
      phone: '+386 40 123 456',
      event_type: 'wedding',
      event_date: '2025-06-15',
      guests: 50,
      message: 'Test booking from authenticated user!',
      status: 'pending'
    })
    .select()
    .single();

  if (bookingError) {
    console.log('❌ Booking failed:', bookingError.message);
  } else {
    console.log('✅ Booking created:', bookingData.id);
  }

  // Test 4: View all bookings (authenticated)
  console.log('\n4️⃣ Fetching all bookings...');
  const { data: allBookings, error: fetchError } = await supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  if (fetchError) {
    console.log('❌ Fetch failed:', fetchError.message);
  } else {
    console.log(`✅ Found ${allBookings.length} bookings`);
    allBookings.forEach(b => {
      console.log(`   - ${b.name} (${b.event_type}) - ${b.status}`);
    });
  }

  console.log('\n🎉 All tests completed!');
}

testFlow().catch(console.error);
