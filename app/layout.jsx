import './globals.css';
import { DEFAULTS, getSettings } from '@/lib/db';
import { imgUrl, siteUrl } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  // Metadata runs before the page, so a database outage must not take the site down.
  let s = DEFAULTS;
  try { s = await getSettings(); } catch {}
  const logo = imgUrl(s.logo);
  return {
    metadataBase: new URL(siteUrl()),
    title: { default: `${s.name} | Motorcycles & electric scooters`, template: `%s | ${s.name}` },
    description: s.tagline,
    openGraph: {
      type: 'website',
      siteName: s.name,
      title: `${s.name} | Motorcycles & electric scooters`,
      description: s.tagline,
      url: '/',
      locale: 'en_PK',
      images: logo ? [{ url: logo }] : undefined,
    },
    twitter: { card: logo ? 'summary' : 'summary_large_image', title: s.name, description: s.tagline },
  };
}

// Sets Cash / Installments mode before the page paints, so there is no flicker.
const modeScript = `try{document.documentElement.dataset.mode=localStorage.getItem("mode")==="inst"?"inst":"cash"}catch(e){}`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script dangerouslySetInnerHTML={{ __html: modeScript }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=Figtree:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  );
}
