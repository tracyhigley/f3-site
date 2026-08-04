import ContactForm from '../../components/ContactForm';

export default function About() {
  return (
    <main className="container">
      <h1>About F3 The Grill</h1>
      <p>
        F3 is a free, peer-led workout group for men, built on three core principles: Fitness, Fellowship,
        and Faith. Every workout — called a "beatdown" — is led by a volunteer from the group (the "Q"),
        happens rain or shine, and is always free and open to all men.
      </p>
      <p>
        <em>
          Placeholder — Tracy, drop in the specifics here: AO name/location, days &amp; times, how a new guy
          should show up for his first post, the founding story, and any contact info.
        </em>
      </p>

      <h2>Contact Us</h2>
      <ContactForm />
    </main>
  );
}
