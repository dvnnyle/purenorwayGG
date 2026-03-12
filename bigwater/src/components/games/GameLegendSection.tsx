import Image from "next/image";
import "./gameLegendSection.css";

import sponBobImage from "./background/sponBob.png";
import nemoImage from "./miniGameAssets/fish_nemo.png";
import turtleImage from "./miniGameAssets/fish_turtle.png";
import doryImage from "./miniGameAssets/fish_dory.png";
import patStarImage from "./background/patStar.png";
import strawImage from "./miniGameAssets/thrash_straw.png";
import bottleImage from "./miniGameAssets/thrash_bottle.png";
import bagImage from "./miniGameAssets/thrash_bag.png";
import ringImage from "./miniGameAssets/thrash_ring.png";
import collectCanImage from "./miniGameAssets/collectable_icon/collect_can.png";
import collectCan2Image from "./miniGameAssets/collectable_icon/collect_can2.png";
import collectCan3Image from "./miniGameAssets/collectable_icon/collect_can3.png";
import collectCan4Image from "./miniGameAssets/collectable_icon/collect_can4.png";

const fishItems = [
  { label: "Nemo", src: nemoImage },
  { label: "Turtle", src: turtleImage },
  { label: "Dory", src: doryImage },
  { label: "Pat Star", src: patStarImage },
];

const trashItems = [
  { label: "SpongeBob", src: sponBobImage },
  { label: "Straw", src: strawImage },
  { label: "Bottle", src: bottleImage },
  { label: "Bag", src: bagImage },
  { label: "Ring", src: ringImage },
];

const collectableItems = [
  { label: "Can 1", src: collectCanImage },
  { label: "Can 2", src: collectCan2Image },
  { label: "Can 3", src: collectCan3Image },
  { label: "Can 4", src: collectCan4Image },
];

export default function GameLegendSection() {
  return (
    <section className="game-legend" aria-label="Game characters">
      <div className="legend-top">
        <div className="legend-eyebrow">How to play</div>
        <div className="legend-title">
          Know your <em>ocean friends</em> and foes
        </div>
      </div>

      <div className="legend-cards">
        <article className="legend-card legend-card-trash">
          <div className="legend-icon-wrap">
            <Image src={bottleImage} alt="Trash" width={52} height={52} className="legend-main-icon" />
          </div>
          <div className="legend-card-name">Trash</div>
          <p className="legend-card-desc">Pollutants drifting through the ocean. Click fast and clean them all.</p>
          <span className="legend-badge">Click to remove</span>
          <div className="legend-items">
            {trashItems.map((item) => (
              <span key={item.label} className="legend-tag" aria-label={item.label} title={item.label}>
                <Image src={item.src} alt={item.label} width={36} height={36} className="legend-tag-icon" />
              </span>
            ))}
          </div>
        </article>

        <article className="legend-card legend-card-collect">
          <div className="legend-icon-wrap">
            <Image src={collectCanImage} alt="Collectables" width={52} height={52} className="legend-main-icon" />
          </div>
          <div className="legend-card-name">Collectables</div>
          <p className="legend-card-desc">Rare bonus items. Grab them to increase your collectable score.</p>
          <span className="legend-badge">Grab for points</span>
          <div className="legend-items">
            {collectableItems.map((item) => (
              <span key={item.label} className="legend-tag" aria-label={item.label} title={item.label}>
                <Image src={item.src} alt={item.label} width={36} height={36} className="legend-tag-icon" />
              </span>
            ))}
          </div>
        </article>

        <article className="legend-card legend-card-fish">
          <div className="legend-icon-wrap">
            <Image src={nemoImage} alt="Marine life" width={52} height={52} className="legend-main-icon" />
          </div>
          <div className="legend-card-name">Marine Life</div>
          <p className="legend-card-desc">These are ocean friends. Let them swim and focus on cleaning trash.</p>
          <span className="legend-badge">Do not click</span>
          <div className="legend-items">
            {fishItems.map((item) => (
              <span key={item.label} className="legend-tag" aria-label={item.label} title={item.label}>
                <Image src={item.src} alt={item.label} width={36} height={36} className="legend-tag-icon" />
              </span>
            ))}
          </div>
        </article>
      </div>
    </section>
  );
}
