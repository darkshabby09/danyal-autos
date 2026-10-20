import Link from 'next/link';
import Card from '@/components/Card';
import { getSettings, list } from '@/lib/db';
import { imgUrl, waLink } from '@/lib/utils';

export default async function Home() {
  const [s, cats, stock] = await Promise.all([getSettings(), list('categories', { asc: true }), list('stock', { eq: { status: 'Available' } })]);
  const wa = s.whatsapp;
  return (
    <>
      <section className="hero">
        <div>
          <h1>Your next ride, picked in person in Mardan.</h1>
          <p className="lead">{s.tagline}</p>
          <div className="row">
            <Link className="btn" href="/stock">See bikes in stock</Link>
            <a className="btn ghost" href={waLink(wa, `Hello ${s.name}, I want to know about installment plans.`)} target="_blank" rel="noopener noreferrer">Ask about installments</a>
          </div>
        </div>
        <div className="plateart" aria-hidden="true"><small>MARDAN · KPK</small><b>{s.name.toUpperCase()}</b><small>Since 2016</small></div>
      </section>
      <section className="wrap">
        <h2>Browse by type</h2>
        <div className="cats">
          {cats.map((c) => (
            <Link key={c.id} className="cat" href={`/stock?cat=${c.id}`}>
              {c.logo && <img className="clogo" src={imgUrl(c.logo)} alt="" />}
              <b>{c.name}</b><span>{stock.filter((x) => x.category_id === c.id).length} available</span>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap">
        <h2>Just arrived</h2>
        <div className="grid">{stock.slice(0, 6).map((r) => <Card key={r.id} r={r} kind="stock" name={s.name} wa={wa} />)}</div>
        {!stock.length && <p className="empty">Bikes will appear here once you add them from the admin panel.</p>}
      </section>
    </>
  );
}
