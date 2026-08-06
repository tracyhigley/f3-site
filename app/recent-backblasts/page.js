import Link from 'next/link';
import { getRecapsWithNames } from '../../lib/data';
import RecapCard from '../../components/RecapCard';

export const dynamic = 'force-dynamic';

export default async function RecentBackblasts() {
  const { recaps, peopleMap } = await getRecapsWithNames();
  const recent = recaps.slice(0, 10);

  return (
    <main className="container">
      <p className="page-eyebrow">The Grill</p>
      <h1 className="page-title">Recent Backblasts</h1>

      {recent.length === 0 && (
        <p className="empty-state">
          No recaps posted yet. <Link href="/submit">Submit the first one →</Link>
        </p>
      )}

      {recent.map((r) => (
<RecapCard key={r.id} recap={r} peopleMap={peopleMap} editable />
        ))}

      {recaps.length > 10 && (
        <p className="archive-link">
          <Link href="/backblast-archive" className="btn btn-outline-dark">View Archived Backblasts</Link>
        </p>
      )}
    </main>
  );
}
