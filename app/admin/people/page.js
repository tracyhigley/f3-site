'use client';

import { useEffect, useMemo, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminPeople() {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState('');
  const [passcode, setPasscode] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [savingId, setSavingId] = useState(null);
  const [rowError, setRowError] = useState(null);
  const [rowSuccessId, setRowSuccessId] = useState(null);

  useEffect(() => {
    loadPeople();
  }, []);

  async function loadPeople() {
    setLoading(true);
    setLoadError(null);
    const { data, error } = await supabase.from('people').select('id, name').order('name');
    if (error) setLoadError(error.message);
    setPeople(data || []);
    setLoading(false);
  }

  function startEdit(person) {
    setEditingId(person.id);
    setEditValue(person.name);
    setRowError(null);
    setRowSuccessId(null);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditValue('');
    setRowError(null);
  }

  async function handleSave(personId) {
    if (!passcode) {
      setRowError('Enter the admin passcode above first.');
      return;
    }
    if (!editValue.trim()) {
      setRowError('Name cannot be empty.');
      return;
    }
    setSavingId(personId);
    setRowError(null);
    try {
      const { error } = await supabase.rpc('rename_person', {
        p_person_id: personId,
        p_new_name: editValue.trim(),
        p_passcode: passcode,
      });
      if (error) throw error;

      const finalName = editValue.trim();
      setPeople((prev) =>
        prev
          .map((p) => (p.id === personId ? { ...p, name: finalName } : p))
          .sort((a, b) => a.name.localeCompare(b.name))
      );
      setEditingId(null);
      setEditValue('');
      setRowSuccessId(personId);
    } catch (err) {
      setRowError(err.message || 'Could not save. Try again.');
    } finally {
      setSavingId(null);
    }
  }

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return people;
    return people.filter((p) => p.name.toLowerCase().includes(term));
  }, [people, search]);

  return (
    <main className="container">
      <p className="page-eyebrow">The Grill</p>
      <h1 className="page-title">Edit Group Member Names</h1>
      <p className="admin-intro">
        Fix a typo or update someone&rsquo;s F3 nickname. Browsing and searching the roster below is open to
        anyone with this link, but you&rsquo;ll need the admin passcode to actually save a change.
      </p>

      <div className="admin-passcode-row">
        <label htmlFor="admin-passcode">Admin passcode</label>
        <input
          id="admin-passcode"
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          placeholder="Required to save a rename"
          autoComplete="off"
        />
      </div>

      <input
        type="search"
        className="admin-search"
        placeholder="Search names..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {loading && <p>Loading roster&hellip;</p>}
      {loadError && <p className="error">{loadError}</p>}
      {!loading && filtered.length === 0 && <p className="empty-state">No matching names.</p>}

      <ul className="admin-people-list">
        {filtered.map((p) => (
          <li key={p.id} className="admin-people-row">
            {editingId === p.id ? (
              <div className="admin-people-edit">
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  autoFocus
                />
                <div className="admin-people-actions">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleSave(p.id)}
                    disabled={savingId === p.id}
                  >
                    {savingId === p.id ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="admin-cancel-btn"
                    onClick={cancelEdit}
                    disabled={savingId === p.id}
                  >
                    Cancel
                  </button>
                </div>
                {rowError && <p className="error admin-row-error">{rowError}</p>}
              </div>
            ) : (
              <div className="admin-people-view">
                <span className="admin-people-name">
                  {p.name}
                  {rowSuccessId === p.id && <span className="admin-saved-badge">Saved</span>}
                </span>
                <button type="button" className="admin-rename-btn" onClick={() => startEdit(p)}>
                  Rename
                </button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}
