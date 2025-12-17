/* eslint-disable no-console */
const path = require('path');
const fs = require('fs');
require('dotenv').config();
// Also load .env.local if present
try {
  require('dotenv').config({ path: path.resolve(process.cwd(), '.env.local') });
} catch {}
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE = process.env.SUPABASE_SERVICE_ROLE || process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL in env');
  process.exit(1);
}
if (!SERVICE_ROLE) {
  console.error('Missing SUPABASE_SERVICE_ROLE (or SUPABASE_SERVICE_ROLE_KEY) in env.');
  console.error('Export it only for this one-time seeding, do NOT commit it.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);

(async () => {
  try {
    const suffix = Date.now();
    const adminEmail = `admin.e2e.${suffix}@example.com`;
    const adminPassword = `Admin!${suffix}`;
    const userEmail = `user.e2e.${suffix}@example.com`;
    const userPassword = `User!${suffix}`;

    console.log('Creating admin user...');
    const { data: adminData, error: adminErr } = await supabase.auth.admin.createUser({
      email: adminEmail,
      password: adminPassword,
      email_confirm: true,
      user_metadata: { role: 'admin', source: 'e2e-seed' },
      app_metadata: { role: 'admin' },
    });
    if (adminErr) throw adminErr;

    console.log('Creating normal user...');
    const { data: userData, error: userErr } = await supabase.auth.admin.createUser({
      email: userEmail,
      password: userPassword,
      email_confirm: true,
      user_metadata: { role: 'user', source: 'e2e-seed' },
      app_metadata: { role: 'user' },
    });
    if (userErr) throw userErr;

    const outPath = path.resolve(process.cwd(), 'tests/.e2e-seeded.json');
    const payload = { admin: { email: adminEmail, password: adminPassword }, user: { email: userEmail, password: userPassword } };
    try { fs.mkdirSync(path.dirname(outPath), { recursive: true }); } catch {}
    fs.writeFileSync(outPath, JSON.stringify(payload, null, 2));

    console.log('E2E_ADMIN_EMAIL=' + adminEmail);
    console.log('E2E_ADMIN_PASSWORD=' + adminPassword);
    console.log('E2E_USER_EMAIL=' + userEmail);
    console.log('E2E_USER_PASSWORD=' + userPassword);
    console.log('\nSaved seeded credentials to tests/.e2e-seeded.json');
  } catch (e) {
    console.error('Seeding failed:', e);
    process.exit(1);
  }
})();
