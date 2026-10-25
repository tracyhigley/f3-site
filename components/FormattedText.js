// Shows backblast text line by line so wrapped lines stay lined up:
// leading spaces/tabs indent the whole line, and a list marker
// (* - • · ◦ ▪ 1. a) and the bullets Apple Notes uses) gets a hanging indent.
// An indented line right after a bullet lines up with that bullet's text.
// Tabs or runs of spaces inside a line (from pasted Notes text) become one space.
const SPACE = '[ \\t\\u00a0\\u2000-\\u200a\\u202f\\u205f\\u3000]';
const LEAD_RE = new RegExp(`^${SPACE}*`);
const SYMBOL_MARKER_RE = new RegExp(`^([*•◦▪▫‣⁃○●■□·∙⋅・･–—✓✔︎-])${SPACE}*`);
const NUMBER_MARKER_RE = new RegExp(`^(\\d{1,3}[.)]|[a-zA-Z][.)])${SPACE}+`);

function normalize(text) {
  return String(text)
    .replace(/[\u200b\u200c\u200d\ufeff]/g, '')
    .split(/\r\n|\r|\n|\u2028|\u2029/);
}

function parse(line) {
  if (line.replace(new RegExp(SPACE, 'g'), '') === '') return { blank: true };
  const lead = line.match(LEAD_RE)[0];
  const indentCh = [...lead].reduce((n, c) => n + (c === '\t' ? 4 : 1), 0);
  const rest = line.slice(lead.length);
  let marker = rest.match(SYMBOL_MARKER_RE);
  // A hyphen/dash only counts as a bullet when a space follows it.
  if (marker && /[-–—]/.test(marker[1]) && marker[0].length === 1) marker = null;
  if (!marker) marker = rest.match(NUMBER_MARKER_RE);
  if (marker && rest.length <= marker[0].length) marker = null;
  const body = (marker ? rest.slice(marker[0].length) : rest)
    .replace(new RegExp(`${SPACE}*\\t${SPACE}*|${SPACE}{2,}`, 'g'), ' ')
    .replace(new RegExp(`${SPACE}+$`), '');
  return { indentCh, marker: marker ? marker[1] : null, body };
}

function Line({ p, prevList }) {
  if (p.blank) return <div className="section-line section-line-blank" />;
  // Indented plain line right after a bullet: continue that bullet's text.
  if (!p.marker && prevList && p.indentCh > 0 && p.indentCh <= prevList.indentCh + 8) {
    const style = prevList.indentCh ? { paddingLeft: `${prevList.indentCh}ch` } : undefined;
    return (
      <div className="section-line section-line-list" style={style}>
        <span className="section-line-marker" style={{ visibility: 'hidden' }} aria-hidden="true">
          {prevList.marker}
        </span>
        <span className="section-line-text">{p.body}</span>
      </div>
    );
  }
  const style = p.indentCh ? { paddingLeft: `${p.indentCh}ch` } : undefined;
  if (p.marker) {
    return (
      <div className="section-line section-line-list" style={style}>
        <span className="section-line-marker">{p.marker}</span>
        <span className="section-line-text">{p.body}</span>
      </div>
    );
  }
  return (
    <div className="section-line" style={style}>
      {p.body}
    </div>
  );
}

export default function FormattedText({ text, className = 'section-body' }) {
  if (!text) return null;
  return (
    <div className={className}>
      {(() => {
        let prevList = null;
        return normalize(text).map((line, i) => {
          const p = parse(line);
          const el = <Line key={i} p={p} prevList={prevList} />;
          if (p.marker) prevList = p;
          else if (p.blank || !(prevList && p.indentCh > 0)) prevList = null;
          return el;
        });
      })()}
    </div>
  );
}
