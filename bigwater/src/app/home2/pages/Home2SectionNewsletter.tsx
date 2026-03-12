"use client";

import { useState } from "react";
import { MdWaterDrop } from "react-icons/md";

export default function Home2SectionNewsletter() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
      setTimeout(() => {
        setEmail("");
        setSubmitted(false);
      }, 3000);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x: x * 15, y: y * 15 });
  };

  return (
    <section className="home2-section-newsletter" onMouseMove={handleMouseMove}>
      <div className="home2-newsletter-inner">
        <div className="home2-newsletter-card">
          <span className="home2-newsletter-eyebrow">Newsletter</span>
          <h2 className="home2-newsletter-title">
            Get the Latest from
            <br />
            <span className="home2-newsletter-badge-inline">
              <MdWaterDrop />
            </span>
            <span className="home2-newsletter-highlight">PURENorway Water</span>
          </h2>

          <p className="home2-newsletter-copy">
            Real updates on our products, sustainability work, and stories from the brand. Join us in our journey!
          </p>

          <form className="home2-newsletter-form" onSubmit={handleSubmit}>
            <input
              type="email"
              className="home2-newsletter-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={submitted}
            />
            <button
              type="submit"
              className="home2-newsletter-btn"
              disabled={submitted}
            >
              {submitted ? "Subscribed!" : "Subscribe"}
            </button>
          </form>
        </div>
        <div 
          className="home2-newsletter-image"
          style={{
            transform: `translate(${mousePos.x}px, ${mousePos.y}px) scale(1.05)`,
            transition: "transform 0.08s ease-out"
          }}
        >
          <img
            src="/assets/images/norgeFjords_upscale.jpeg"
            alt="Norwegian Fjords"
            className="home2-newsletter-img"
          />
        </div>
      </div>
    </section>
  );
}
