import { createClient } from '@supabase/supabase-js';

export const DEFAULTS = {
  name: 'Danyal Autos',
  tagline: 'Honda, Highspeed, Unique and electric scooters. Cash or easy installments.',
  phone: '0300 0000000', whatsapp: '923000000000',
  address: 'Main Road, Mardan, Khyber Pakhtunkhwa, Pakistan', hours: 'Mon to Sat, 9:00 am to 8:00 pm',
  facebook: '', instagram: '', tiktok: '', youtube: '', map: '', logo: '',
  about: 'Danyal Autos has been selling motorcycles in Mardan since 2016. We stock Honda, Highspeed and Unique motorcycles and electric scooters, with cash and installment options.\n\nVisit the showroom, test ride before you decide, and ask us about spare parts and accessories.',
  markup: '20', min_advance: '15', durations: '6,12,18,24',
};

let client;
export function sb() {
  if (!client) {
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) throw new Error('SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are not set.');
    client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
      // never cache: admin changes must show up immediately
      global: { fetch: (u, o) => fetch(u, { ...o, cache: 'no-store' }) },
    });
  }
  return client;
}

// True when the database credentials are missing, so pages can show a friendly
// "not connected yet" state instead of a 500.
export const dbReady = () => !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);

export async function getSettings() {
  if (!dbReady()) return { ...DEFAULTS };
  const { data, error } = await sb().from('settings').select('k,v');
  if (error) throw new Error(error.message);
  const s = { ...DEFAULTS };
  for (const r of data || []) if (r.v !== null) s[r.k] = r.v;
  return s;
}

export async function list(table, { order = 'id', asc = false, limit, eq } = {}) {
  if (!dbReady()) return [];
  let q = sb().from(table).select('*').order(order, { ascending: asc });
  if (eq) for (const [k, v] of Object.entries(eq)) q = q.eq(k, v);
  if (limit) q = q.limit(limit);
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data || [];
}
