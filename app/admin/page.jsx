import Link from 'next/link';
import ImageField from '@/components/ImageField';
import ConfirmForm from '@/components/ConfirmForm';
import { isAdmin } from '@/lib/auth';
import { getSettings, list, sb } from '@/lib/db';
import { SETTINGS, TABS } from '@/lib/admin-config';
import { imgUrl } from '@/lib/utils';
import { login, logout, remove, save, saveSettings } from './actions';

export const metadata = { title: 'Admin', robots: { index: false, follow: false } };

export default async function Admin({ searchParams }) {
  if (!isAdmin()) {
    const bad = !process.env.ADMIN_PASSWORD || !process.env.SESSION_SECRET || process.env.SESSION_SECRET.length < 16;
    return (
      <div className="adm">
        <form className="login" action={login}>
          <h1>Admin login</h1>
          {searchParams.err && <p className="err">Wrong password.</p>}
          {bad && <p className="err">Set ADMIN_PASSWORD and SESSION_SECRET (16+ characters) in your environment variables first.</p>}
          <label>Password<input type="password" name="pw" autoFocus required /></label>
          <button className="btn">Log in</button>
        </form>
      </div>
    );
  }
  const s = searchParams.s === 'settings' || TABS[searchParams.s] ? searchParams.s : 'stock';
  const msg = searchParams.msg;
  const nav = (
    <div className="bar">
      <b>Admin</b>
      <span>
        {Object.entries(TABS).map(([k, t]) => <Link key={k} href={`/admin?s=${k}`} className={s === k ? 'on' : ''}>{t.label}</Link>)}
        <Link href="/admin?s=settings" className={s === 'settings' ? 'on' : ''}>Settings</Link>
        <Link href="/" target="_blank">View site</Link>
        <form action={logout} style={{ display: 'inline' }}><button className="btn ghost sm" style={{ color: 'inherit', borderColor: 'transparent' }}>Log out</button></form>
      </span>
    </div>
  );

  if (s === 'settings') {
    const [cur, cats] = await Promise.all([getSettings(), list('categories', { asc: true })]);
    return (
      <div className="adm">{nav}
        <div className="wrap">
          <h1>Settings</h1>
          {msg && <p className={msg.startsWith('Error') ? 'err' : 'ok'}>{msg}</p>}
          <form action={saveSettings} className="form">
            <h3>Logo</h3>
            <label>Business logo (PNG with transparent background looks best)<ImageField name="logo" logo /></label>
            {cur.logo && (
              <div className="crow"><img className="thumb logo" src={imgUrl(cur.logo)} alt="" />
                <label style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}><input type="checkbox" name="rmlogo" value="1" style={{ width: 'auto' }} /> Remove logo</label></div>
            )}
            <h3>Category logos</h3>
            {cats.map((c) => (
              <div className="crow" key={c.id}><b>{c.name}</b>{c.logo && <img className="thumb logo" src={imgUrl(c.logo)} alt="" />}
                <ImageField name={'catlogo_' + c.id} logo label={'Logo for ' + c.name} /></div>
            ))}
            <h3>Details</h3>
            {Object.entries(SETTINGS).map(([k, l]) => (
              <label key={k}>{l}{k === 'about' ? <textarea name={k} rows={6} defaultValue={cur[k]} /> : <input name={k} defaultValue={cur[k]} />}</label>
            ))}
            <p className="hint">To change the admin password, change ADMIN_PASSWORD in your Vercel environment variables and redeploy.</p>
            <button className="btn">Save settings</button>
          </form>
        </div>
      </div>
    );
  }

  const tab = TABS[s];
  const editId = parseInt(searchParams.edit, 10) || 0;
  const [rows, cats] = await Promise.all([list(s), list('categories', { asc: true })]);
  const cur = editId ? rows.find((r) => r.id === editId) : null;
  return (
    <div className="adm">{nav}
      <div className="wrap">
        <h1>{tab.label}</h1>
        {msg && <p className={msg.startsWith('Error') ? 'err' : 'ok'}>{msg}</p>}
        <form action={save} className="form" key={editId}>
          <h3>{cur ? 'Edit item' : 'Add new'}</h3>
          <input type="hidden" name="s" value={s} /><input type="hidden" name="id" value={cur?.id || 0} />
          {tab.fields.map((f) => (
            <label key={f.k}>{f.label}
              {f.type === 'text' && <input name={f.k} defaultValue={cur?.[f.k] ?? ''} required={f.req} />}
              {f.type === 'area' && <textarea name={f.k} rows={5} defaultValue={cur?.[f.k] ?? ''} />}
              {f.type === 'file' && <><ImageField name={f.k} required={f.req && !cur} />{cur?.[f.k] && <img className="thumb" src={imgUrl(cur[f.k])} alt="" />}</>}
              {f.type === 'cat' && <select name={f.k} defaultValue={cur?.[f.k] ?? ''}>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select>}
              {f.type === 'sel' && <select name={f.k} defaultValue={cur?.[f.k] ?? f.opts[0]}>{f.opts.map((o) => <option key={o}>{o}</option>)}</select>}
            </label>
          ))}
          <div><button className="btn">{cur ? 'Save changes' : 'Add'}</button>{cur && <> <Link className="btn ghost" href={`/admin?s=${s}`}>Cancel</Link></>}</div>
        </form>
        <table>
          <thead><tr><th>Item</th><th /></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>{r.image && <img className="thumb" src={imgUrl(r.image)} alt="" />} {r.title ?? r.name}{r.status && <small> ({r.status})</small>}</td>
                <td className="act">
                  <Link href={`/admin?s=${s}&edit=${r.id}`}>Edit</Link>
                  <ConfirmForm action={remove}><input type="hidden" name="s" value={s} /><input type="hidden" name="id" value={r.id} /><button>Delete</button></ConfirmForm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
