"use client";

import { useState } from "react";
import Image from "next/image";
import mapImage from "@/app/map/mapv2.png";
import "./mapAlt3.css";

const locationBadges = [
  {
    id: "norway",
    name: "Norway",
    label: "Headquarters",
    top: "35%",
    left: "41%",
    offsetX: "44px",
    offsetY: "-78px",
  },
  {
    id: "taiwan",
    name: "Taiwan",
    label: "APAC Distribution",
    top: "52%",
    left: "98%",
    offsetX: "-120px",
    offsetY: "-38px",
  },
  {
    id: "singapore",
    name: "Singapore",
    label: "APAC Distribution",
    top: "65%",
    left: "90%",
    offsetX: "-120px",
    offsetY: "-8px",
  },
  {
    id: "vietnam",
    name: "Vietnam",
    label: "APAC Distribution",
    top: "60%",
    left: "93%",
    offsetX: "-120px",
    offsetY: "-24px",
  },
  {
    id: "slovakia",
    name: "Slovakia",
    label: "Central Europe",
    top: "65%",
    left: "44%",
    offsetX: "120px",
    offsetY: "-38px",
  },
  {
    id: "tsjekkia",
    name: "Tsjekkia",
    label: "Central Europe",
    top: "62%",
    left: "60%",
    offsetX: "-110px",
    offsetY: "-38px",
  },
  {
    id: "serbia",
    name: "Serbia",
    label: "South East Europe",
    top: "72%",
    left: "44%",
    offsetX: "120px",
    offsetY: "-10px",
  },
  {
    id: "dubai",
    name: "Dubai",
    label: "Middle East Hub",
    top: "50%",
    left: "55%",
    offsetX: "120px",
    offsetY: "30px",
  },
  {
    id: "uk",
    name: "UK",
    label: "Regional Distribution",
    top: "43%",
    left: "52%",
    offsetX: "-120px",
    offsetY: "-92px",
  },
  {
    id: "france",
    name: "France",
    label: "Europe Coverage",
    top: "43%",
    left: "52%",
    offsetX: "-138px",
    offsetY: "-4px",
  },
];

export default function MapSectionAlt3() {
  const [activeLocationId, setActiveLocationId] = useState("all");
  const showAll = activeLocationId === "all";
  const activeLocation =
    locationBadges.find((location) => location.id === activeLocationId) ??
    locationBadges[0];
  const visibleBadges = showAll ? locationBadges : [activeLocation];

  return (
    <section className="map-alt3-section">
      <div className="map-alt3-container">
        <div className="map-alt3-header">
          <p className="map-alt3-kicker">GLOBAL REACH</p>
          <h2>Available Across the World</h2>
          <p className="map-alt3-description">
            Discover where PURE Norway Water is available around the world.
          </p>
        </div>

        <div className="map-alt3-menu" role="tablist" aria-label="Choose location">
          <button
            type="button"
            role="tab"
            aria-selected={showAll}
            className={`map-alt3-btn${showAll ? " is-active" : ""}`}
            onClick={() => setActiveLocationId("all")}
          >
            All
          </button>
          {locationBadges.map((location) => {
            const isActive = !showAll && location.id === activeLocation.id;

            return (
              <button
                key={location.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`map-alt3-btn${isActive ? " is-active" : ""}`}
                onClick={() => setActiveLocationId(location.id)}
              >
                {location.name}
              </button>
            );
          })}
        </div>

        <div className="map-alt3-image-wrapper">
          <Image
            src={mapImage}
            alt="Global impact map alternative 3"
            priority
            className="map-alt3-image"
          />

          <div className="map-alt3-badge-layer" aria-hidden="true">
            {visibleBadges.map((badge) => (
              <div
                key={badge.id}
                className={`map-alt3-badge${showAll && badge.id === "norway" ? " is-priority" : ""}`}
                style={{
                  top: badge.top,
                  left: badge.left,
                  ["--offset-x" as string]: badge.offsetX,
                  ["--offset-y" as string]: badge.offsetY,
                }}
              >
                <span className="map-alt3-badge-card">
                  <strong>{badge.name}</strong>
                  <small>{badge.label}</small>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
