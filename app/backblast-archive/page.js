import { getRecapsWithNames } from '../../lib/data';
import RecapCard from '../../components/RecapCard';

export const dynamic = 'force-dynamic';

export default async function BackblastArchive() {
  const { recaps, peopleMap } = await getRecapsWithNames();
  const older = recaps.slice(10);

  return (
    <main className="container">
      <h1>Backblast Archive</h1>

      {older.length === 0 && <p>No older backblasts yet — check the home page for the latest ones.</p>}

      {older.map((r) => (
        <RecapCard key={r.id} recap={r} peopleMap={peopleMap} />
      ))}
    </main>
  );
}
