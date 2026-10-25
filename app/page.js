import Link from 'next/link';

export default function Home() {
  return (
    <main>
      <section className="hero">
        <img src="https://niuixeomaexekptkamcn.supabase.co/storage/v1/object/public/recap-photos/site/hero.webp" alt="F3 Hamburg – The Grill PAX working out" className="hero-img" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-eyebrow">F3 Hamburg — The Grill</p>
          <h1 className="hero-title">FITNESS, FELLOWSHIP<br />AND FAITH<span className="reg">®</span></h1>
          <p className="hero-subtitle">
            A free, peer-led workout for men.<br />Outdoors, rain or shine — every week.
          </p>
          <div className="hero-cta">
            <Link href="/recent-backblasts" className="btn btn-primary">Recent Backblasts</Link>
          </div>
        </div>
      </section>

      <section className="home-section schedule">
        <p className="home-eyebrow">Workouts</p>
        <p className="schedule-line">Tuesday 5:15 PM – 6 PM</p>
        <p className="schedule-line">Saturday 7 AM – 8 AM</p>
        <p className="home-eyebrow schedule-location-label">Location</p>
        <p className="schedule-line">Hamburg Community Park</p>
        <p className="schedule-line">211 N 2nd St., Hamburg, PA</p>
      </section>

      <section className="home-section mission">
        <p className="home-eyebrow">The Mission</p>
        <h2 className="mission-statement">
          The Mission of F3 is to plant, grow and serve small workout groups for men
          for the invigoration of male community leadership.
        </h2>
      </section>

      <section className="home-section principles">
        <img
          src="https://niuixeomaexekptkamcn.supabase.co/storage/v1/object/public/recap-photos/site/principles.webp"
          alt="F3's 5 Core Principles: Free of Charge, Open to all Men, Held Outdoors, Peer Led, Ends with a COT"
          className="principles-img"
        />
      </section>

      <section className="cta-band">
        <p className="cta-band-text">Free for all men, of all fitness levels.</p>
        <Link href="/about" className="btn btn-light">About The Grill</Link>
      </section>

      <section className="home-section community">
        <div className="community-grid">
          <img src="https://niuixeomaexekptkamcn.supabase.co/storage/v1/object/public/recap-photos/site/group1.webp" alt="The Grill PAX" className="community-img" />
          <div className="community-copy">
            <p className="home-eyebrow">This Is The Grill</p>
            <h2>Leave no man behind,<br />but leave no man where you find him.</h2>
            <p>
              Every week the PAX meet for a free, outdoor workout led by
              one of our own — no experience or gear required.
            </p>
          </div>
        </div>
      </section>

      <section className="join-band">
        <h2>Check out our monthly F3 Fire.</h2>
        <Link href="/fire" className="btn btn-primary">See The Fire</Link>
      </section>
    </main>
  );
}
