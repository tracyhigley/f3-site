function Section({ label, text }) {
  if (!text) return null;
  return (
    <div className="section">
      <h3>{label}</h3>
      <p>{text}</p>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${month}-${day}-${year}`;
}

// Strips a trailing "(Real Name)" so only the F3 nickname shows.
function nickname(name) {
  if (!name) return name;
  return name.replace(/\s*\([^)]*\)\s*$/, '');
}

export default function RecapCard({ recap: r, peopleMap }) {
  return (
    <article className="card">
      <h2>{r.title}</h2>
      <p className="meta">
        {formatDate(r.date)} · Q: {nickname(peopleMap[r.q_id]) || 'Unknown'}
      </p>

      {r.photo_url && <img className="photo" src={r.photo_url} alt={r.title} />}

      <p>
        <strong>PAX:</strong>{' '}
        {(r.pax_ids || [])
          .map((id) => peopleMap[id])
          .filter(Boolean)
          .join(', ') || '—'}
      </p>

      {r.fngs && (
        <p>
          <strong>FNGs:</strong> {r.fngs}
        </p>
      )}

      <Section label="Quick description of the beatdown, or a fun story or comment" text={r.intro} />
      <h3 className="beatdown-heading">Beatdown</h3>
      <Section label="Warmup" text={r.warmup} />
      <Section label="The Thang" text={r.thang} />
      <Section label="Mary" text={r.mary} />
      <Section label="Announcements" text={r.announcements} />
      <Section label="COT" text={r.cot} />
    </article>
  );
}
