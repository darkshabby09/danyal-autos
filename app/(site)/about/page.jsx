import { getSettings, list } from '@/lib/db';
import { imgUrl, safeUrl, waLink } from '@/lib/utils';

export const metadata = { title: 'About & contact' };

export default async function About() {
  const [s, gallery] = await Promise.all([getSettings(), list('gallery')]);
  const map = (s.map || '').startsWith('https://www.google.com/maps') ? s.map : null;
  const socials = [['facebook', 'Facebook'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['youtube', 'YouTube']].filter(([k]) => safeUrl(s[k]));
  return (
    <>
      <section className="wrap two">
        <div>
          <h1>About {s.name}</h1>
          <div className="body" style={{ whiteSpace: 'pre-line' }}>{s.about}</div>
        </div>
        <aside className="info">
          <h3>Visit or contact us</h3>
          <p><b>Address</b><br />{s.address}</p>
          <p><b>Hours</b><br />{s.hours}</p>
          <p><b>Phone</b><br /><a href={`tel:${s.phone}`}>{s.phone}</a></p>
          <a className="btn wa" href={waLink(s.whatsapp, `Hello ${s.name}`)} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
          <div className="soc">{socials.map(([k, l]) => <a key={k} href={s[k]} target="_blank" rel="noopener noreferrer">{l}</a>)}</div>
        </aside>
      </section>
      {gallery.length > 0 && (
        <section className="wrap">
          <h2>Our showroom and area</h2>
          <p className="lead">See the showroom and the area around it, so you can find us easily.</p>
          <div className="gal">
            {gallery.map((g) => (
              <a key={g.id} href={imgUrl(g.image)} target="_blank" rel="noopener noreferrer">
                <img src={imgUrl(g.image)} alt={g.title} loading="lazy" /><span>{g.title}</span>
              </a>
            ))}
          </div>
        </section>
      )}
      {map && <section className="wrap"><iframe className="map" src={map} loading="lazy" title="Map" /></section>}
    </>
  );
}
