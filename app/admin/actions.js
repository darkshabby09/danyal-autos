'use server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import crypto from 'crypto';
import { sb } from '@/lib/db';
import { COOKIE, isAdmin, makeToken, passwordOk } from '@/lib/auth';
import { SETTINGS, TABS } from '@/lib/admin-config';

const back = (s, msg) => redirect(`/admin?s=${s}&msg=${encodeURIComponent(msg)}`);
const guard = () => { if (!isAdmin()) redirect('/admin'); };

export async function login(fd) {
  if (!passwordOk(fd.get('pw'))) { await new Promise((r) => setTimeout(r, 800)); redirect('/admin?err=1'); }
  cookies().set(COOKIE, makeToken(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 7 });
  redirect('/admin');
}

export async function logout() {
  cookies().delete(COOKIE);
  redirect('/admin');
}

// Uploads one photo (already resized in the browser) to Supabase Storage. Returns the stored file name.
async function put(file) {
  if (!file || typeof file === 'string' || !file.size) return null;
  const ext = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[file.type];
  if (!ext || file.size > 4 * 1024 * 1024) return null;
  const name = `${crypto.randomUUID()}.${ext}`;
  const { error } = await sb().storage.from('images').upload(name, Buffer.from(await file.arrayBuffer()), { contentType: file.type });
  if (error) throw new Error('Photo upload failed: ' + error.message);
  return name;
}
const drop = async (f) => { if (f) await sb().storage.from('images').remove([f]); };

export async function save(fd) {
  guard();
  const s = String(fd.get('s'));
  const tab = TABS[s];
  if (!tab) return back('stock', 'Unknown section');
  const id = parseInt(fd.get('id'), 10) || 0;
  const vals = {};
  let old = null;
  if (id) old = (await sb().from(s).select('*').eq('id', id).maybeSingle()).data;
  for (const f of tab.fields) {
    if (f.type === 'file') {
      const n = await put(fd.get(f.k));
      if (n) { vals[f.k] = n; if (old?.[f.k]) await drop(old[f.k]); }
    } else if (f.type === 'cat') vals[f.k] = parseInt(fd.get(f.k), 10) || null;
    else vals[f.k] = String(fd.get(f.k) ?? '').trim();
  }
  const { error } = id ? await sb().from(s).update(vals).eq('id', id) : await sb().from(s).insert(vals);
  if (error) return back(s, 'Error: ' + error.message);
  back(s, id ? 'Changes saved.' : 'Added.');
}

export async function remove(fd) {
  guard();
  const s = String(fd.get('s')), id = parseInt(fd.get('id'), 10) || 0;
  if (!TABS[s] || !id) return back('stock', 'Nothing deleted');
  const { data: r } = await sb().from(s).select('*').eq('id', id).maybeSingle();
  await drop(r?.image); await drop(r?.logo);
  await sb().from(s).delete().eq('id', id);
  back(s, 'Deleted.');
}

export async function saveSettings(fd) {
  guard();
  const db = sb();
  const { data: cur } = await db.from('settings').select('k,v');
  const now = Object.fromEntries((cur || []).map((r) => [r.k, r.v]));
  const rows = Object.keys(SETTINGS).map((k) => ({ k, v: String(fd.get(k) ?? '').trim() }));
  const logo = await put(fd.get('logo'));
  if (logo) { await drop(now.logo); rows.push({ k: 'logo', v: logo }); }
  else if (fd.get('rmlogo')) { await drop(now.logo); rows.push({ k: 'logo', v: '' }); }
  const { error } = await db.from('settings').upsert(rows, { onConflict: 'k' });
  if (error) return back('settings', 'Error: ' + error.message);
  const { data: cats } = await db.from('categories').select('id,logo');
  for (const c of cats || []) {
    const n = await put(fd.get('catlogo_' + c.id));
    if (n) { await drop(c.logo); await db.from('categories').update({ logo: n }).eq('id', c.id); }
  }
  back('settings', 'Saved.');
}
