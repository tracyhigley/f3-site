'use client';

import { useState } from 'react';

// Shares a backblast's own page link. On phones this opens the share sheet
// (so it can go straight to GroupMe); otherwise it copies the link.
export default function ShareLinkButton({ path, title }) {
  const [status, setStatus] = useState('');

  async function share() {
    const url = `https://f3thegrill.com${path}`;
    try {
      if (navigator.share && /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent)) {
        await navigator.share({ title, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setStatus('Link copied!');
    } catch (e) {
      if (e && e.name === 'AbortError') return;
      window.prompt('Copy this link:', url);
    }
    setTimeout(() => setStatus(''), 2500);
  }

  return (
    <button type="button" className="share-link-btn" onClick={share}>
      {status || 'Share link'}
    </button>
  );
}
