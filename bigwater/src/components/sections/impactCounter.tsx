'use client';

import { useEffect, useRef } from 'react';
import { MdAttachMoney, MdEco, MdWaterDrop } from 'react-icons/md';
import './impactCounter.css';

export default function ImpactCounter() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sectionNode = sectionRef.current;
    if (!sectionNode) return;

    const formatNum = (n: number) => n.toLocaleString('no-NO');

    const runCounters = () => {
      const nodes = sectionNode.querySelectorAll<HTMLElement>('.impact-v2-stat-val[data-target]');
      nodes.forEach((node) => {
        const target = parseFloat(node.dataset.target || '0');
        const suffix = node.dataset.suffix || '';
        const duration = 1800;
        const start = performance.now();

        const step = (now: number) => {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          node.textContent = `${formatNum(Math.round(eased * target))}${suffix}`;
          if (progress < 1) {
            requestAnimationFrame(step);
          }
        };

        requestAnimationFrame(step);
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          runCounters();
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(sectionNode);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="impact-v2-section" ref={sectionRef}>
      <div className="impact-v2-inner">
        <div className="impact-v4-layout">
          {/* LEFT - Stats */}
          <div className="impact-v4-stats">
            <article className="impact-v4-stat">
              <div className="impact-v4-stat-icon" aria-hidden="true">
                <MdAttachMoney />
              </div>
              <div className="impact-v4-stat-body">
                <div className="impact-v2-stat-val" data-target="2467" data-suffix=" kr">0 kr</div>
                <div className="impact-v4-stat-lbl">Donated to Environmental Projects</div>
              </div>
            </article>

            <article className="impact-v4-stat">
              <div className="impact-v4-stat-icon" aria-hidden="true">
                <MdWaterDrop />
              </div>
              <div className="impact-v4-stat-body">
                <div className="impact-v2-stat-val" data-target="29" data-suffix=" kg">0 kg</div>
                <div className="impact-v4-stat-lbl">Ocean Plastic Removed</div>
              </div>
            </article>

            <article className="impact-v4-stat">
              <div className="impact-v4-stat-icon" aria-hidden="true">
                <MdEco />
              </div>
              <div className="impact-v4-stat-body">
                <div className="impact-v2-stat-val" data-target="1488" data-suffix=" kg">0 kg</div>
                <div className="impact-v4-stat-lbl">CO₂ Emissions Prevented</div>
              </div>
            </article>
          </div>

          {/* RIGHT - Content */}
          <div className="impact-v4-left">
            <div className="impact-v2-eyebrow">PURENorway Foundation</div>
            <h2>
              Our Growing <em>Impact</em>
            </h2>
            <p className="impact-v4-desc">
              By donating 1% of our turnover, PURENorway Foundation channels funds directly to
              projects and organizations that share our mission of protecting the planet.
            </p>
            <p className="impact-v4-footnote">Impact grows with every product sold.</p>
            <a href="#" className="impact-v4-btn">
              Read More
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
