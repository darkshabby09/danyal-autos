import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { CfgProvider } from '@/components/Emi';
import { getSettings } from '@/lib/db';
import { emiCfg, imgUrl, waLink } from '@/lib/utils';

export default async function SiteLayout({ children }) {
  const s = await getSettings();
  const cfg = emiCfg(s);
  return (
    <CfgProvider value={cfg}>
      <Header name={s.name} logo={imgUrl(s.logo)} />
      <main>{children}</main>
      <Footer name={s.name} address={s.address} phone={s.phone} />
      <a className="fab" href={waLink(cfg.wa, `Hello ${s.name}`)} target="_blank" rel="noopener noreferrer">WhatsApp</a>
    </CfgProvider>
  );
}
