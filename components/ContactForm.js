'use client';

import { useState } from 'react';

const empty = { name: '', email: '', message: '' };

export default function ContactForm() {
  const [form, setForm] = useState(empty);
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('sending');
    try {
      const res = await fetch('https://formsubmit.co/ajax/rhigley13@gmail.com', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Name: form.name,
          Email: form.email,
          Message: form.message,
          _subject: 'New message from the F3 Hamburg – The Grill website',
        }),
      });
      if (!res.ok) throw new Error('Failed to send');
      setStatus('sent');
      setForm(empty);
    } catch (err) {
      setStatus('error');
    }
  }

  if (status === 'sent') {
    return <p className="success">Thanks — your message has been sent.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {status === 'error' && (
        <p className="error">Something went wrong sending that. Please try again in a moment.</p>
      )}

      <div>
        <label>Name</label>
        <input type="text" required value={form.name} onChange={(e) => update('name', e.target.value)} />
      </div>

      <div>
        <label>Email</label>
        <input type="email" required value={form.email} onChange={(e) => update('email', e.target.value)} />
      </div>

      <div>
        <label>Message</label>
        <textarea required value={form.message} onChange={(e) => update('message', e.target.value)} />
      </div>

      <button type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
