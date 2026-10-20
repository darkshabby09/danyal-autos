import Link from 'next/link';
import { EmiFrom } from './Emi';
import { imgUrl, num, waLink } from '@/lib/utils';

export function Img({ f, alt }) {
  const u = imgUrl(f);
  return u ? <img src={u} alt={alt} loading="lazy" /> : <div className="noimg">{(alt || '?')[0]}</div>;
}

export default function Card({ r, kind, name, wa }) {
  const sold = r.status === 'Sold' || r.status === 'Out of stock';
  const st = kind === 'stock';
  const href = `/bike/${r.id}`;
  const n = num(r.price);
  return (
    <article className={'card' + (sold ? ' sold' : '')}>
      <div className="ph">
        {st ? <Link href={href}><Img f={r.image} alt={r.title} /></Link> : <Img f={r.image} alt={r.title} />}
        {sold && <span className="tag">{r.status}</span>}
      </div>
      <div className="cb">
        <h3>{st ? <Link href={href}>{r.title}</Link> : r.title}</h3>
        {r.price && (st ? (
          <>
            <span className="plate p-cash">Rs {r.price}</span>
            {r.installment !== 'No' && n ? <span className="plate inst p-inst"><EmiFrom price={n} /></span> : <span className="plate p-inst off">Cash only</span>}
          </>
        ) : <span className="plate">Rs {r.price}</span>)}
        {r.year && <p className="meta">Model {r.year}</p>}
        {r.details && <p style={{ whiteSpace: 'pre-line' }}>{st ? r.details.slice(0, 90) : r.details}</p>}
        <div className="btns">
          {st && <Link className="btn ghost sm" href={href}>Details</Link>}
          {!sold && <a className="btn wa" href={waLink(wa, `Hello ${name}, I am interested in: ${r.title}`)} target="_blank" rel="noopener noreferrer">Ask on WhatsApp</a>}
        </div>
      </div>
    </article>
  );
}
