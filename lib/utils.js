// Public site URL: set NEXT_PUBLIC_SITE_URL once you have a domain, otherwise use Vercel's
// production domain. VERCEL_URL is the per-deployment hash URL, so it is only a last resort.
export const siteUrl = () => {
  const u =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
  return u.replace(/\/$/, '');
};
export const num = (s) => parseInt(String(s || '').replace(/\D/g, ''), 10) || 0;
export const fmt = (n) => 'Rs ' + Math.round(n).toLocaleString('en-US');
export const imgUrl = (f) => (f ? `${process.env.SUPABASE_URL}/storage/v1/object/public/images/${f}` : null);
export const waLink = (wa, msg) => `https://wa.me/${String(wa).replace(/\D/g, '')}?text=${encodeURIComponent(msg)}`;
export const safeUrl = (u) => (/^https?:\/\//i.test(u || '') ? u : null);
export function emiCfg(s) {
  const dur = [...new Set(String(s.durations).split(',').map((x) => parseInt(x, 10)).filter((x) => x > 0))].sort((a, b) => a - b);
  return { rate: parseFloat(s.markup) || 0, adv: Math.max(0, Math.min(80, parseInt(s.min_advance, 10) || 0)), dur: dur.length ? dur : [6, 12, 18, 24], wa: String(s.whatsapp).replace(/\D/g, '') };
}
export function calc(price, adv, mo, rate) {
  const a = (price * adv) / 100, f = price - a, t = f + (f * rate * mo) / 1200;
  return { a, m: t / mo, t: t + a };
}
