"use client";

import { useState } from "react";
import Footer from "@/components/layout/footer";
import Home2SectionNewsletter from "@/app/home2/pages/Home2SectionNewsletter";
import "./products.css";

export default function ProductsPage() {
  const [selectedFilter, setSelectedFilter] = useState("all");

  const products = [
    {
      id: 1,
      name: "Smurfene Sparkling Strawberry Raspberry",
      category: "water",
      type: "sparkling",
      description: "Sparkling water with strawberry and raspberry flavors",
      price: "NOK19,90",
      image: "/assets/waterCans/Smurfene_Sparkling_Strawberry_Raspberry.jpeg",
    },
    {
      id: 2,
      name: "Smurfene Sparkling Ginger Lemon",
      category: "water",
      type: "sparkling",
      description: "Refreshing sparkling water with ginger and lemon",
      price: "NOK19,90",
      image: "/assets/waterCans/Smurfene_Sparkling_Ginger_Lemon.jpeg",
    },
    {
      id: 3,
      name: "Smurfene Still",
      category: "water",
      type: "still",
      description: "Pure still water from Norwegian springs",
      price: "NOK19,90",
      image: "/assets/waterCans/Smurfene_Still.jpeg",
    },
    {
      id: 4,
      name: "Sparkling",
      category: "water",
      type: "sparkling",
      description: "Pure sparkling water with natural carbonation",
      price: "NOK19,90",
      image: "/assets/waterCans/Sparkling.jpeg",
    },
    {
      id: 5,
      name: "Sparkling Ginger Lemon",
      category: "water",
      type: "sparkling",
      description: "Refreshing sparkling water with ginger and lemon",
      price: "NOK19,90",
      image: "/assets/waterCans/Sparkling_Ginger_Lemon.jpeg",
    },
    {
      id: 6,
      name: "Smurfene Sparkling Apple Pear",
      category: "water",
      type: "sparkling",
      description: "Crisp sparkling water with apple and pear essence",
      price: "NOK19,90",
      image: "/assets/waterCans/Smurfene_Sparkling_Apple_Pear.jpeg",
    },
    {
      id: 7,
      name: "Sparkling Green Tea Peach",
      category: "water",
      type: "sparkling",
      description: "Energizing sparkling water with green tea and peach",
      price: "NOK19,90",
      image: "/assets/waterCans/Sparkling_Green_Tea_Peach.jpeg",
    },
    {
      id: 8,
      name: "Sparkling Watermelon",
      category: "water",
      type: "sparkling",
      description: "Sweet sparkling water with watermelon flavor",
      price: "NOK19,90",
      image: "/assets/waterCans/Sparkling_Watermelon.jpeg",
    },
    {
      id: 9,
      name: "Still",
      category: "water",
      type: "still",
      description: "Pure still water, naturally refreshing",
      price: "NOK19,90",
      image: "/assets/waterCans/Still.jpeg",
    },
  ];

  const filteredProducts =
    selectedFilter === "all"
      ? products
      : products.filter((p) => p.type === selectedFilter);

  return (
    <div className="products-page">
      {/* Hero Section */}
      <section className="products-hero">
          <div className="products-hero-content">
            <div className="products-hero-kicker">OUR PRODUCTS</div>
            <h1>
              Pure Norwegian water, <span className="products-hero-highlight">in every can.</span>
            </h1>
            <p>Still, sparkling, and flavored options made for daily hydration and a lower footprint.</p>
          </div>
        </section>

        {/* Our Water Our Cans Section */}
        <section className="products-packaging-section">
          <div className="packaging-content">
            <h2>Our Water, Our Cans</h2>
            <p>
              Whether it's <strong>still, carbonated, or flavored water</strong>, we believe every drop deserves packaging just as strong as what's inside. So we chose <strong>aluminum cans</strong>. Lightweight, durable, and built to protect freshness, aluminum keeps water crisp from the first sip to the last. It chills quickly, stays cool longer, and preserves the clean, pure taste inside. And when you're finished, recycle it. <strong>Aluminum is infinitely recyclable</strong> - it can be reused again and again without losing quality. The more aluminum that's recycled, the smaller the footprint, and the greater the impact we can make together. <strong>Pure norwegian water. Packaged responsibly.</strong>
            </p>
            <a href="/about" className="read-more-btn">Read More</a>
          </div>
        </section>

        {/* Marketing Image Section */}
        <section className="products-marketing-section">
          <div className="products-marketing-image-container">
            <div className="products-marketing-image-wrap">
              <img
                src="/assets/marketingImages/marketingProd/peopleFour.jpeg"
                alt="People enjoying Pure Norway water"
                loading="lazy"
              />
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="products-filter">
          <div className="filter-header">
            <h2 className="products-filter-title">Our Flavours</h2>
            <div className="filter-buttons">
              <button
                className={`filter-btn ${selectedFilter === "all" ? "active" : ""}`}
                onClick={() => setSelectedFilter("all")}
              >
                All
              </button>
              <button
                className={`filter-btn ${selectedFilter === "sparkling" ? "active" : ""}`}
                onClick={() => setSelectedFilter("sparkling")}
              >
                Sparkling
              </button>
              <button
                className={`filter-btn ${selectedFilter === "still" ? "active" : ""}`}
                onClick={() => setSelectedFilter("still")}
              >
                Still
              </button>
            </div>
          </div>
        </section>

        {/* Products Grid */}
        <section className="products-grid-section">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <div key={product.id} className="product-card">
                <div className="product-image">
                  <img src={product.image} alt={product.name} loading="lazy" />
                </div>
                <div className="product-info">
                  <span className={`product-badge product-badge-${product.type}`}>
                    {product.type === "sparkling" ? "Sparkling" : "Still"}
                  </span>
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <div className="product-nutrition">
                    <span>0 Sugar</span>
                    <span>0 Calories</span>
                  </div>
                  <div className="product-footer">
                    <div className="price-group">
                      <span className="price">{product.price}</span>
                      <span className="case-price">NOK477,60 (24x)</span>
                    </div>
                    <a
                      className="add-to-cart-btn"
                      href="https://www.purenorwaystore.com/butikk/water"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Buy Here
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="products-business-section">
          <div className="business-grid">
            <div className="business-left">
              <p className="business-kicker">FOR BUSINESSES</p>
              <h2 className="business-title">Stock up.<br />Save more.</h2>
              <p className="business-copy">
                Restaurants, hotels, offices, retail — competitive pricing and global distributor support.
              </p>

              <div className="business-cta-group">
                <a href="/contact" className="business-cta business-cta-primary">Get in Touch</a>
                <a href="/about" className="business-cta business-cta-secondary">Learn More</a>
              </div>
            </div>

            <div className="business-right">
              <div className="business-card">
                <div className="business-card-content">
                  <h3 className="business-card-title">Per Single Can</h3>
                  <p className="business-card-subtitle">Any flavour </p>
                </div>
                <span className="business-card-value">8kr + 2kr pant</span>
              </div>

              <div className="business-card">
                <div className="business-card-content">
                  <h3 className="business-card-title">24-Can Case</h3>
                  <p className="business-card-subtitle">Any mix · the more you buy, the more you save</p>
                </div>
                <span className="business-card-value">477kr</span>
              </div>

              <div className="business-card">
                <div className="business-card-content">
                  <h3 className="business-card-title">Custom Order</h3>
                  <p className="business-card-subtitle">MOQ · Wholesale pricing · contact for deals</p>
                </div>
                <span className="business-card-value">Contact</span>
              </div>
            </div>
          </div>
        </section>

      <section className="products-newsletter-section">
        <Home2SectionNewsletter />
      </section>

      <Footer />
    </div>
  );
}
