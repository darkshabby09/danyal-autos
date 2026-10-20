import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CfgProvider } from '@/components/Emi';
import { dbReady, getSettings } from '@/lib/db';
import { emiCfg, imgUrl, waLink } from '@/lib/utils';

export default async function SiteLayout({ children }) {
  const s = await getSettings();
  const cfg = emiCfg(s);
  return (
    <CfgProvider value={cfg}>
      <Header name={s.name} logo={imgUrl(s.logo)} />
      <main>
        {!dbReady() && (
          <div className="wrap" style={{ paddingBottom: 0 }}>
            <p className="notice">
              The showroom database is not connected yet, so bikes and photos cannot be shown.
              Add the Supabase keys in the environment variables to see the full showroom.
            </p>
          </div>
        )}
        {children}
      </main>
      <Footer name={s.name} address={s.address} phone={s.phone} />
      <a className="fab" href={waLink(cfg.wa, `Hello ${s.name}`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </CfgProvider>
  );
}
