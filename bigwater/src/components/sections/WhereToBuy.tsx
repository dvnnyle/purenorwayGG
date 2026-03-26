import "./WhereToBuy.css";
import Link from "next/link";

type Stockist = {
  id: string;
  name: string;
  href: string;
  logo?: string;
};

const stockists: Stockist[] = [
  {
    id: "house-of-norway",
    name: "House of Norway",
    href: "#",
    logo: "/assets/whereToBuy/houseofnorway-logo-min.png.webp",
  },
  {
    id: "kaffe-pasta",
    name: "Kaffe & Pasta",
    href: "#",
    logo: "/assets/whereToBuy/kaffePasta.png",
  },
  {
    id: "playworld",
    name: "Playworld",
    href: "#",
    logo: "/assets/whereToBuy/Playworld-Extended.png",
  },
  {
    id: "gaardsutsalget",
    name: "Gårdsutsalget",
    href: "#",
    logo: "/assets/whereToBuy/gaardsutsalget-logo-png.webp",
  },
  {
    id: "hos-naboen",
    name: "Hos Naboen",
    href: "#",
    logo: "/assets/whereToBuy/Logo-Hos-Naboen.png",
  },
];

export default function WhereToBuy() {
  return (
    <section className="wtb-section">
      <div className="wtb-inner">

        <div className="wtb-header">
          <div className="wtb-left">
            <div className="wtb-eyebrow">Stockists</div>
            <h2 className="wtb-title">
              Find us <em>in store.</em>
            </h2>
          </div>
          <p className="wtb-sub">
            Currently available at 5 locations across Norway. More coming soon.
          </p>
        </div>

        <div className="wtb-logos">
          {stockists.map((stockist) => (
            <a
              key={stockist.id}
              href={stockist.href}
              className="wtb-logo-item"
              target={stockist.href.startsWith("http") ? "_blank" : undefined}
              rel={stockist.href.startsWith("http") ? "noopener noreferrer" : undefined}
            >
              {stockist.logo ? (
                <img src={stockist.logo} alt={stockist.name} className="wtb-logo-img" />
              ) : (
                <div className="wtb-logo-placeholder">
                  <div className="wtb-logo-box" />
                  <span className="wtb-logo-name">{stockist.name}</span>
                </div>
              )}
            </a>
          ))}
        </div>

        <div className="wtb-bottom">
          <p className="wtb-bottom-note">
            <strong>Want to carry Pure Norway Water?</strong> We&apos;d love to work with you.
          </p>
          <Link href="/contact" className="wtb-link">
            Become a stockist →
          </Link>
        </div>

      </div>
    </section>
  );
}
