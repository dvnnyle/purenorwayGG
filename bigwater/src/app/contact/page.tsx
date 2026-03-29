'use client';

import React, { useEffect, useState } from 'react';
import Footer from '@/components/layout/footer';
import './contact.css';
import { MdEmail, MdPhone, MdLocationOn, MdGroups, MdLocalShipping, MdWaterDrop } from 'react-icons/md';
import { FaInstagram, FaTiktok, FaFacebookF, FaXTwitter, FaLinkedinIn, FaSnapchat } from 'react-icons/fa6';
import { IoChatbubble } from 'react-icons/io5';

type FaqCategory = 'all' | 'product' | 'sustainability' | 'ordering' | 'business';

type FaqItem = {
  question: React.ReactNode;
  answer: React.ReactNode;
};

type FaqGroup = {
  category: Exclude<FaqCategory, 'all'>;
  title: string;
  items: FaqItem[];
};

const FAQ_CATEGORIES: Array<{ value: FaqCategory; label: string }> = [
  { value: 'all', label: 'All Questions' },
  { value: 'product', label: 'Product' },
  { value: 'sustainability', label: 'Sustainability' },
  { value: 'ordering', label: 'Ordering and Shipping' },
  { value: 'business', label: 'For Business' },
];

const FAQ_GROUPS: FaqGroup[] = [
  {
    category: 'product',
    title: 'Product',
    items: [
      {
        question: (
          <>
            Where does <span className="faq-brand-highlight">PURENorway Water</span> come from?
          </>
        ),
        answer:
          'Our water is sourced from ancient glacial belts in Norway, naturally filtered through marble bedrock over thousands of years.',
      },
      {
        question: 'What flavours are available?',
        answer:
          'We currently offer Still and Sparkling in several varieties, including Strawberry Raspberry, Ginger Lemon, Apple Pear, Green Tea Peach, and Watermelon.',
      },
      {
        question: (
          <>
            Does <span className="faq-brand-highlight">PURENorway</span> contain sugar, sweeteners, or additives?
          </>
        ),
        answer: (
          <>
            No. <span className="faq-brand-highlight">PURENorway</span> contains zero sugar, zero calories, zero sweeteners,
            and zero artificial additives.
          </>
        ),
      },
      {
        question: 'Why aluminum cans instead of plastic bottles?',
        answer:
          'Aluminum is infinitely recyclable without losing quality, keeps water cooler for longer, and avoids plastic leeching risk.',
      },
    ],
  },
  {
    category: 'sustainability',
    title: 'Sustainability',
    items: [
      {
        question: (
          <>
            What is the <span className="faq-brand-highlight">PURENorway</span> Foundation?
          </>
        ),
        answer:
          <>
            The <span className="faq-brand-highlight">PURENorway</span> Foundation is our commitment to ocean health. We
            donate 1% of turnover to projects removing plastic from oceans and protecting marine ecosystems.
          </>,
      },
      {
        question: 'Is your packaging really zero carbon footprint?',
        answer:
          'Our production and distribution run on renewable Norwegian hydroelectric energy, and our aluminum packaging is built for closed-loop recycling.',
      },
      {
        question: (
          <>
            How do I recycle my <span className="faq-brand-highlight">PURENorway Water</span> can?
          </>
        ),
        answer:
          'Rinse and place the can in your local aluminum or metal recycling stream. In Norway, return cans through the pant system.',
      },
    ],
  },
  {
    category: 'ordering',
    title: 'Ordering and Shipping',
    items: [
      {
        question: (
          <>
            Where can I buy <span className="faq-brand-highlight">PURENorway Water</span>?
          </>
        ),
        answer: (
          <>
            You can order directly from our online store at{' '}
            <a href="https://www.purenorwaystore.com" target="_blank" rel="noreferrer">
              purenorwaystore.com
            </a>
            , or find selected regional retailers.
          </>
        ),
      },
      {
        question: 'Do you ship internationally?',
        answer:
          'Yes. We distribute across Norway, UK and France, Middle East, Asia Pacific, and Taiwan. Shipping rates vary by region.',
      },
      {
        question: 'How much does a single can cost?',
        answer: 'A single can retails at NOK 19.90. For wholesale and bulk pricing, contact our team directly.',
      },
    ],
  },
  {
    category: 'business',
    title: 'For Business',
    items: [
      {
        question: (
          <>
            Can I stock <span className="faq-brand-highlight">PURENorway</span> in my store or venue?
          </>
        ),
        answer:
          'Yes. We work with cafes, gyms, hotels, offices, and retailers of all sizes with flexible case ordering and support.',
      },
      {
        question: (
          <>
            Can <span className="faq-brand-highlight">PURENorway</span> come to our event or festival?
          </>
        ),
        answer:
          'We regularly show up at schools, sports events, festivals, and markets. Reach out and we can plan the right setup together.',
      },
      {
        question: 'How do I become a distributor?',
        answer: (
          <>
            Send your region and background to{' '}
            <a href="mailto:post@purenorwaywater.no">post@purenorwaywater.no</a> and we will discuss territory availability.
          </>
        ),
      },
    ],
  },
];
export default function ContactPage() {
  const [activeFaqCategory, setActiveFaqCategory] = useState<FaqCategory>('all');
  const [openFaqId, setOpenFaqId] = useState<string | null>(null);
  const [isMobileRegionAccordion, setIsMobileRegionAccordion] = useState(false);
  const [openRegionId, setOpenRegionId] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width: 768px)');

    const updateRegionLayout = (event?: MediaQueryListEvent) => {
      const matches = event ? event.matches : mediaQuery.matches;
      setIsMobileRegionAccordion(matches);
      if (!matches) {
        setOpenRegionId(null);
      }
    };

    updateRegionLayout();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateRegionLayout);
      return () => mediaQuery.removeEventListener('change', updateRegionLayout);
    }

    mediaQuery.addListener(updateRegionLayout);
    return () => mediaQuery.removeListener(updateRegionLayout);
  }, []);

  const visibleFaqGroups =
    activeFaqCategory === 'all'
      ? FAQ_GROUPS
      : FAQ_GROUPS.filter((group) => group.category === activeFaqCategory);

  const handleFaqCategoryChange = (category: FaqCategory) => {
    setActiveFaqCategory(category);
    setOpenFaqId(null);
  };

  const handleFaqToggle = (faqId: string) => {
    setOpenFaqId((current) => (current === faqId ? null : faqId));
  };

  const handleRegionToggle = (regionId: string) => {
    if (!isMobileRegionAccordion) return;
    setOpenRegionId((current) => (current === regionId ? null : regionId));
  };

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <div className="contact-hero-kicker">GET IN TOUCH</div>
          <h1>
            We'd love to <span className="contact-hero-highlight">hear from you.</span>
          </h1>
          <p>Questions, wholesale enquiries, or just a hello — our team in Kristiansand is ready.</p>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="contact-main-section" id="contact-main-section">
        <div className="contact-main-wrapper">
          {/* Left Side - Contact Details */}
          <div className="contact-left">
            <div className="contact-kicker">CONTACT DETAILS</div>
            <h1 className="contact-title">
              Let's start a <span className="contact-title-highlight">conversation.</span>
            </h1>
            <p className="contact-subtitle">
              Whether you're a customer, a potential distributor, or a journalist - we respond to every message personally.
            </p>

            {/* Contact Info Cards */}
            <div className="contact-details-cards">
              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <MdEmail />
                </div>
                <div className="contact-detail-content">
                  <h3>Email</h3>
                  <a href="mailto:post@purenorway.no" className="contact-detail-link">
                    post@purenorway.no
                  </a>
                  <p className="contact-detail-note">We reply as soon as possible.</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <MdPhone />
                </div>
                <div className="contact-detail-content">
                  <h3>Phone</h3>
                  <a href="tel:+4738123456" className="contact-detail-link">
                    +47 38 12 34 56
                  </a>
                  <p className="contact-detail-note">Mon–Fri, 11:00–15:00 CET</p>
                </div>
              </div>

              <div className="contact-detail-card">
                <div className="contact-detail-icon">
                  <MdLocationOn />
                </div>
                <div className="contact-detail-content">
                  <h3>Headquarters</h3>
                  <p className="contact-detail-link">Kristiansand, Norway NO</p>
                  <p className="contact-detail-note">Agder region</p>
                </div>
              </div>
            </div>

            {/* Social Media Section */}
            <div className="contact-social-sidebar">
              <div className="contact-social-eyebrow">FOLLOW US</div>
              <div className="contact-social-links-sidebar">
                <a
                  href="https://www.instagram.com/purenorwaywaterno/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link-compact instagram"
                  aria-label="Follow us on Instagram"
                >
                  <FaInstagram className="social-icon" />
                  <span className="social-text">Instagram</span>
                </a>
                <a
                  href="https://www.tiktok.com/@purenorwaywaterno"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link-compact tiktok"
                  aria-label="Follow us on TikTok"
                >
                  <FaTiktok className="social-icon" />
                  <span className="social-text">TikTok</span>
                </a>
                <a
                  href="https://www.facebook.com/PureNorwayWaterNO/"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link-compact facebook"
                  aria-label="Follow us on Facebook"
                >
                  <FaFacebookF className="social-icon" />
                  <span className="social-text">Facebook</span>
                </a>
                <a
                  href="https://x.com/PureNorwayNO"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link-compact x"
                  aria-label="Follow us on X (Twitter)"
                >
                  <FaXTwitter className="social-icon" />
                  <span className="social-text">Twitter</span>
                </a>
                <a
                  href="https://www.snapchat.com/add/Purenorwaywater"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link-compact snapchat"
                  aria-label="Follow us on Snapchat"
                >
                  <FaSnapchat className="social-icon" />
                  <span className="social-text">Snapchat</span>
                </a>
                <a
                  href="https://www.linkedin.com/company/purenorwayno"
                  target="_blank"
                  rel="noreferrer"
                  className="social-link-compact linkedin"
                  aria-label="Follow us on LinkedIn"
                >
                  <FaLinkedinIn className="social-icon" />
                  <span className="social-text">LinkedIn</span>
                </a>
              </div>
            </div>
          </div>

          {/* Right Side - Contact Form */}
          <div className="contact-right">
            <div className="contact-form-card" id="contact-form">
              <div className="contact-form-header">
                <h2>Send us a message</h2>
                <p>Fill in the form and we'll get back to you as soon as possible.</p>
              </div>

              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="firstName">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      placeholder="Erik"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="lastName">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      placeholder="Hansen"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="subject">Subject</label>
                  <select id="subject" name="subject" required>
                    <option value="">Select a topic...</option>
                    <option value="general">General Inquiry</option>
                    <option value="business">Business / Wholesale</option>
                    <option value="press">Press / Media</option>
                    <option value="support">Customer Support</option>
                    <option value="partnership">Partnership</option>
                    <option value="others">Others</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    placeholder="Tell us what's on your mind..."
                    required
                  ></textarea>
                </div>

                <button type="submit" className="contact-submit-btn">
                  Send Message
                </button>

                <p className="contact-privacy-note">
                  We respect your privacy. Your details are never shared with third parties.
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <div className="content-wrapper">
        <section className="work-with-us-section">
          <div className="work-with-us-content">
            <div className="work-with-us-header">
              <div className="work-with-us-header-text">
                <div className="work-with-us-kicker">WORK WITH US</div>
                <h2>
                  Let's build something <span className="work-with-us-highlight"> <br /> great together.</span>
                </h2>
              </div>
              <p>
                We're always open to meaningful partnerships - from content creators to global distributors.
              </p>
            </div>

            <div className="work-with-us-grid">
              <article className="work-card">
              <div className="work-card-title-row">
                <div className="work-card-icon"><MdLocalShipping /></div>
                <h3>Stock Pure Norway</h3>
              </div>
              <div className="work-card-tag">RETAIL & STOCKISTS</div>
              <p>
                Cafe, gym, hotel, health store, or office? We'd love to see our cans on your shelves. We make it
                easy to get started with flexible case ordering and dedicated support.
              </p>
              </article>

              <article className="work-card">
                <div className="work-card-title-row">
                  <div className="work-card-icon"><MdLocationOn /></div>
                  <h3>Bring us to your event</h3>
                </div>
                <div className="work-card-tag">EVENTS & STANDS</div>
                <p>
                  Schools, festivals, sports events, markets - we're looking to show up where people are active and
                  curious. Whether you want us as a sponsor or just to have a stand, reach out.
                </p>
              </article>

              <article className="work-card">
                <div className="work-card-title-row">
                  <div className="work-card-icon"><MdGroups /></div>
                  <h3>Let's create together</h3>
                </div>
                <div className="work-card-tag">COLLABORATION</div>
                <p>
                  Got an idea that involves PURENorway Water? A joint campaign, a community project, content, or something
                  we haven't thought of yet - we're open. If it fits our values, we want to hear it.
                </p>
              </article>
            </div>
          </div>
        </section>

      <section className="global-team-section" id="global-team">
        <div className="global-team-inner">
          <div className="global-team-header">
            <div className="global-team-header-text">
              <div className="global-team-eyebrow">OUR GLOBAL TEAM</div>
              <h2>People behind<br /><em>PURENorway Water.</em></h2>
            </div>
            <p>Headquartered in Kristiansand with partners across the world.</p>
          </div>

          {/* HQ Card */}
          <div className="hq-card">
            <div className="hq-left">
              <div className="hq-label">HEADQUARTERS</div>
              <h3>Norway Office</h3>
              <address>
                BigWater<br />
                Skibaasen 28<br />
                4636 Kristiansand, Norway<br /><br />
                <a href="tel:+4738044030">+47 38 04 40 30</a><br />
                <a href="mailto:post@purenorway.no">post@purenorway.no</a><br />
                <a href="https://www.purenorwaywater.com">purenorwaywater.com</a>
              </address>
            </div>
            <div className="hq-person">
              <div className="hq-person-name">David Severinsen</div>
              <div className="hq-person-role">CEO</div>
              <div className="hq-person-links">
                <a href="tel:+4745890684">+47 458 90 684</a>
                <a href="mailto:david@purenorwaywater.com">david@purenorwaywater.com</a>
              </div>
            </div>
            <div className="hq-person">
              <div className="hq-person-name">Øystein Frustøl</div>
              <div className="hq-person-role">Managing Director</div>
              <div className="hq-person-links">
                <a href="tel:+4790915907">+47 909 15 907</a>
                <a href="mailto:oystein@purenorway.no">oystein@purenorway.no</a>
              </div>
            </div>
          </div>

          {/* Regions Grid */}
          <div className="regions-grid">
            <details className="region-card" open={!isMobileRegionAccordion || openRegionId === 'asia-pacific'}>
              <summary className="region-summary" onClick={(event) => {
                if (!isMobileRegionAccordion) {
                  event.preventDefault();
                  return;
                }
                event.preventDefault();
                handleRegionToggle('asia-pacific');
              }}>
                <span className="region-summary-copy">
                  <span className="region-name">ASIA PACIFIC</span>
                  <span className="region-title">Vietnam · Singapore · Taiwan</span>
                </span>
                <span className="region-toggle-icon" aria-hidden="true">+</span>
              </summary>
              <div className="region-contacts">
                <div className="r-person">
                  <div className="r-person-name">BUY2SELL</div>
                  <div className="r-person-company">Vietnam / Singapore</div>
                  <div className="r-links">
                    <a href="mailto:support@buy2sell.vn">support@buy2sell.vn</a>
                  </div>
                </div>
                <div className="r-person">
                  <div className="r-person-name">UFL Shipping Agency</div>
                  <div className="r-person-company">Taiwan</div>
                  <div className="r-links">
                    <a href="tel:+88673389963">+886 7 338 9963</a>
                    <a href="mailto:shippingagency@uni-logistics.com">shippingagency@uni-logistics.com</a>
                  </div>
                </div>
              </div>
            </details>

            <details className="region-card" open={!isMobileRegionAccordion || openRegionId === 'central-europe'}>
              <summary className="region-summary" onClick={(event) => {
                if (!isMobileRegionAccordion) {
                  event.preventDefault();
                  return;
                }
                event.preventDefault();
                handleRegionToggle('central-europe');
              }}>
                <span className="region-summary-copy">
                  <span className="region-name">CENTRAL EUROPE</span>
                  <span className="region-title">Slovakia · Tsjekkia · Serbia</span>
                </span>
                <span className="region-toggle-icon" aria-hidden="true">+</span>
              </summary>
              <div className="region-contacts">
                <div className="r-person">
                  <div className="r-person-name">Waterguard S.R.O</div>
                  <div className="r-person-company">Miroslav Holik</div>
                  <div className="r-links">
                    <a href="tel:+4746505790">+47 465 05 790</a>
                    <a href="mailto:miro@waterguard.sk">miro@waterguard.sk</a>
                    <a href="http://waterguard.sk/">waterguard.sk</a>
                  </div>
                </div>
              </div>
            </details>

            <details className="region-card" open={!isMobileRegionAccordion || openRegionId === 'uk-france'}>
              <summary className="region-summary" onClick={(event) => {
                if (!isMobileRegionAccordion) {
                  event.preventDefault();
                  return;
                }
                event.preventDefault();
                handleRegionToggle('uk-france');
              }}>
                <span className="region-summary-copy">
                  <span className="region-name">EUROPE</span>
                  <span className="region-title">UK / France</span>
                </span>
                <span className="region-toggle-icon" aria-hidden="true">+</span>
              </summary>
              <div className="region-contacts">
                <div className="r-person">
                  <div className="r-person-name">IFL</div>
                  <div className="r-person-company">Chris Smith</div>
                  <div className="r-links">
                    <a href="tel:+447898853171">+44 789 885 3171</a>
                    <a href="mailto:chris@purenorwaywater.com">chris@purenorwaywater.com</a>
                  </div>
                </div>
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="faq-section" id="faq">
        <div className="faq-inner">
          <div className="faq-left">
            <div className="faq-eyebrow">FAQ</div>
            <h2>
              Got questions?<br/>
              <em>We have answers.</em>
            </h2>
            <p>
              Everything you need to know about <span className="faq-brand-highlight">PURENorway Water</span>, from product
              details to business and distribution.
            </p>

            <div className="faq-cats" role="tablist" aria-label="FAQ categories">
              {FAQ_CATEGORIES.map((category) => (
                <button
                  key={category.value}
                  type="button"
                  className={`faq-cat ${activeFaqCategory === category.value ? 'active' : ''}`}
                  onClick={() => handleFaqCategoryChange(category.value)}
                >
                  <span className="faq-cat-dot" aria-hidden="true" />
                  {category.label}
                </button>
              ))}
            </div>

            <div className="faq-contact">
              <p>Cannot find what you are looking for? Our team is happy to help.</p>
              <div className="faq-contact-buttons">
                <button
                  type="button"
                  className="faq-contact-btn"
                  onClick={() => {
                    const chatbotButton = document.querySelector('.chatbot-button') as HTMLButtonElement;
                    if (chatbotButton) chatbotButton.click();
                  }}
                >
                  <IoChatbubble /> Chat with Assistant
                </button>
                <a className="faq-contact-btn" href="#contact-main-section">
                  <MdEmail /> Go to Contact Form
                </a>
              </div>
            </div>
          </div>

          <div className="faq-right">
            {visibleFaqGroups.map((group) => (
              <div key={group.category} className="faq-group" data-cat={group.category}>
                <div className="faq-group-title">{group.title}</div>

                {group.items.map((item, itemIndex) => {
                  const faqId = `${group.category}-${itemIndex}`;
                  const isOpen = openFaqId === faqId;

                  return (
                    <div key={faqId} className={`faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        type="button"
                        className="faq-q"
                        onClick={() => handleFaqToggle(faqId)}
                        aria-expanded={isOpen}
                        aria-controls={`faq-panel-${faqId}`}
                      >
                        <span className="faq-q-text">{item.question}</span>
                        <span className="faq-icon" aria-hidden="true">
                          +
                        </span>
                      </button>
                      <div id={`faq-panel-${faqId}`} className="faq-a">
                        <div className="faq-a-inner">{item.answer}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Media Banner V2 */}
      <section className="social-banner-v2">
        <div className="social-banner-inner">
          <div className="social-banner-top">
            <div>
              <div className="social-banner-eyebrow">FOLLOW ALONG</div>
              <h2>
                We're on all<br />
                <em>the good ones.</em>
              </h2>
            </div>
            <a
              href="https://www.instagram.com/purenorwaywaterno/"
              target="_blank"
              rel="noreferrer"
              className="social-handle-pill"
            >
              <div className="social-handle-avatar" aria-hidden="true">
                <MdWaterDrop />
              </div>
              <div className="social-handle-text">
                <span className="social-handle-label">Our handle</span>
                <span className="social-handle-name">
                  <span>@</span>PURENorwayWaterNO
                </span>
              </div>
            </a>
          </div>

          <div className="social-platforms-grid">
            <a
              href="https://www.instagram.com/purenorwaywaterno/"
              target="_blank"
              rel="noreferrer"
              className="platform-card instagram"
            >
              <div className="platform-icon">
                <FaInstagram />
              </div>
              <div className="platform-info">
                <div className="platform-name">Instagram</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>

            <a
              href="https://www.tiktok.com/@purenorwaywaterno"
              target="_blank"
              rel="noreferrer"
              className="platform-card tiktok"
            >
              <div className="platform-icon">
                <FaTiktok />
              </div>
              <div className="platform-info">
                <div className="platform-name">TikTok</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>

            <a
              href="https://www.facebook.com/PureNorwayWaterNO/"
              target="_blank"
              rel="noreferrer"
              className="platform-card facebook"
            >
              <div className="platform-icon">
                <FaFacebookF />
              </div>
              <div className="platform-info">
                <div className="platform-name">Facebook</div>
                <div className="platform-action">Like</div>
              </div>
            </a>

            <a
              href="https://x.com/PureNorwayNO"
              target="_blank"
              rel="noreferrer"
              className="platform-card x"
            >
              <div className="platform-icon">
                <FaXTwitter />
              </div>
              <div className="platform-info">
                <div className="platform-name">X</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>

            <a
              href="https://www.snapchat.com/add/Purenorwaywater"
              target="_blank"
              rel="noreferrer"
              className="platform-card snapchat"
            >
              <div className="platform-icon">
                <FaSnapchat />
              </div>
              <div className="platform-info">
                <div className="platform-name">Snapchat</div>
                <div className="platform-action">Add us</div>
              </div>
            </a>

            <a
              href="https://www.linkedin.com/company/purenorwayno"
              target="_blank"
              rel="noreferrer"
              className="platform-card linkedin"
            >
              <div className="platform-icon">
                <FaLinkedinIn />
              </div>
              <div className="platform-info">
                <div className="platform-name">LinkedIn</div>
                <div className="platform-action">Follow</div>
              </div>
            </a>
          </div>

          <div className="social-banner-bottom">
            <p>
              Tag us in your posts — <strong>#PureNorwayWater</strong> &amp; <strong>#PureNorway</strong>
            </p>
            <div className="social-hashtags">
              <span className="hashtag-tag">#PureNorwayWater</span>
              <span className="hashtag-tag">#PureNorway</span>
              <span className="hashtag-tag">#PureWater</span>
              <span className="hashtag-tag">#PureNorwayWaterNO</span>
            </div>
          </div>
        </div>
      </section>
      </div>

      <Footer />
    </div>
  );
}
