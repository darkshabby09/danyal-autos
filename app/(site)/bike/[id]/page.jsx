import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Img } from '@/components/Card';
import { Calculator } from '@/components/Emi';
import { dbReady, getSettings, sb } from '@/lib/db';
import { num, waLink } from '@/lib/utils';

export async function generateMetadata({ params }) {
  if (!dbReady()) return {};
  const { data } = await sb().from('stock').select('title,details').eq('id', parseInt(params.id, 10) || 0).maybeSingle();
  return data ? { title: data.title, description: (data.details || '').slice(0, 150) } : {};
}

export default async function Bike({ params }) {
  const id = parseInt(params.id, 10);
  if (!id) notFound();
  if (!dbReady()) notFound();
  const { data: r } = await sb().from('stock').select('*').eq('id', id).maybeSingle();
  if (!r) notFound();
  const [s, { data: cat }] = await Promise.all([getSettings(), sb().from('categories').select('name').eq('id', r.category_id || 0).maybeSingle()]);
  const n = num(r.price), sold = r.status === 'Sold', inst = r.installment !== 'No' && n > 0;
  return (
    <section className="wrap two bike">
      <div className={'ph big' + (sold ? ' sold' : '')}><Img f={r.image} alt={r.title} /></div>
      <div>
        <p className="meta">{r.category_id ? <Link href={`/stock?cat=${r.category_id}`}>{cat?.name || 'Stock'}</Link> : 'Stock'}{r.year && ` · Model ${r.year}`}</p>
        <h1>{r.title}</h1>
        {sold ? (
          <p className="notice">This one is sold. <Link href="/stock">See what is in stock</Link></p>
        ) : (
          <>
            <div className="p-cash">
              <span className="plate xl">Rs {r.price}</span>
              <p className="meta">Cash price</p>
              <a className="btn wa" href={waLink(s.whatsapp, `Hello ${s.name}, I want to buy on cash: ${r.title} (Rs ${r.price})`)} target="_blank" rel="noopener noreferrer">Order on WhatsApp</a>
            </div>
            <div className="p-inst">
              {inst ? <Calculator price={n} title={r.title} /> : <p className="notice">This bike is for cash purchase only.</p>}
            </div>
          </>
        )}
        {r.details && <div className="body"><h3>Details</h3><p style={{ whiteSpace: 'pre-line' }}>{r.details}</p></div>}
      </div>
    </section>
  );
}
