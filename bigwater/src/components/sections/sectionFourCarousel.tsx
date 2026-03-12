"use client";

import { Autoplay, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import './sectionFourCarousel.css';

const productSlides = [
  { src: '/assets/products/ginger.png', title: 'Ginger' },
  { src: '/assets/products/green.png', title: 'Green' },
  { src: '/assets/products/orange.png', title: 'Orange' },
  { src: '/assets/products/spark.png', title: 'Spark' },
  { src: '/assets/products/still.png', title: 'Still' },
  { src: '/assets/products/waterm.png', title: 'Waterm' },
];

export default function SectionFourCarousel() {
  const slides = [...productSlides, ...productSlides];

  return (
    <div className="section-four">
      <div className="section-four-header">
        <div className="section-four-eyebrow">Our Products</div>
        <h2 className="section-four-title">Experience the flavour, taste the adventure</h2>
        <p className="section-four-copy">
          Each flavour combination has been carefully developed to complement the fresh water taste.
        </p>
      </div>

      <Swiper
        modules={[Pagination, Autoplay]}
        className="section-four-swiper"
        centeredSlides
        slideToClickedSlide
        grabCursor
        slidesPerView={5}
        spaceBetween={-80}
        loop
        autoplay={{
          delay: 2800,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: false,
        }}
        breakpoints={{
          0: {
            slidesPerView: 1.35,
            spaceBetween: -10,
          },
          640: {
            slidesPerView: 2.1,
            spaceBetween: -30,
          },
          1024: {
            slidesPerView: 5,
            spaceBetween: -80,
          },
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={`${slide.title}-${index}`}>
            <div className="section-four-slide-content">
              <img src={slide.src} alt={slide.title} loading="lazy" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
