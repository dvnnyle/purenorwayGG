'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { getPublishedNewsArticles, resolveNewsArticleSlug, type NewsArticle } from '@/lib/newsService';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import './blogCarousel.css';

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  backgroundImage: string;
  category: string;
}

function mapArticleToBlogPost(article: NewsArticle): BlogPost {
  const slug = resolveNewsArticleSlug(article);

  return {
    id: article.id ?? article.slug ?? slug,
    slug,
    title: article.title,
    excerpt: article.excerpt,
    date: article.date,
    backgroundImage:
      article.imageUrl ||
      '/assets/marketingImages/480355058_645489551399318_5956170283212886069_n.jpg',
    category: article.category,
  };
}

export default function BlogCarousel() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    const loadBlogPosts = async () => {
      const articles = await getPublishedNewsArticles();
      setBlogPosts(articles.map(mapArticleToBlogPost));
    };

    loadBlogPosts();
  }, []);

  const sliderPosts = useMemo(() => {
    if (blogPosts.length === 0) {
      return [];
    }

    // Duplicate list to keep the continuous autoplay feel with looped slides.
    return [...blogPosts, ...blogPosts];
  }, [blogPosts]);

  return (
    <div className="blog-carousel-wrapper">
      <div className="blog-carousel-header">
        <div className="blog-carousel-divider" aria-hidden="true">
          <span className="seg red" style={{ flex: 3 }} />
          <span className="seg white" />
          <span className="seg blue" style={{ flex: 1 }} />
          <span className="seg white" />
          <span className="seg red" style={{ flex: 3 }} />
        </div>
        <h2 className="blog-carousel-title">Stories & Insights</h2>
        <p className="blog-carousel-copy">
          Explore our sustainability and innovation journey.
        </p>
        <Link href="/news" className="blog-carousel-all-link">
          View all articles <span aria-hidden="true">→</span>
        </Link>
      </div>
      <Swiper
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={20}
        slidesPerView={1}
        centeredSlides={false}
        loop={blogPosts.length > 1}
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={false}
        breakpoints={{
          480: {
            slidesPerView: 1.35,
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2.1,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        className="blog-swiper"
      >
        {sliderPosts.map((post, index) => (
          <SwiperSlide key={index} className="blog-slide">
            <Link
              href={post.slug ? `/news/article?slug=${encodeURIComponent(post.slug)}` : '/news'}
              className="blog-card-link"
              aria-label={`Read article: ${post.title}`}
            >
              <article
                className="blog-card"
                style={{
                  backgroundImage: `linear-gradient(135deg, rgba(13, 25, 37, 0.6) 0%, rgba(13, 25, 37, 0.4) 100%), url(${post.backgroundImage})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              >
                <div className="blog-card-content">
                  <h3>{post.title}</h3>
                  <span className="blog-date">{post.date}</span>
                </div>
              </article>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
