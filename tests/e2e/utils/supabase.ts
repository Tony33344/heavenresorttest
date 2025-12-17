import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!url || !anon) {
  // eslint-disable-next-line no-console
  console.warn('Supabase env vars are not set. Some E2E tests may be skipped.');
}

export const supabase = url && anon ? createClient(url, anon) : null;
