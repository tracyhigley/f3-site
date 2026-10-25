import { supabase } from './supabaseClient';

const SITE = 'F3 Hamburg – The Grill';
const DEFAULT_IMAGE = '/og-default.jpg';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const [y, m, d] = dateStr.split('-');
  return `${m}-${d}-${y}`;
}

function shorten(text, max = 180) {
  if (!text) return '';
  const t = String(text).replace(/\s+/g, ' ').trim();
  return t.length > max ? `${t.slice(0, max - 1).trimEnd()}…` : t;
}

// Link-preview (Open Graph) tags for a backblast: its title, date, intro and photo.
export function backblastMetadata(recap, { url, heading } = {}) {
  if (!recap) return {};
  const title = heading ? `${heading}: ${recap.title}` : `${recap.title} | ${SITE}`;
  const description =
    shorten(recap.intro) || `Backblast from ${formatDate(recap.date)}. ${SITE}`;
  const image = recap.photo_url || DEFAULT_IMAGE;
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      siteName: SITE,
      type: 'article',
      images: [{ url: image }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [image] },
  };
}

export async function latestRecap() {
  const { data } = await supabase
    .from('recaps')
    .select('id, date, title, intro, photo_url')
    .order('date', { ascending: false })
    .order('id', { ascending: false })
    .limit(1);
  return data && data[0];
}
