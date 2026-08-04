'use client';

import { useEffect, useRef, useState } from 'react';

// A simple dropdown that lets you check multiple options, instead of relying
// on a native <select multiple> (which needs cmd/ctrl-click on desktop and is
// awkward on some mobile browsers).
export default function MultiSelect({ options, selected, onChange, placeholder = 'Select...' }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (open) {
      setSearch('');
      // Let the menu render before focusing.
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  function toggle(id) {
    if (selected.includes(id)) {
      onChange(selected.filter((x) => x !== id));
    } else {
      onChange([...selected, id]);
    }
  }

  const selectedLabels = options.filter((o) => selected.includes(o.id)).map((o) => o.name);
  const filteredOptions = options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="multiselect" ref={containerRef}>
      <button type="button" className="multiselect-trigger" onClick={() => setOpen((o) => !o)}>
        <span>{selectedLabels.length ? selectedLabels.join(', ') : placeholder}</span>
        <span className="multiselect-caret">▾</span>
      </button>
      {open && (
        <div className="multiselect-menu">
          <input
            ref={searchRef}
            type="text"
            className="multiselect-search"
            placeholder="Type a name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {filteredOptions.length === 0 && (
            <div className="multiselect-empty">
              {options.length === 0 ? 'No one in the system yet.' : 'No matches.'}
            </div>
          )}
          {filteredOptions.map((o) => (
            <label key={o.id} className="multiselect-option">
              <input type="checkbox" checked={selected.includes(o.id)} onChange={() => toggle(o.id)} />
              {o.name}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}
