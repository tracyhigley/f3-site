import Link from 'next/link';
import { getRecapsWithNames } from '../../lib/data';
import RecapCard from '../../components/RecapCard';

export const dynamic = 'force-dynamic';

export default async function BackblastArchive() {
  const { recaps, peopleMap } = await getRecapsWithNames();
  const older = recaps.slice(10);

  return (
    <main className="container">
      <p className="page-eyebrow">The Grill</p>
      <h1 className="page-title">Backblast Archive</h1>

      <form action="/search" method="get" className="search-form">
        <input type="search" name="q" placeholder="Search all backblasts..." />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {older.length === 0 && (
        <p className="empty-state">
          No older backblasts yet — check <Link href="/recent-backblasts">Recent Backblasts</Link> for the latest ones.
        </p>
      )}

      {older.map((r) => (
        <RecapCard key={r.id} recap={r} peopleMap={peopleMap} />
      ))}
    </main>
  );
}
