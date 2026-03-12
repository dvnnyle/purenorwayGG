import Link from 'next/link';
import './footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-top-left">
            <div className="footer-brand-title">PURE Norway Water</div>
            <p className="footer-tagline">
 
              Experience the flavour, taste the adventure.

            </p>
          </div>

          <div className="footer-top-center">
            <Link className="footer-logo" href="/">
              <img
                src="/assets/logo/logoWhite.png"
                alt="PURENorway"
                className="footer-logo-image"
                loading="lazy"
              />
            </Link>
          </div>

          <div className="footer-top-right">
            <p className="social-kicker">We're on all the good ones.</p>
            <div className="social-links">
              <a
                className="social-btn"
                href="https://www.instagram.com/purenorwaywaterno/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              </a>
              <a
                className="social-btn"
                href="https://www.facebook.com/PureNorwayWaterNO/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              </a>
              <a
                className="social-btn"
                href="https://www.linkedin.com/company/purenorwayno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
              >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
              </a>
              <a
                className="social-btn"
                href="https://www.tiktok.com/@purenorwaywaterno"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.24V2h-3.4v13.77a2.9 2.9 0 1 1-2-2.77V9.56a6.3 6.3 0 1 0 5.4 6.23V8.77a8.2 8.2 0 0 0 4.79 1.52V6.9c-.34 0-.69-.07-1.02-.21Z" />
              </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-cols">
          <div className="footer-col">
            <div className="footer-col-title">Headquarters</div>
            <div className="contact-block">
              <div className="contact-name">David Severinsen</div>
              <div className="contact-role">CEO</div>
              <p>
                <a href="tel:+4745890684">+47 458 90 684</a>
              </p>
              <p>
                <a href="mailto:david@purenorwaywater.com">david@purenorwaywater.com</a>
              </p>
            </div>
            <div className="divider" />
            <div className="contact-block">
              <div className="contact-name">Oystein Frustol</div>
              <p>
                <a href="tel:+4790915907">+47 909 15 907</a>
              </p>
              <p>
                <a href="mailto:oystein@purenorway.no">oystein@purenorway.no</a>
              </p>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Norway Office</div>
            <div className="contact-block">
              <address>
                <p>PURE Norway Water AS</p>
                <p>Skibaasen 28</p>
                <p>4636 Kristiansand</p>
                <p>NORWAY</p>
              </address>
            </div>
            <div className="divider" />
            <p>
              <a href="tel:+4738044030">+47 38 04 40 30</a>
            </p>
            <p>
              <a href="mailto:post@purenorway.no">post@purenorway.no</a>
            </p>
            <p className="footer-web-link">
              <a href="https://www.purenorwaywater.com" target="_blank" rel="noopener noreferrer">
                www.purenorwaywater.com
              </a>
            </p>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Asia Pacific</div>
            <div className="contact-block">
              <div className="contact-region">Vietnam / Singapore</div>
              <div className="contact-company">BUY2SELL</div>
              <p>
                <a href="mailto:support@buy2sell.vn">support@buy2sell.vn</a>
              </p>
            </div>
            <div className="divider" />
            <div className="contact-block">
              <div className="contact-region">Taiwan</div>
              <div className="contact-company">UFL Shipping Agency</div>
              <p>
                <a href="tel:+88673389963">+886 7 338 9963</a>
              </p>
              <p>
                <a href="mailto:shippingagency@uni-logistics.com">shippingagency@uni-logistics.com</a>
              </p>
            </div>
          </div>

          <div className="footer-col">
            <div className="footer-col-title">Middle East &amp; Europe</div>
            <div className="contact-block">
              <div className="contact-region">Dubai</div>
              <div className="contact-company">Fjord Norway Source LLC</div>
              <div className="contact-name">Birol Can</div>
              <p>
                <a href="tel:+4740050684">+47 400 50 684</a>
              </p>
              <p>
                <a href="mailto:post@fjordnorway.ae">post@fjordnorway.ae</a>
              </p>
              <p>
                <a href="https://fjordnorway.ae" target="_blank" rel="noopener noreferrer">
                  fjordnorway.ae
                </a>
              </p>
            </div>
            <div className="divider" />
            <div className="contact-block">
              <div className="contact-region">UK / France</div>
              <div className="contact-company">IFL</div>
              <div className="contact-name">Chris Smith</div>
              <p>
                <a href="tel:+447898853171">+44 789 885 3171</a>
              </p>
              <p>
                <a href="mailto:chris@purenorwaywater.com">chris@purenorwaywater.com</a>
              </p>
            </div>
          </div>
        </div>

        <div className="flag-strip" aria-hidden="true">
          <div className="fs-r" />
          <div className="fs-w" />
          <div className="fs-b" />
          <div className="fs-w" />
          <div className="fs-r" />
        </div>

        <div className="footer-bottom">
          <p className="footer-copy">
            &copy; 2026 PURE NORWAY WATER AS. All rights reserved. · Designed &amp; developed by{' '}
            <a href="https://dvnny.no" target="_blank" rel="noopener noreferrer">
              dvnny.no
            </a>
          </p>
          <div className="footer-links">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Use</a>
            <a href="#">Sustainability</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
