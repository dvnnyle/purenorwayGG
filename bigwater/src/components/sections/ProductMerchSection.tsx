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
          <span className="products-merch-coming-pill">Shop opening soon</span>
        </div>

        <div className="products-merch-bento-grid">
          {merchItems.map((item) => (
            <a
              key={item.id}
              href="/contact"
              className={`products-merch-bento-card${item.featured ? " is-featured" : ""}`}
            >
              {item.featured ? (
                <span className="products-merch-bento-tag">{item.label}</span>
              ) : null}
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
