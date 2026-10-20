import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { DEFAULTS, getSettings } from '@/lib/db';
import { imgUrl } from '@/lib/utils';

export const metadata = { title: 'Page not found' };

export default async function NotFound() {
  // The 404 page can be hit when the database is unreachable, so fall back to defaults.
  let s = DEFAULTS;
  try { s = await getSettings(); } catch {}
  return (
    <>
      <Header name={s.name} logo={imgUrl(s.logo)} />
      <main>
        <section className="wrap">
          <h1>Page not found</h1>
          <p className="lead">That page does not exist, or the bike may have been removed. The rest of the showroom is still open.</p>
          <div className="row">
            <Link className="btn" href="/">Back to home</Link>
            <Link className="btn ghost" href="/stock">See bikes in stock</Link>
          </div>
        </section>
      </main>
      <Footer name={s.name} address={s.address} phone={s.phone} />
    </>
  );
}
