import { getRecapsWithNames } from '../../lib/data';

export const dynamic = 'force-dynamic';

// Strips a trailing "(Real Name)" so only the F3 nickname shows.
function nickname(name) {
  if (!name) return name;
  return name.replace(/\s*\([^)]*\)\s*$/, '');
}

export default async function Scorecard() {
  const { recaps, people } = await getRecapsWithNames();

  const stats = {};
  people.forEach((p) => {
    // Start from each pax's carried-over totals (posts/Qs logged before this
    // site existed), then add on whatever's tallied from recaps below.
    stats[p.id] = {
      name: p.name,
      attendance: p.previous_posts || 0,
      qCount: p.previous_qs || 0,
    };
  });

  recaps.forEach((r) => {
    const attendees = new Set();
    if (r.q_id) attendees.add(r.q_id);
    (r.pax_ids || []).forEach((id) => attendees.add(id));
    attendees.forEach((id) => {
      if (stats[id]) stats[id].attendance += 1;
    });
    if (r.q_id && stats[r.q_id]) stats[r.q_id].qCount += 1;
  });

  const rows = Object.values(stats).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <main className="container">
      <h1>Posts &amp; Qs Scorecard</h1>

      {rows.length === 0 ? (
        <p>No one in the system yet.</p>
      ) : (
        <table className="scorecard">
          <thead>
            <tr>
              <th>Name</th>
              <th>Posts</th>
              <th>Q Count</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.name}>
                <td>{nickname(r.name)}</td>
                <td>{r.attendance}</td>
                <td>{r.qCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
