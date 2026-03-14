"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";
import type { NewsArticle } from "@/lib/newsService";
import { getPublishedNewsArticles } from "@/lib/newsService";
import Footer from "@/components/layout/footer";
import "../[slug]/article.css";

const NEWS_CACHE_KEY = "purenorway:published-news:v1";
const NEWS_CACHE_TTL_MS = 1000 * 60 * 10;

function readCachedArticles(): NewsArticle[] {
  if (typeof window === "undefined") return [];

  try {
    const raw = window.localStorage.getItem(NEWS_CACHE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as { timestamp?: number; articles?: NewsArticle[] };
    const timestamp = parsed?.timestamp ?? 0;
    const isFresh = Date.now() - timestamp < NEWS_CACHE_TTL_MS;

    if (!isFresh || !Array.isArray(parsed?.articles)) {
      return [];
    }

    return parsed.articles;
  } catch {
    return [];
  }
}

function writeCachedArticles(articles: NewsArticle[]) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.setItem(
      NEWS_CACHE_KEY,
      JSON.stringify({ timestamp: Date.now(), articles })
    );
  } catch {
    // Ignore storage errors (private mode/quota) and continue with network data.
  }
}

type ContentBlock =
  | { type: "h2"; text: string }
  | { type: "quote"; text: string }
  | { type: "pull-quote"; text: string; cite?: string }
  | { type: "image"; src: string; caption?: string }
  | { type: "paragraph"; text: string };

function toContentBlocks(content?: string): ContentBlock[] {
  if (!content?.trim()) {
    return [];
  }

  return content
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) => {
      if (block.startsWith("## ")) {
        return { type: "h2", text: block.replace(/^##\s+/, "") } as ContentBlock;
      }

      const imageMatch = block.match(/^!\[(.*?)\]\((.*?)\)$/);
      if (imageMatch) {
        const [, caption, src] = imageMatch;
        return {
          type: "image",
          src: src.trim(),
          caption: caption.trim() || undefined,
        } as ContentBlock;
      }

      if (block.startsWith(">>> ")) {
        const lines = block.split("\n").map((line) => line.trim()).filter(Boolean);
        const quoteText = lines[0].replace(/^>>>\s+/, "").trim();
        const citeLine = lines.find((line, index) => index > 0 && /^--\s+/.test(line));

        return {
          type: "pull-quote",
          text: quoteText,
          cite: citeLine ? citeLine.replace(/^--\s+/, "").trim() : undefined,
        } as ContentBlock;
      }

      if (block.startsWith("> ")) {
        return { type: "quote", text: block.replace(/^>\s+/, "") } as ContentBlock;
      }

      return { type: "paragraph", text: block } as ContentBlock;
    });
}

function formatDateToDisplay(dateValue?: string): string {
  if (!dateValue) return "";

  const isoMatch = dateValue.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [, year, month, day] = isoMatch;
    return `${day}.${month}.${year}`;
  }

  const parsedDate = new Date(dateValue);
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(parsedDate).replace(/\//g, ".");
}

function getAuthorInitials(author: string): string {
  const parts = author.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "PN";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
}

export default function NewsArticlePage() {
  const searchParams = useSearchParams();
  const slugParam = searchParams.get("slug") ?? "";
  const slug = useMemo(() => {
    try {
      return decodeURIComponent(slugParam);
    } catch {
      return slugParam;
    }
  }, [slugParam]);

  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const cachedArticles = readCachedArticles();
    if (cachedArticles.length > 0) {
      setArticles(cachedArticles);
      setLoading(false);
    }

    const load = async () => {
      const data = await getPublishedNewsArticles();
      setArticles(data);
      writeCachedArticles(data);
      setLoading(false);
      setHasFetched(true);
    };

    load().catch(() => {
      setLoading(false);
      setHasFetched(true);
    });
  }, []);

  const article = useMemo(
    () => articles.find((item) => item.slug === slug || item.id === slug),
    [articles, slug]
  );

  const relatedArticles = useMemo(
    () =>
      articles
        .filter((item) => item.slug !== slug && item.id !== slug)
        .slice(0, 3),
    [articles, slug]
  );

  const blocks = useMemo(() => toContentBlocks(article?.content), [article?.content]);
  const articleDisplayDate = formatDateToDisplay(article?.date);

  if (!article) {
    if (loading || !hasFetched) {
      return (
        <main className="news-article-page" aria-label="Loading article" aria-busy="true">
          <section className="news-article-skeleton-hero" aria-hidden="true">
            <div className="news-article-skeleton-hero-inner">
              <div className="news-article-skeleton-pill" />
              <div className="news-article-skeleton-title" />
              <div className="news-article-skeleton-title news-article-skeleton-title-short" />
              <div className="news-article-skeleton-subtitle" />
            </div>
          </section>

          <section className="news-article-skeleton-body" aria-hidden="true">
            <div className="news-article-skeleton-author-strip">
              <div className="news-article-skeleton-avatar" />
              <div className="news-article-skeleton-author-lines">
                <div className="news-article-skeleton-line news-article-skeleton-line-name" />
                <div className="news-article-skeleton-line news-article-skeleton-line-role" />
              </div>
            </div>

            <div className="news-article-skeleton-prose">
              <div className="news-article-skeleton-line news-article-skeleton-line-paragraph" />
              <div className="news-article-skeleton-line news-article-skeleton-line-paragraph" />
              <div className="news-article-skeleton-line news-article-skeleton-line-paragraph-short" />
              <div className="news-article-skeleton-image" />
              <div className="news-article-skeleton-line news-article-skeleton-line-paragraph" />
              <div className="news-article-skeleton-line news-article-skeleton-line-paragraph-short" />
            </div>
          </section>
        </main>
      );
    }

    return (
      <main className="news-article-page">
        <div className="news-article-empty">
          <p>Article not found.</p>
          <Link href="/news">Back to News</Link>
        </div>
      </main>
    );
  }

  const currentArticle = article as NewsArticle;

  return (
    <main className="news-article-page">
      <header className="news-article-hero">
        {currentArticle.imageUrl ? (
          <img src={currentArticle.imageUrl} alt={currentArticle.title} className="news-article-hero-image" />
        ) : null}
        <div className="news-article-hero-overlay" />
        <div className="news-article-hero-content">
          <div className="news-article-hero-inner">
            <div className="news-article-meta-row">
              <span className="news-article-tag">{currentArticle.category}</span>
              <span>{articleDisplayDate} · {currentArticle.author}</span>
            </div>
            <h1>{currentArticle.title}</h1>
            <p>{currentArticle.excerpt}</p>
          </div>
        </div>
      </header>

      <article className="news-article-body">
        <div className="news-article-author-strip">
          <div className="news-article-author">
            <div className="news-article-avatar" aria-hidden="true">
              {getAuthorInitials(currentArticle.author)}
            </div>
            <div>
              <div className="news-article-author-name">{currentArticle.author}</div>
              <div className="news-article-author-role">PURENorway Water</div>
            </div>
          </div>

          <div className="news-article-share-row">
            <span className="news-article-share-label">Share</span>
            <button type="button" className="news-article-share-btn" aria-label="Share on X">
              <FaXTwitter />
            </button>
            <button type="button" className="news-article-share-btn" aria-label="Share on LinkedIn">
              <FaLinkedinIn />
            </button>
            <button type="button" className="news-article-share-btn" aria-label="Share on Instagram">
              <FaInstagram />
            </button>
          </div>
        </div>

        <div className="news-article-prose">
          {blocks.length > 0 ? (
            (() => {
              let headingCount = 0;

              return blocks.map((block, index) => {
                if (block.type === "h2") {
                  headingCount += 1;
                  const headingClass =
                    headingCount === 1
                      ? "news-article-section-title news-article-main-title"
                      : "news-article-section-title news-article-secondary-title";

                  return (
                    <h2 key={`${block.type}-${index}`} className={headingClass}>
                      {block.text}
                    </h2>
                  );
                }

                if (block.type === "quote") {
                  return (
                    <blockquote key={`${block.type}-${index}`}>
                      <p>{block.text}</p>
                    </blockquote>
                  );
                }

                if (block.type === "pull-quote") {
                  return (
                    <div className="news-article-pull-quote" key={`${block.type}-${index}`}>
                      <p>{block.text}</p>
                      {block.cite ? <cite>- {block.cite}</cite> : null}
                    </div>
                  );
                }

                if (block.type === "image") {
                  return (
                    <figure className="news-article-image" key={`${block.type}-${index}`}>
                      <img src={block.src} alt={block.caption || "Article image"} />
                      {block.caption ? <figcaption>{block.caption}</figcaption> : null}
                    </figure>
                  );
                }

                return <p key={`${block.type}-${index}`}>{block.text}</p>;
              });
            })()
          ) : (
            <p>{currentArticle.excerpt}</p>
          )}
        </div>
      </article>

      {relatedArticles.length > 0 ? (
        <section className="news-related">
          <h2>More Stories</h2>
          <div className="news-related-grid">
            {relatedArticles.map((related) => {
              const relatedSlug = related.slug || related.id;
              const relatedHref = relatedSlug
                ? `/news/article?slug=${encodeURIComponent(relatedSlug)}`
                : "/news";

              return (
                <Link
                  key={related.id ?? related.slug}
                  href={relatedHref}
                  className="news-related-card"
                >
                  {related.imageUrl ? (
                    <img src={related.imageUrl} alt={related.title} className="news-related-image" />
                  ) : null}
                  <div className="news-related-content">
                    <span>{related.category}</span>
                    <h3>{related.title}</h3>
                    <p>{formatDateToDisplay(related.date)} · {related.author}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      ) : null}

      <Footer />
    </main>
  );
}
