import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'F3 Hamburg – The Grill',
  description: 'Weekly workout recaps for F3 Hamburg – The Grill',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <nav className="nav">
          <div className="nav-inner">
            <Link href="/" className="nav-brand">
              <img src="/logo.webp" alt="F3 Hamburg – The Grill" className="nav-logo" />
            </Link>
            <div className="nav-links">
              <Link href="/">Home</Link>
              <Link href="/recent-backblasts">Recent Backblasts</Link>
              <Link href="/backblast-archive">Archived Backblasts</Link>
              <Link href="/scorecard">Posts &amp; Qs Scorecard</Link>
              <Link href="/submit">Submit a Backblast</Link>
              <Link href="/fire">Fire</Link>
              <Link href="/about">About</Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
