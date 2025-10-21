import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Booking {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone: string;
  event_type: string;
  event_date: string;
  guests: number;
  message: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
}

// API functions
export async function createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ ...booking, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function createContactMessage(message: Omit<ContactMessage, 'id' | 'created_at' | 'status'>) {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{ ...message, status: 'new' }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAvailableDates(month: number, year: number) {
  const { data, error } = await supabase
    .from('bookings')
    .select('event_date')
    .eq('status', 'confirmed')
    .gte('event_date', `${year}-${month.toString().padStart(2, '0')}-01`)
    .lt('event_date', `${year}-${(month + 1).toString().padStart(2, '0')}-01`);

  if (error) throw error;
  return data.map(b => new Date(b.event_date));
}
