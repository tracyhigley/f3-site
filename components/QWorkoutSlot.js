'use client';

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function QWorkoutSlot({ dateKey, dayLabel, timeLabel, logoUrl, initialSignup, people }) {
  const [signup, setSignup] = useState(initialSignup || null);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function openModal() {
    setSelectedId(signup ? String(signup.person_id) : '');
    setError(null);
    setOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setOpen(false);
  }

  async function handleConfirm() {
    if (!selectedId) {
      setError('Pick your name first.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { data, error: upsertError } = await supabase
        .from('q_signups')
        .upsert({ event_date: dateKey, person_id: Number(selectedId) }, { onConflict: 'event_date' })
        .select('id, person_id, people(name)')
        .single();
      if (upsertError) throw upsertError;
      setSignup({ id: data.id, person_id: data.person_id, person_name: data.people?.name || '' });
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Could not save. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleClear() {
    if (!signup) return;
    setSubmitting(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('q_signups').delete().eq('id', signup.id);
      if (deleteError) throw deleteError;
      setSignup(null);
      setOpen(false);
    } catch (err) {
      setError(err.message || 'Could not remove. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <button
        type="button"
        className="calendar-event-workout calendar-q-slot"
        onClick={openModal}
        aria-label={signup ? `${dayLabel}, Q is ${signup.person_name}. Tap to change.` : `${dayLabel}, open slot. Tap to sign up as Q.`}
      >
        <span className="calendar-event-time">{timeLabel}</span>
        <span className={`calendar-q-status ${signup ? 'filled' : 'open'}`}>
          Q: {signup ? signup.person_name : '[open]'}
        </span>
        <img src={logoUrl} alt="" className="calendar-event-logo-large" />
      </button>

      {open && (
        <div className="calendar-q-modal-overlay" onClick={closeModal}>
          <div className="calendar-q-modal" onClick={(e) => e.stopPropagation()}>
            <h3>{dayLabel}</h3>
            <p className="calendar-q-modal-time">{timeLabel}</p>

            {signup && (
              <p className="calendar-q-modal-current">
                Currently Q: <strong>{signup.person_name}</strong>
              </p>
            )}

            <label htmlFor={`q-select-${dateKey}`}>{signup ? 'Change Q to' : 'Sign up as Q'}</label>
            <select id={`q-select-${dateKey}`} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
              <option value="">Select your name...</option>
              {people.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>

            {error && <p className="error">{error}</p>}

            <div className="calendar-q-modal-actions">
              <button type="button" className="btn btn-primary" onClick={handleConfirm} disabled={submitting}>
                {submitting ? 'Saving...' : signup ? 'Update Q' : 'Sign Up'}
              </button>
              <button type="button" className="calendar-q-cancel" onClick={closeModal} disabled={submitting}>
                Cancel
              </button>
              {signup && (
                <button type="button" className="calendar-q-clear" onClick={handleClear} disabled={submitting}>
                  Clear signup
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
