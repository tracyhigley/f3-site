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
  const paxNames = (r.pax_ids || []).map((id) => peopleMap[id]).filter(Boolean);

  return (
    <article className="card">
      <h2>{r.title}</h2>
      <p className="meta">
        {formatDate(r.date)}
        <span className="meta-dot">•</span>
        Q <span className="q-badge">{nickname(peopleMap[r.q_id]) || 'Unknown'}</span>
      </p>

      {r.photo_url && <img className="photo" src={r.photo_url} alt={r.title} />}

      <p className="pax-label">PAX</p>
      <div className="pax-list">
        {paxNames.length > 0 ? (
          paxNames.map((name, i) => (
            <span className="pax-pill" key={`${name}-${i}`}>{nickname(name)}</span>
          ))
        ) : (
          <span className="pax-pill">—</span>
        )}
      </div>

      {r.fngs && (
        <p>
          <strong>FNGs:</strong> {r.fngs}
        </p>
      )}

{r.intro && <p className="intro-text">{r.intro}</p>}      <h3 className="beatdown-heading">Beatdown</h3>
      <Section label="Warmup" text={r.warmup} />
      <Section label="The Thang" text={r.thang} />
      <Section label="Mary" text={r.mary} />
      <Section label="Announcements" text={r.announcements} />
      <Section label="COT" text={r.cot} />
    </article>
  );
}
