'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function FireRsvp({ fireDate, initialRsvps }) {
  const [rsvps, setRsvps] = useState(initialRsvps || []);
  const [name, setName] = useState('');
  const [bringing, setBringing] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Enter your name.');
      return;
    }

    setSubmitting(true);
    try {
      const { data, error: insertError } = await supabase
        .from('fire_rsvps')
        .insert({ fire_date: fireDate, name: name.trim(), bringing: bringing.trim() || null })
        .select()
        .single();
      if (insertError) throw insertError;

      setRsvps((prev) => [...prev, data]);
      setName('');
      setBringing('');
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rsvp-section">
      <h2 className="rsvp-heading">
        Who&rsquo;s Coming <span className="rsvp-count">({rsvps.length})</span>
      </h2>

      {rsvps.length === 0 ? (
        <p className="empty-state">No one has RSVP&rsquo;d yet — be the first.</p>
      ) : (
        <ul className="rsvp-list">
          {rsvps.map((r) => (
            <li key={r.id} className="rsvp-item">
              <span className="rsvp-name">{r.name}</span>
              {r.bringing && <span className="rsvp-bringing">bringing {r.bringing}</span>}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="rsvp-form">
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="What are you bringing? (optional)"
          value={bringing}
          onChange={(e) => setBringing(e.target.value)}
        />
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Adding...' : "I'm In"}
        </button>
      </form>
    </div>
  );
}
