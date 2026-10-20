import Card from '@/components/Card';
import { getSettings, list } from '@/lib/db';

export const metadata = { title: 'Accessories & spare parts' };

export default async function Accessories() {
  const [s, all] = await Promise.all([getSettings(), list('accessories')]);
  const rows = all.sort((a, b) => (a.status === 'Out of stock') - (b.status === 'Out of stock'));
  return (
    <section className="wrap">
      <h1>Motorcycle accessories & spare parts</h1>
      <div className="grid">
        {rows.map((r) => <Card key={r.id} r={r} kind="acc" name={s.name} wa={s.whatsapp} />)}
        {!rows.length && <p className="empty">Parts are being added. Message us on WhatsApp for what you need.</p>}
      </div>
    </section>
  );
}
