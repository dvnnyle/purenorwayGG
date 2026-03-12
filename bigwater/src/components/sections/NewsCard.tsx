import "./NewsCard.css";
import type { NewsArticle } from "@/lib/newsService";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
}

export default function NewsCard({ article }: NewsCardProps) {
  return (
    <div
      className="post-card"
      style={{
        backgroundImage: article.imageUrl
          ? `url(${article.imageUrl})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="post-card-overlay" />
      <span className="post-tag">{article.category}</span>
      <div className="post-card-content">
        <h3>{article.title}</h3>
        <p>{article.excerpt}</p>
        <div className="post-meta">
          <span className="post-author">{article.author}</span>
          <span className="post-meta-separator">•</span>
          <span className="post-date">{article.date}</span>
        </div>
      </div>
    </div>
  );
}
