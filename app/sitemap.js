import { list } from '@/lib/db';
import { siteUrl } from '@/lib/utils';

export default async function sitemap() {
  const base = siteUrl();
  const staticPages = ['', '/stock', '/accessories', '/about'].map((p) => ({
    url: `${base}${p}`,
    lastModified: new Date(),
    changeFrequency: p === '' || p === '/stock' ? 'daily' : 'monthly',
    priority: p === '' ? 1 : 0.8,
  }));
  // A database outage should still produce a valid sitemap for the static pages.
  let bikes = [];
  try {
    bikes = await list('stock', { eq: { status: 'Available' } });
  } catch {}
  return [
    ...staticPages,
    ...bikes.map((b) => ({ url: `${base}/bike/${b.id}`, lastModified: b.created ? new Date(b.created) : new Date(), changeFrequency: 'weekly', priority: 0.7 })),
  ];
}
