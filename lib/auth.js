import { cookies } from 'next/headers';
import crypto from 'crypto';

const token = () => crypto.createHmac('sha256', process.env.SESSION_SECRET || '').update('admin-session').digest('hex');
export const COOKIE = 'adm';
export function makeToken() { return token(); }
export function isAdmin() {
  if (!process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 16) return false;
  const c = cookies().get(COOKIE)?.value;
  if (!c) return false;
  const a = Buffer.from(c), b = Buffer.from(token());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
export function passwordOk(p) {
  const h = (x) => crypto.createHash('sha256').update(String(x)).digest();
  return !!process.env.ADMIN_PASSWORD && crypto.timingSafeEqual(h(p), h(process.env.ADMIN_PASSWORD));
}
