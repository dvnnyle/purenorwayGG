import "./ProductMerchSection.css";

type MerchItem = {
  id: string;
  name: string;
  subtitle: string;
  image: string;
  featured?: boolean;
  label?: string;
};

const merchItems: MerchItem[] = [
  {
    id: "thermos-featured",
    name: "PURENorway Thermos",
    subtitle: "Keep it cold · Keep it pure",
    image: "/assets/merch/bottle16_9.jpeg",
    featured: true,
    label: "Hero item",
  },
  {
    id: "backpack",
    name: "Explorer Backpack",
    subtitle: "Adventure ready",
    image: "/assets/merch/backpack16_9.jpeg",
  },
  {
    id: "tote",
    name: "I CARE Tote",
    subtitle: "Organic cotton",
    image: "/assets/merch/bottle16_9.jpeg",
  },
  {
    id: "food-box",
    name: "Nordic Food Box",
    subtitle: "Meal prep in style",
    image: "/assets/merch/foodBox16_9.jpeg",
  },
  {
    id: "bottle",
    name: "Pure Water Bottle",
    subtitle: "Reusable · BPA free",
    image: "/assets/merch/backpack16_9.jpeg",
  },
];

export default function ProductMerchSection() {
  return (
    <section className="products-merch-section" aria-label="Pure Norway merch">
      <div className="products-merch-inner">
        <div className="products-merch-header-row">
          <div>
            <p className="products-merch-eyebrow">Merch</p>
            <h2>
              Gear up.<br />
              <em>Give back.</em>
            </h2>
          </div>
          <a href="https://www.purenorwaystore.com/butikk/water" target="_blank" rel="noopener noreferrer" className="products-merch-shop-btn">
            Shop Now
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </a>
        </div>

        <div className="products-merch-bento-grid">
          {merchItems.map((item) => (
            <a
              key={item.id}
              href="/contact"
              className={`products-merch-bento-card${item.featured ? " is-featured" : ""}`}
            >
              <div className="products-merch-bento-image-wrap">
                <img src={item.image} alt={item.name} className="products-merch-bento-image" loading="lazy" />
              </div>
              <div className="products-merch-bento-body">
                <p className="products-merch-bento-name">{item.name}</p>
                <p className="products-merch-bento-subtitle">{item.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
