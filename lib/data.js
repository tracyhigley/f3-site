import { supabase } from './supabaseClient';

// Fetch every recap (newest first) plus the full people roster, and a
// convenience id -> name lookup map. Shared by Home, Archive, and Scorecard
// so they all agree on ordering and naming.
export async function getRecapsWithNames() {
  const [{ data: recaps }, { data: people }] = await Promise.all([
    supabase
      .from('recaps')
      .select('*')
      .order('date', { ascending: false })
      .order('id', { ascending: false }),
    supabase.from('people').select('*').order('name'),
  ]);

  const peopleMap = Object.fromEntries((people || []).map((p) => [p.id, p.name]));
  return { recaps: recaps || [], people: people || [], peopleMap };
}
