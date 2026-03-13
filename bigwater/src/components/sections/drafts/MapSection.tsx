"use client";

import { useState } from "react";
import Image from "next/image";
import mapImage from "@/app/map/hexamap/world_map.webp";
import "./map.css";

const locationBadges = [
  {
    id: "norway",
    name: "Norway",
    label: "HQ",
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

export default function MapSection() {
  const [activeLocationId, setActiveLocationId] = useState("norway");
  const showAll = activeLocationId === "all";
  const activeLocation =
    locationBadges.find((location) => location.id === activeLocationId) ??
    locationBadges[0];
  const visibleBadges = showAll ? locationBadges : [activeLocation];

  return (
    <section className="map-section">
      <div className="map-section-container">
        <div className="map-section-header">
          <p className="map-section-kicker">GLOBAL PRESENCE</p>
          <h2>Our Impact Map</h2>
          <p className="map-section-description">
            Pure Norway's initiatives reaching communities worldwide
          </p>
        </div>

        <div className="map-location-menu" role="tablist" aria-label="Choose location">
          <button
            type="button"
            role="tab"
            aria-selected={showAll}
            className={`map-location-btn${showAll ? " is-active" : ""}`}
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
                className={`map-location-btn${isActive ? " is-active" : ""}`}
                onClick={() => setActiveLocationId(location.id)}
              >
                {location.name}
              </button>
            );
          })}
        </div>

        <div className="map-image-wrapper">
          <Image
            src={mapImage}
            alt="Global impact map showing Pure Norway's reach"
            priority
            className="map-image"
          />

          <div className="map-badge-layer" aria-hidden="true">
            {visibleBadges.map((badge) => (
              <div
                key={badge.id}
                className="map-badge"
                style={{
                  top: badge.top,
                  left: badge.left,
                  ["--offset-x" as string]: badge.offsetX,
                  ["--offset-y" as string]: badge.offsetY,
                }}
              >
                <span className="map-badge-card">
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
