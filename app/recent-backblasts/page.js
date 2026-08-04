import Link from 'next/link';
import { getRecapsWithNames } from '../../lib/data';
import RecapCard from '../../components/RecapCard';

export const dynamic = 'force-dynamic';

export default async function RecentBackblasts() {
  const { recaps, peopleMap } = await getRecapsWithNames();
  const recent = recaps.slice(0, 10);

  return (
    <main className="container">
      <h1>Recent Backblasts</h1>

      {recent.length === 0 && <p>No recaps posted yet.</p>}

      {recent.map((r) => (
        <RecapCard key={r.id} recap={r} peopleMap={peopleMap} />
      ))}

      {recaps.length > 10 && (
        <p className="archive-link">
          <Link href="/backblast-archive">View Archived Backblasts →</Link>
        </p>
      )}
    </main>
  );
}
