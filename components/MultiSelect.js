'use client';

import { useEffect, useRef, useState } from 'react';

// Pick several people from a dropdown: click a name to add it (no checkboxes).
// Chosen names show as chips; click the × on a chip to remove that person.
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
      setTimeout(() => searchRef.current?.focus(), 0);
    }
  }, [open]);

  function add(id) {
    if (!selected.includes(id)) onChange([...selected, id]);
    setSearch('');
    setTimeout(() => searchRef.current?.focus(), 0);
  }

  function remove(id) {
    onChange(selected.filter((x) => x !== id));
  }

  const selectedOptions = selected
    .map((id) => options.find((o) => o.id === id))
    .filter(Boolean);
  const available = options.filter((o) => !selected.includes(o.id));
  const filteredOptions = available.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="multiselect" ref={containerRef}>
      {selectedOptions.length > 0 && (
        <div className="multiselect-chips">
          {selectedOptions.map((o) => (
            <span key={o.id} className="multiselect-chip">
              {o.name}
              <button
                type="button"
                className="multiselect-chip-remove"
                aria-label={`Remove ${o.name}`}
                onClick={() => remove(o.id)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}
      <button type="button" className="multiselect-trigger" onClick={() => setOpen((o) => !o)}>
        <span>{selectedOptions.length ? `Add another (${selectedOptions.length} selected)` : placeholder}</span>
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                if (filteredOptions[0]) add(filteredOptions[0].id);
              } else if (e.key === 'Escape') {
                setOpen(false);
              }
            }}
          />
          {filteredOptions.length === 0 && (
            <div className="multiselect-empty">
              {options.length === 0
                ? 'No one in the system yet.'
                : available.length === 0
                ? 'Everyone has been added.'
                : 'No matches.'}
            </div>
          )}
          {filteredOptions.map((o) => (
            <button key={o.id} type="button" className="multiselect-option" onClick={() => add(o.id)}>
              {o.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
