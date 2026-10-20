'use client';
import { createContext, useContext, useState } from 'react';
import { calc, fmt, waLink } from '@/lib/utils';

const Cfg = createContext({ rate: 0, adv: 15, dur: [6, 12, 18, 24], wa: '' });
export function CfgProvider({ value, children }) { return <Cfg.Provider value={value}>{children}</Cfg.Provider>; }

// "EMI from Rs X/mo" shown on cards in Installments mode
export function EmiFrom({ price }) {
  const c = useContext(Cfg);
  const r = calc(price, c.adv, c.dur[c.dur.length - 1], c.rate);
  return <><small>EMI from</small> {fmt(r.m)}/mo</>;
}

export function Calculator({ price, title }) {
  const c = useContext(Cfg);
  const [adv, setAdv] = useState(c.adv);
  const [mo, setMo] = useState(c.dur[Math.min(1, c.dur.length - 1)]);
  const r = calc(price, adv, mo, c.rate);
  const presets = [...new Set([c.adv, 30, 45, 60, 75])].filter((v) => v >= c.adv);
  const msg = `Hello, I want ${title} on installments. Advance ${adv}% (${fmt(r.a)}), ${mo} months, monthly about ${fmt(r.m)}.`;
  return (
    <div className="emi">
      <h3>Installment calculator</h3>
      <div className="lbl">Advance payment <b>{adv}%</b></div>
      <div className="chips">
        {presets.map((v) => <button key={v} type="button" className={v === adv ? 'on' : ''} onClick={() => setAdv(v)}>{v}%</button>)}
      </div>
      <input type="range" min={c.adv} max={Math.max(c.adv, 80)} step={5} value={adv} onChange={(e) => setAdv(+e.target.value)} aria-label="Advance percent" />
      <div className="lbl">Duration</div>
      <div className="chips">
        {c.dur.map((v) => <button key={v} type="button" className={v === mo ? 'on' : ''} onClick={() => setMo(v)}>{v} months</button>)}
      </div>
      <div className="res">
        <div>You pay upfront<b>{fmt(r.a)}</b></div>
        <div className="big">Monthly installment<b>{fmt(r.m)}</b></div>
        <div>Total on installment<b>{fmt(r.t)}</b></div>
      </div>
      <a className="btn wa" href={waLink(c.wa, msg)} target="_blank" rel="noopener noreferrer">Apply on WhatsApp</a>
      <p className="meta">Estimate only. Final terms are confirmed at the showroom.</p>
    </div>
  );
}
