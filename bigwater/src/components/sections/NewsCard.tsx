import "./NewsCard.css";
import Link from "next/link";
import type { NewsArticle } from "@/lib/newsService";

interface NewsCardProps {
  article: NewsArticle;
  featured?: boolean;
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

export default function NewsCard({ article }: NewsCardProps) {
  const slug = article.slug || article.id;
  const articleHref = slug ? `/news/${encodeURIComponent(slug)}` : "/news";

  return (
    <Link href={articleHref} className="post-card-link" aria-label={`Read article: ${article.title}`}>
      <article className="post-card">
        {article.imageUrl ? (
          <img src={article.imageUrl} alt={article.title} className="post-card-image" />
        ) : null}
        <div className="post-card-content">
          <span className="post-tag">{article.category}</span>
          <h3>{article.title}</h3>
          <p>{formatDateToDisplay(article.date)} · {article.author}</p>
        </div>
      </article>
    </Link>
  );
}
