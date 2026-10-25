import Link from 'next/link';
import { supabase } from '../../../lib/supabaseClient';
import RecapCard from '../../../components/RecapCard';
import { backblastMetadata } from '../../../lib/ogMetadata';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }) {
  const { data: recap } = await supabase
    .from('recaps')
    .select('id, date, title, intro, photo_url')
    .eq('id', params.id)
    .single();
  return backblastMetadata(recap, { url: `/backblast/${params.id}` });
}

export default async function BackblastDetail({ params }) {
  const { id } = params;

  const [{ data: recap }, { data: people }] = await Promise.all([
    supabase.from('recaps').select('*').eq('id', id).single(),
    supabase.from('people').select('id, name'),
  ]);

  if (!recap) {
    return (
      <main className="container">
        <p className="page-eyebrow">The Grill</p>
        <h1 className="page-title">Backblast Not Found</h1>
        <p className="empty-state">
          That backblast doesn&apos;t exist or was removed. <Link href="/recent-backblasts">Back to Recent Backblasts</Link>
        </p>
      </main>
    );
  }

  const peopleMap = Object.fromEntries((people || []).map((p) => [p.id, p.name]));

  return (
    <main className="container">
      <p className="page-eyebrow">The Grill</p>
      <h1 className="page-title">Backblast</h1>
      <RecapCard recap={recap} peopleMap={peopleMap} editable />
    </main>
  );
}
