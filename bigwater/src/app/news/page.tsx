"use client";

import { useState, useEffect } from "react";
import "./news.css";
import NewsCard from "@/components/sections/NewsCard";
import { getPublishedNewsArticles } from "@/lib/newsService";
import type { NewsArticle } from "@/lib/newsService";
import Footer from "@/components/layout/footer";
import Home2SectionNewsletter from "@/app/home2/pages/Home2SectionNewsletter";
import { FaInstagram, FaTiktok, FaFacebookF, FaXTwitter, FaLinkedinIn, FaSnapchat } from 'react-icons/fa6';
import { MdWaterDrop } from 'react-icons/md';

export default function NewsPage() {
  const INITIAL_VISIBLE = 12;
  const LOAD_STEP = 12;

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  useEffect(() => {
    const loadArticles = async () => {
      const data = await getPublishedNewsArticles();
      setArticles(data);
      setLoading(false);
    };
    loadArticles();
  }, []);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE);
  }, [articles.length]);

  const visibleArticles = articles.slice(0, visibleCount);
  const hasMoreArticles = articles.length > visibleCount;

  const handleLoadMore = () => {
    setVisibleCount((prev) => Math.min(prev + LOAD_STEP, articles.length));
  };

  return (
    <div className="news-page">
      <div className="news-hero">
        <div className="news-hero-content">
          <div className="news-hero-kicker">OUR STORIES</div>
          <h1>
            News & <span className="news-hero-highlight">Updates</span>
          </h1>
          <p>
            Stay updated with the latest stories from PURENorway. From
            sustainability initiatives to new product launches, discover how
            we&apos;re making a difference one can at a time.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="news-main">
        {loading ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6B8090' }}>
            Loading articles...
          </div>
        ) : articles.length === 0 ? (
          <div style={{ padding: '80px 20px', textAlign: 'center', color: '#6B8090' }}>
            No articles published yet. Check back soon!
          </div>
        ) : (
          <>
            <div className="news-grid-header">
              <div className="news-grid-eyebrow">News Feed</div>
              <h2 className="news-grid-title">
                Latest Stories From <span className="news-grid-title-highlight">PURENorway</span>
              </h2>
            </div>
            <div className="posts-grid">
              {visibleArticles.map((article) => (
                <NewsCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More */}
            {hasMoreArticles && (
              <div className="load-more">
                <button className="load-btn" onClick={handleLoadMore}>
                  Load more posts
                </button>
              </div>
            )}
          </>
        )}
      </div>

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

      {/* Newsletter Section */}
      <section className="news-newsletter-section">
        <Home2SectionNewsletter />
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
