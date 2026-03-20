import Image from "next/image";
import worldMapBlue from "./hexamap/wMap.png";
import "./map.css";

export default function MapPage() {
  return (
    <main className="hex-world-page">
      <section className="hex-world-shell" aria-label="World map">
        <Image
          src={worldMapBlue}
          alt="World map"
          className="hex-world-map"
          priority
        />
      </section>
    </main>
  );
}
