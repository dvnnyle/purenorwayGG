import { MdWaterDrop } from 'react-icons/md';
import './newsletterStrip.css';

export default function NewsletterStrip() {
  return (
    <section className="newsletter-strip" aria-label="Newsletter signup">
      <div className="newsletter-strip-inner">
        <div className="newsletter-strip-eyebrow">Newsletter</div>
        <h2>
          Stay in the <em>flow.</em>
        </h2>
        <div className="newsletter-strip-subheading">with PURE Norway WATER</div>
        <form className="newsletter-strip-form">
          <input type="email" placeholder="your@email.com" aria-label="Email address" />
          <button type="button" aria-label="Subscribe to newsletter">
            <span className="newsletter-btn-text">Subscribe</span>
            <MdWaterDrop className="newsletter-btn-icon" />
          </button>
        </form>
        <span className="newsletter-strip-note">No spam. Unsubscribe anytime.</span>
      </div>
    </section>
  );
}