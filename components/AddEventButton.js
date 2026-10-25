'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

const empty = { title: '', date: '', time: '', location: '', note: '' };

export default function AddEventButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function openModal() {
    setForm(empty);
    setError(null);
    setOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setOpen(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      setError('Event and Date are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const { error: insertError } = await supabase.from('calendar_events').insert({
        title: form.title.trim(),
        event_date: form.date,
        time_label: form.time.trim() || null,
        location: form.location.trim() || null,
        note: form.note.trim() || null,
      });
      if (insertError) throw insertError;

      setOpen(false);
      setForm(empty);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Could not add event. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="calendar-add-event-row">
        <button type="button" className="btn btn-primary" onClick={openModal}>
          Add Event
        </button>
      </div>

      {open && (
        <div className="calendar-q-modal-overlay" onClick={closeModal}>
          <div className="calendar-q-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Add an Event</h3>
            <form onSubmit={handleSubmit} className="calendar-add-event-form">
              <div>
                <label htmlFor="event-title">Event</label>
                <input
                  id="event-title"
                  type="text"
                  value={form.title}
                  onChange={(e) => update('title', e.target.value)}
                  placeholder="e.g., Convergence at the Park"
                />
              </div>

              <div>
                <label htmlFor="event-date">Date</label>
                <input
                  id="event-date"
                  type="date"
                  value={form.date}
                  onChange={(e) => update('date', e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="event-time">Time</label>
                <input
                  id="event-time"
                  type="text"
                  value={form.time}
                  onChange={(e) => update('time', e.target.value)}
                  placeholder="e.g., 6:00 PM"
                />
              </div>

              <div>
                <label htmlFor="event-location">Location</label>
                <input
                  id="event-location"
                  type="text"
                  value={form.location}
                  onChange={(e) => update('location', e.target.value)}
                  placeholder="e.g., Hamburg Community Park"
                />
              </div>

              <div>
                <label htmlFor="event-note">Note</label>
                <textarea
                  id="event-note"
                  className="calendar-event-note-input"
                  value={form.note}
                  onChange={(e) => update('note', e.target.value)}
                  placeholder="Anything else people should know"
                />
              </div>

              {error && <p className="error">{error}</p>}

              <div className="calendar-q-modal-actions">
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Event'}
                </button>
                <button
                  type="button"
                  className="admin-cancel-btn"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
