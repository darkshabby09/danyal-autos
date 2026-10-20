import Link from 'next/link';
import Card from '@/components/Card';
import { getSettings, list } from '@/lib/db';
import { imgUrl } from '@/lib/utils';

export const metadata = { title: 'Stock' };

export default async function Stock({ searchParams }) {
  const cid = parseInt(searchParams.cat, 10) || 0;
  const [s, cats, all] = await Promise.all([getSettings(), list('categories', { asc: true }), list('stock')]);
  const rows = (cid ? all.filter((r) => r.category_id === cid) : all).sort((a, b) => (a.status === 'Sold') - (b.status === 'Sold'));
  return (
    <section className="wrap">
      <h1>Motorcycles & scooters in stock</h1>
      <div className="tabs">
        <Link href="/stock" className={!cid ? 'on' : ''}>All</Link>
        {cats.map((c) => (
          <Link key={c.id} href={`/stock?cat=${c.id}`} className={cid === c.id ? 'on' : ''}>
            {c.logo && <img className="clogo" src={imgUrl(c.logo)} alt="" />}{c.name}
          </Link>
        ))}
      </div>
      <div className="grid">
        {rows.map((r) => <Card key={r.id} r={r} kind="stock" name={s.name} wa={s.whatsapp} />)}
        {!rows.length && <p className="empty">Nothing listed here yet. Check back soon or message us on WhatsApp.</p>}
      </div>
    </section>
  );
}
