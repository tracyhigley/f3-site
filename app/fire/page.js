import { supabase } from '../../lib/supabaseClient';
import FireRsvp from '../../components/FireRsvp';
import { getCurrentFire, googleCalendarUrl } from '../../lib/currentFire';

export const dynamic = 'force-dynamic';

export default async function Fire() {
  const fire = await getCurrentFire();
  const { data: rsvps } = await supabase
    .from('fire_rsvps')
    .select('*')
    .eq('fire_date', fire.date)
    .order('created_at', { ascending: true });

  return (
    <main>
      <section className="page-hero">
        <img src="https://niuixeomaexekptkamcn.supabase.co/storage/v1/object/public/recap-photos/site/fire-hero-v2.webp" alt="F3 Hamburg – The Grill Fire event" className="page-hero-img" />
        <div className="page-hero-fade" />
      </section>

      <div className="container">
        <p className="page-eyebrow">The Grill</p>
        <h1 className="page-title">Fire</h1>
        <p>*</p>

        <p className="fire-intro">
          F3 Fires are a monthly Second and Third Fs (Fellowship &amp; Faith) gathering where
          men come together to share a meal. We then circle around a fire to share stories,
          struggles, questions, and hopes as they relate to our spiritual lives.
        </p>
        <p className="fire-intro">
          All men are welcome, regardless of where they are on their faith journey. The goal
          of a Fire is to create a safe, authentic space where men can encourage one another,
          gain perspective through God&rsquo;s lens, and grow in relationship with God and
          each other.
        </p>
        <p className="fire-intro">
          These conversations are intended to be faith-centered, but not sermons, debates, or
          teaching sessions.
        </p>
        <p className="fire-intro">
          Sign up below for our next gathering, and let us know what you can bring (side dish,
          dessert, drinks).
        </p>

        <div className="card next-fire-card">
          <h2 className="card-heading">Our Next Monthly Fire</h2>

          <div className="fire-detail">
            <span className="fire-detail-label">Date</span>
            <span className="fire-detail-value">{fire.date}</span>
          </div>
          <div className="fire-detail">
            <span className="fire-detail-label">Time</span>
            <span className="fire-detail-value">{fire.time}</span>
          </div>
          <div className="fire-detail">
            <span className="fire-detail-label">Location</span>
            <span className="fire-detail-value">{fire.location}</span>
          </div>
          {fire.address && (
            <div className="fire-detail">
              <span className="fire-detail-label">Address</span>
              <span className="fire-detail-value">{fire.address}</span>
            </div>
          )}
          {fire.notes && (
            <div className="fire-detail">
              <span className="fire-detail-label">Notes</span>
              <span className="fire-detail-value">{fire.notes}</span>
            </div>
          )}

          <div className="fire-calendar-actions">
            <a
              className="btn btn-primary fire-calendar-btn"
              href={googleCalendarUrl(fire)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Add to Google Calendar
            </a>
            <a className="btn btn-outline-dark fire-calendar-btn" href="/fire/calendar.ics">
              Apple / Outlook (.ics)
            </a>
          </div>
        </div>

        <div className="card rsvp-card">
          <FireRsvp fireDate={fire.date} initialRsvps={rsvps || []} />
        </div>
      </div>
    </main>
  );
}
