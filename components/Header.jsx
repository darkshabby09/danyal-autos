'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const NAV = [['/', 'Home'], ['/stock', 'Stock'], ['/accessories', 'Accessories'], ['/about', 'About & contact']];

export default function Header({ name, logo }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const on = (h) => (h === '/' ? path === '/' : path.startsWith(h) || (h === '/stock' && path.startsWith('/bike')));
  const mode = (m) => {
    document.documentElement.dataset.mode = m;
    try { localStorage.setItem('mode', m); } catch {}
  };
  return (
    <div className="sticky">
      <div className="modebar">
        <div className="seg">
          <button type="button" data-m="cash" onClick={() => mode('cash')}>Buy on Cash</button>
          <button type="button" data-m="inst" onClick={() => mode('inst')}>Buy on Installments</button>
        </div>
      </div>
      <header className="top">
        <Link className="brand" href="/">{logo && <img src={logo} alt="" />}<span>{name}</span></Link>
        <button type="button" className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}>Menu</button>
        <nav className={open ? 'open' : ''}>
          {NAV.map(([h, l]) => (
            <Link key={h} href={h} className={on(h) ? 'on' : ''} onClick={() => setOpen(false)}>{l}</Link>
          ))}
        </nav>
      </header>
    </div>
  );
}
