'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabaseClient';

function formatFullDate(dateStr) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
}

function toFormState(event) {
  return {
    title: event.title || '',
    date: event.event_date || '',
    time: event.time_label || '',
    location: event.location || '',
    note: event.note || '',
  };
}

export default function CalendarEventPill({ event }) {
  const router = useRouter();
  const [current, setCurrent] = useState(event);
  const [removed, setRemoved] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(() => toFormState(event));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  if (removed) return null;

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function openView() {
    setError(null);
    setOpen(true);
  }

  function closeModal() {
    if (submitting) return;
    setOpen(false);
    setEditing(false);
  }

  function startEdit() {
    setForm(toFormState(current));
    setError(null);
    setEditing(true);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!form.title.trim() || !form.date) {
      setError('Event and Date are required.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const updates = {
        title: form.title.trim(),
        event_date: form.date,
        time_label: form.time.trim() || null,
        location: form.location.trim() || null,
        note: form.note.trim() || null,
      };
      const { error: updateError } = await supabase.from('calendar_events').update(updates).eq('id', current.id);
      if (updateError) throw updateError;

      setCurrent((c) => ({ ...c, ...updates }));
      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Could not save. Try again.');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove() {
    setSubmitting(true);
    setError(null);
    try {
      const { error: deleteError } = await supabase.from('calendar_events').delete().eq('id', current.id);
      if (deleteError) throw deleteError;

      setRemoved(true);
      router.refresh();
    } catch (err) {
      setError(err.message || 'Could not remove this event. Try again.');
      setSubmitting(false);
    }
  }

  return (
    <>
      <button type="button" className="calendar-event-custom" onClick={openView}>
        {current.title}
        {current.time_label ? ` — ${current.time_label}` : ''}
      </button>

      {open && (
        <div className="calendar-q-modal-overlay" onClick={closeModal}>
          <div className="calendar-q-modal" onClick={(e) => e.stopPropagation()}>
            {editing ? (
              <>
                <h3>Edit Event</h3>
                <form onSubmit={handleSave} className="calendar-add-event-form">
                  <div>
                    <label htmlFor={`edit-title-${current.id}`}>Event</label>
                    <input
                      id={`edit-title-${current.id}`}
                      type="text"
                      value={form.title}
                      onChange={(e) => update('title', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-date-${current.id}`}>Date</label>
                    <input
                      id={`edit-date-${current.id}`}
                      type="date"
                      value={form.date}
                      onChange={(e) => update('date', e.target.value)}
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-time-${current.id}`}>Time</label>
                    <input
                      id={`edit-time-${current.id}`}
                      type="text"
                      value={form.time}
                      onChange={(e) => update('time', e.target.value)}
                      placeholder="e.g., 6:00 PM"
                    />
                  </div>
                  <div>
                    <label htmlFor={`edit-location-${current.id}`}>Location</label>
                    <input
                      id={`edit-location-${current.id}`}
                      type="text"
                      value={form.location}
                      onChange={(e) => update('location', e.target.value)}
                      placeholder="e.g., Hamburg Community Park"
                    />
                  </div>

                  <div>
                    <label htmlFor={`edit-note-${current.id}`}>Note</label>
                    <textarea
                      id={`edit-note-${current.id}`}
                      className="calendar-event-note-input"
                      value={form.note}
                      onChange={(e) => update('note', e.target.value)}
                      placeholder="Anything else people should know"
                    />
                  </div>

                  {error && <p className="error">{error}</p>}

                  <div className="calendar-q-modal-actions">
                    <button type="submit" className="btn btn-primary" disabled={submitting}>
                      {submitting ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      className="admin-cancel-btn"
                      onClick={() => setEditing(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <h3>{current.title}</h3>
                <p className="calendar-q-modal-time">{formatFullDate(current.event_date)}</p>

                {current.time_label && (
                  <p className="calendar-event-detail-row">
                    <strong>Time:</strong> {current.time_label}
                  </p>
                )}
                {current.location && (
                  <p className="calendar-event-detail-row">
                    <strong>Location:</strong> {current.location}
                  </p>
                )}
                {current.note && (
                  <p className="calendar-event-detail-row calendar-event-note-text">{current.note}</p>
                )}

                {error && <p className="error">{error}</p>}

                <div className="calendar-q-modal-actions">
                  <button type="button" className="btn btn-primary" onClick={startEdit} disabled={submitting}>
                    Edit
                  </button>
                  <button type="button" className="admin-cancel-btn" onClick={closeModal} disabled={submitting}>
                    Close
                  </button>
                  <button type="button" className="calendar-q-clear" onClick={handleRemove} disabled={submitting}>
                    {submitting ? 'Removing...' : 'Remove Event'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
