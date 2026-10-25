import Link from 'next/link';
import './globals.css';

export const metadata = {
  metadataBase: new URL('https://www.f3thegrill.com'),
  title: 'F3 Hamburg – The Grill',
  description: 'Weekly workout recaps for F3 Hamburg – The Grill',
  openGraph: {
    title: 'F3 Hamburg – The Grill',
    description: 'Weekly workout recaps for F3 Hamburg – The Grill',
    siteName: 'F3 Hamburg – The Grill',
    type: 'website',
    images: [{ url: '/og-default.jpg', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-default.jpg'] },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="nav-brand">
              <img src="https://niuixeomaexekptkamcn.supabase.co/storage/v1/object/public/recap-photos/site/logo-v3.webp" alt="F3 Hamburg – The Grill" className="nav-logo" />
            </Link>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/recent-backblasts">Recent Backblasts</Link>
              <Link href="/backblast-archive">Archived Backblasts</Link>
              <Link href="/scorecard">Posts &amp; Qs Scorecard</Link>
              <Link href="/submit">Submit a Backblast</Link>
              <Link href="/fire">Fire</Link>
              <Link href="/calendar">Calendar</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
