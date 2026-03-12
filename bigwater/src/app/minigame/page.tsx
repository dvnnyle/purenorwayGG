'use client';

import ImpactGame from '@/components/games/oceanGame';
import Footer from '@/components/layout/footer';
import './minigame.css';

export default function MiniGamePage() {
  return (
    <div className="minigame-page">
      <section className="minigame-hero">
        <div className="minigame-hero-content">
          <div className="minigame-hero-kicker">OCEAN IMPACT</div>
          <h1>
            Play the cleanup <span className="minigame-hero-highlight">mini game</span>
          </h1>
          <p>
            Remove ocean trash, collect valuables, and help marine life thrive.
          </p>
        </div>
      </section>

      <ImpactGame />
      <Footer />
    </div>
  );
}
