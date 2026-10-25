import Link from 'next/link';
import { getRecapsWithNames } from '../../lib/data';

export const dynamic = 'force-dynamic';

const TEXT_FIELDS = [
  ['Intro', 'intro'],
  ['Warmup', 'warmup'],
  ['The Thang', 'thang'],
  ['Mary', 'mary'],
  ['Announcements', 'announcements'],
  ['COT', 'cot'],
  ['FNGs', 'fngs'],
];

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

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Finds the first text field containing the search term and returns a short
// excerpt around the match (with the matched word highlighted).
function findSnippet(recap, term) {
  for (const [label, field] of TEXT_FIELDS) {
    const text = recap[field];
    if (!text) continue;
    const idx = text.toLowerCase().indexOf(term);
    if (idx === -1) continue;

    const start = Math.max(0, idx - 60);
    const end = Math.min(text.length, idx + term.length + 60);
    const excerpt = `${start > 0 ? '…' : ''}${text.slice(start, end).trim()}${end < text.length ? '…' : ''}`;

    return { label, excerpt };
  }
  return null;
}

function highlight(text, term) {
  if (!term) return text;
  const parts = text.split(new RegExp(`(${escapeRegExp(term)})`, 'ig'));
  return parts.map((part, i) =>
    part.toLowerCase() === term ? (
      <mark key={i}>{part}</mark>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

function findMatch(recap, term, peopleMap) {
  const titleMatch = (recap.title || '').toLowerCase().includes(term);
  const snippet = findSnippet(recap, term);

  const qName = peopleMap[recap.q_id] || '';
  const paxNames = (recap.pax_ids || []).map((id) => peopleMap[id]).filter(Boolean);
  const nameMatch =
    qName.toLowerCase().includes(term) || paxNames.some((n) => n.toLowerCase().includes(term));

  if (!titleMatch && !snippet && !nameMatch) return null;
  return { snippet };
}

export default async function Search({ searchParams }) {
  const query = (searchParams?.q || '').trim();
  const term = query.toLowerCase();

  const { recaps, peopleMap } = term ? await getRecapsWithNames() : { recaps: [], peopleMap: {} };

  const results = term
    ? recaps
        .map((recap) => {
          const match = findMatch(recap, term, peopleMap);
          return match ? { recap, snippet: match.snippet } : null;
        })
        .filter(Boolean)
    : [];

  return (
    <main className="container">
      <p className="page-eyebrow">The Grill</p>
      <h1 className="page-title">Search Backblasts</h1>

      <form action="/search" method="get" className="search-form">
        <input type="search" name="q" placeholder="Search backblasts..." defaultValue={query} autoFocus />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>

      {!term && <p className="empty-state">Enter a word or phrase above to search every backblast.</p>}

      {term && results.length === 0 && (
        <p className="empty-state">No backblasts found for &ldquo;{query}&rdquo;.</p>
      )}

      {term && results.length > 0 && (
        <p className="search-result-count">
          {results.length} backblast{results.length === 1 ? '' : 's'} found
        </p>
      )}

      {results.map(({ recap, snippet }) => (
        <div key={recap.id} className="search-result">
          <Link href={`/backblast/${recap.id}`} className="search-result-title">
            {highlight(recap.title || 'Untitled', term)}
          </Link>
          <p className="search-result-meta">
            {formatDate(recap.date)}
            <span className="meta-dot">•</span>
            Q <span className="q-badge">{nickname(peopleMap[recap.q_id]) || 'Unknown'}</span>
          </p>
          {snippet && (
            <p className="search-result-snippet">
              <strong>{snippet.label}:</strong> {highlight(snippet.excerpt, term)}
            </p>
          )}
        </div>
      ))}
    </main>
  );
}
