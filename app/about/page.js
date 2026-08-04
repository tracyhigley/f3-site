import ContactForm from '../../components/ContactForm';

export default function About() {
  return (
    <main>
      <section className="page-hero">
        {/* TODO: swap in a real photo for the About page */}
        <img src="/images/group1.webp" alt="F3 Hamburg – The Grill PAX" className="page-hero-img" />
        <div className="page-hero-fade" />
      </section>

      <div className="container">
        <p className="page-eyebrow">The Grill</p>
        <h1 className="page-title">About F3 The Grill</h1>

        <p className="fire-intro">
          F3 is a free, peer-led workout group for men, built on three core principles: Fitness, Fellowship,
          and Faith. Every workout — called a &ldquo;beatdown&rdquo; — is led by a volunteer from the group (the
          &ldquo;Q&rdquo;), happens rain or shine, and is always free and open to all men.
        </p>

        <div className="card">
          <h2 className="card-heading">Contact Us</h2>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
