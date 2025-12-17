import { createClient } from '@supabase/supabase-js';
import { addMonths, startOfMonth, format } from 'date-fns';

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
  notes?: string;
  updated_at?: string;
}

export interface ContactMessage {
  id: string;
  created_at: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'read' | 'replied';
  reply?: string;
  updated_at?: string;
}

export interface Service {
  id: string;
  created_at: string;
  updated_at: string;
  title: string;
  slug: string;
  description?: string;
  price?: number;
  currency?: string; // e.g. 'EUR'
  price_text?: string; // optional display price
  images: string[]; // array of image URLs
  order_index: number;
  published: boolean;
}

export interface MediaItem {
  id: string;
  created_at: string;
  url: string;
  title?: string;
  tags: string[];
  order_index: number;
}

export interface ContentBlock {
  id: string;
  created_at: string;
  updated_at: string;
  section: string;
  lang: 'sl' | 'en';
  data: Record<string, any>;
}

export interface Event {
  id: string;
  created_at: string;
  updated_at: string;
  title_sl: string;
  title_en: string;
  description_sl?: string;
  description_en?: string;
  image_url?: string;
  capacity?: number;
  duration_hours?: number;
  order_index: number;
  published: boolean;
}

export interface AccommodationUnit {
  id: string;
  created_at: string;
  updated_at: string;
  name_sl: string;
  name_en: string;
  description_sl?: string;
  description_en?: string;
  price?: number;
  currency?: string;
  price_text_sl?: string;
  price_text_en?: string;
  capacity?: number;
  images: string[];
  amenities_sl: string[];
  amenities_en: string[];
  order_index: number;
  published: boolean;
}

export interface Package {
  id: string;
  created_at: string;
  updated_at: string;
  name_sl: string;
  name_en: string;
  description_sl?: string;
  description_en?: string;
  price?: number;
  currency?: string;
  price_text_sl?: string;
  price_text_en?: string;
  duration_days?: number;
  includes_sl: string[];
  includes_en: string[];
  image_url?: string;
  featured: boolean;
  order_index: number;
  published: boolean;
}

export interface GalleryImage {
  id: string;
  created_at: string;
  url: string;
  title_sl?: string;
  title_en?: string;
  category?: string;
  order_index: number;
  published: boolean;
}

// API functions
export async function createBooking(
  booking: Omit<Booking, 'id' | 'created_at' | 'status' | 'updated_at'>
): Promise<Booking> {
  const { data, error } = await supabase
    .from('bookings')
    .insert([{ ...booking, status: 'pending' }])
    .select()
    .single();

  if (error) throw error;
  return data as Booking;
}

export async function createContactMessage(
  message: Omit<ContactMessage, 'id' | 'created_at' | 'status' | 'updated_at'>
): Promise<ContactMessage> {
  const { data, error } = await supabase
    .from('contact_messages')
    .insert([{ ...message, status: 'new' }])
    .select()
    .single();

  if (error) throw error;
  return data as ContactMessage;
}

export async function getAvailableDates(month: number, year: number) {
  // month is 1-12
  const start = startOfMonth(new Date(year, month - 1, 1));
  const end = startOfMonth(addMonths(start, 1));
  const startStr = format(start, 'yyyy-MM-dd');
  const endStr = format(end, 'yyyy-MM-dd');

  const { data, error } = await supabase
    .from('bookings')
    .select('event_date')
    .eq('status', 'confirmed')
    .gte('event_date', startStr)
    .lt('event_date', endStr);

  if (error) throw error;
  return (data || []).map((b: { event_date: string }) => {
    const [yy, mm, dd] = b.event_date.split('-').map((v) => parseInt(v, 10));
    return new Date(yy, (mm || 1) - 1, dd || 1);
  });
}

// Admin and listing helpers
export async function fetchBookings(params?: {
  status?: Booking['status'] | 'all';
  page?: number;
  pageSize?: number;
}) {
  const status = params?.status ?? 'all';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('bookings')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Booking[];
}

export async function updateBookingStatus(id: string, status: Booking['status']) {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Booking;
}

export async function fetchContactMessages(params?: {
  status?: ContactMessage['status'] | 'all';
  page?: number;
  pageSize?: number;
}) {
  const status = params?.status ?? 'all';
  const page = params?.page ?? 1;
  const pageSize = params?.pageSize ?? 10;
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })
    .range(from, to);

  if (status !== 'all') {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as ContactMessage[];
}

export async function updateContactMessage(
  id: string,
  updates: Partial<Pick<ContactMessage, 'status' | 'reply'>>
) {
  const { data, error } = await supabase
    .from('contact_messages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as ContactMessage;
}

// Services (public)
export async function getPublicServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as Service[];
}

// Services (admin)
export async function adminFetchServices(params?: { includeUnpublished?: boolean }) {
  const includeUnpublished = params?.includeUnpublished ?? true;
  let q = supabase.from('services').select('*').order('order_index', { ascending: true });
  if (!includeUnpublished) q = q.eq('published', true);
  const { data, error } = await q;
  if (error) throw error;
  return (data || []) as Service[];
}

export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at' | 'order_index'> & { order_index?: number }): Promise<Service> {
  const { data, error } = await supabase
    .from('services')
    .insert([{ ...service }])
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

export async function updateService(id: string, updates: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
}

export async function updateServiceOrder(id: string, order_index: number) {
  const { data, error } = await supabase
    .from('services')
    .update({ order_index })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Service;
}

// Media
export async function fetchMedia(): Promise<MediaItem[]> {
  const { data, error } = await supabase
    .from('media_items')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as MediaItem[];
}

export async function createMedia(url: string, title?: string, tags?: string[]) {
  const { data, error } = await supabase
    .from('media_items')
    .insert([{ url, title: title || null, tags: tags || [] }])
    .select()
    .single();
  if (error) throw error;
  return data as MediaItem;
}

export async function deleteMedia(id: string) {
  const { error } = await supabase.from('media_items').delete().eq('id', id);
  if (error) throw error;
}

export async function updateMediaOrder(id: string, order_index: number) {
  const { data, error } = await supabase
    .from('media_items')
    .update({ order_index })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as MediaItem;
}

// Content Blocks (hero, about, venue, footer, etc.)
export async function getContentBlock(section: string, lang: 'sl' | 'en'): Promise<ContentBlock | null> {
  const { data, error } = await supabase
    .from('content_blocks')
    .select('*')
    .eq('section', section)
    .eq('lang', lang)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // PGRST116 is "not found"
  return data as ContentBlock | null;
}

export async function upsertContentBlock(section: string, lang: 'sl' | 'en', data: Record<string, any>) {
  const { data: result, error } = await supabase
    .from('content_blocks')
    .upsert({ section, lang, data }, { onConflict: 'section,lang' })
    .select()
    .single();
  if (error) throw error;
  return result as ContentBlock;
}

// Events
export async function getPublicEvents(): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as Event[];
}

export async function adminFetchEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as Event[];
}

export async function createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select()
    .single();
  if (error) throw error;
  return data as Event;
}

export async function updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Event;
}

export async function deleteEvent(id: string) {
  const { error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
}

// Accommodation Units
export async function getPublicAccommodation(): Promise<AccommodationUnit[]> {
  const { data, error } = await supabase
    .from('accommodation_units')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as AccommodationUnit[];
}

export async function adminFetchAccommodation() {
  const { data, error } = await supabase
    .from('accommodation_units')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as AccommodationUnit[];
}

export async function createAccommodation(unit: Omit<AccommodationUnit, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('accommodation_units')
    .insert([unit])
    .select()
    .single();
  if (error) throw error;
  return data as AccommodationUnit;
}

export async function updateAccommodation(id: string, updates: Partial<Omit<AccommodationUnit, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('accommodation_units')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as AccommodationUnit;
}

export async function deleteAccommodation(id: string) {
  const { error } = await supabase.from('accommodation_units').delete().eq('id', id);
  if (error) throw error;
}

// Packages
export async function getPublicPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as Package[];
}

export async function adminFetchPackages() {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as Package[];
}

export async function createPackage(pkg: Omit<Package, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('packages')
    .insert([pkg])
    .select()
    .single();
  if (error) throw error;
  return data as Package;
}

export async function updatePackage(id: string, updates: Partial<Omit<Package, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('packages')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Package;
}

export async function deletePackage(id: string) {
  const { error } = await supabase.from('packages').delete().eq('id', id);
  if (error) throw error;
}

// Gallery
export async function getPublicGallery(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('published', true)
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as GalleryImage[];
}

export async function adminFetchGallery() {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('order_index', { ascending: true });
  if (error) throw error;
  return (data || []) as GalleryImage[];
}

export async function createGalleryImage(img: Omit<GalleryImage, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .insert([img])
    .select()
    .single();
  if (error) throw error;
  return data as GalleryImage;
}

export async function updateGalleryImage(id: string, updates: Partial<Omit<GalleryImage, 'id' | 'created_at'>>) {
  const { data, error } = await supabase
    .from('gallery_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as GalleryImage;
}

export async function deleteGalleryImage(id: string) {
  const { error } = await supabase.from('gallery_images').delete().eq('id', id);
  if (error) throw error;
}
