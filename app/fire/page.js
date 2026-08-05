import { supabase } from '../../lib/supabaseClient';
import FireRsvp from '../../components/FireRsvp';

export const dynamic = 'force-dynamic';

// TODO: update this each month when you announce the next Fire.
// RSVPs are tied to this exact value — changing it automatically starts
// a fresh RSVP list for the new date without deleting old ones.
const CURRENT_FIRE_DATE = 'Sept 14, 2026';

export default async function Fire() {
  const { data: rsvps } = await supabase
    .from('fire_rsvps')
    .select('*')
    .eq('fire_date', CURRENT_FIRE_DATE)
    .order('created_at', { ascending: true });

  return (
    <main>
      <section className="page-hero">
        <img src="/images/hero.webp" alt="F3 Hamburg – The Grill Fire event" className="page-hero-img" />
        <div className="page-hero-fade" />
      </section>

      <div className="container">
        <p className="page-eyebrow">The Grill</p>
        <h1 className="page-title">Fire</h1>

        <p className="fire-intro">
          {/* TODO: replace with your real description of what a Fire is for The Grill */}
          Once a month, The Grill turns up the heat. A Fire is bigger and longer than a
          regular beatdown — more PAX, more work, and more fellowship afterward. Bring a
          friend, bring your FNG, and come find out what makes it worth showing up before
          sunrise.
        </p>

        <div className="card next-fire-card">
          <h2 className="card-heading">Our Next Monthly Fire</h2>

          <div className="fire-detail">
            <span className="fire-detail-label">Date</span>
            <span className="fire-detail-value">{CURRENT_FIRE_DATE}</span>
          </div>
          <div className="fire-detail">
            <span className="fire-detail-label">Time</span>
            <span className="fire-detail-value">6:00 PM</span>
          </div>
          <div className="fire-detail">
            <span className="fire-detail-label">Location</span>
            <span className="fire-detail-value">TBD</span>
          </div>
        </div>

        <div className="card rsvp-card">
          <FireRsvp fireDate={CURRENT_FIRE_DATE} initialRsvps={rsvps || []} />
        </div>
      </div>
    </main>
  );
}
