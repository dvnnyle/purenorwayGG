import "./testpage.css";

type Hotspot = {
  x: number;
  y: number;
  radius: number;
  strength: number;
};

type ContinentConfig = {
  id: string;
  top: number;
  left: number;
  width: number;
  height: number;
  rows: number;
  cols: number;
  seed: number;
  hotspots: Hotspot[];
};

type HexCell = {
  key: string;
  x: number;
  y: number;
  tier: 0 | 1 | 2 | 3;
};

type MetricPin = {
  city: string;
  value: string;
  top: number;
  left: number;
  tone: "cyan" | "mint" | "orange" | "rose" | "violet" | "blue";
};

const continents: ContinentConfig[] = [
  {
    id: "north-america",
    top: 12,
    left: 2,
    width: 29,
    height: 39,
    rows: 18,
    cols: 22,
    seed: 101,
    hotspots: [
      { x: 0.48, y: 0.52, radius: 0.2, strength: 1.25 },
      { x: 0.6, y: 0.44, radius: 0.14, strength: 0.85 },
      { x: 0.33, y: 0.62, radius: 0.22, strength: 0.78 },
    ],
  },
  {
    id: "south-america",
    top: 49,
    left: 14,
    width: 18,
    height: 43,
    rows: 21,
    cols: 14,
    seed: 87,
    hotspots: [
      { x: 0.48, y: 0.35, radius: 0.2, strength: 1.12 },
      { x: 0.38, y: 0.65, radius: 0.25, strength: 0.82 },
    ],
  },
  {
    id: "europe-africa",
    top: 10,
    left: 39,
    width: 27,
    height: 56,
    rows: 26,
    cols: 20,
    seed: 135,
    hotspots: [
      { x: 0.35, y: 0.34, radius: 0.17, strength: 1.2 },
      { x: 0.46, y: 0.52, radius: 0.16, strength: 0.85 },
      { x: 0.56, y: 0.7, radius: 0.26, strength: 0.5 },
    ],
  },
  {
    id: "asia",
    top: 11,
    left: 58,
    width: 34,
    height: 40,
    rows: 18,
    cols: 26,
    seed: 62,
    hotspots: [
      { x: 0.65, y: 0.55, radius: 0.17, strength: 1.48 },
      { x: 0.41, y: 0.4, radius: 0.24, strength: 0.82 },
      { x: 0.3, y: 0.58, radius: 0.18, strength: 0.6 },
    ],
  },
  {
    id: "australia",
    top: 58,
    left: 77,
    width: 16,
    height: 25,
    rows: 12,
    cols: 12,
    seed: 199,
    hotspots: [{ x: 0.52, y: 0.48, radius: 0.18, strength: 1.15 }],
  },
  {
    id: "greenland",
    top: 2,
    left: 21,
    width: 10,
    height: 16,
    rows: 7,
    cols: 8,
    seed: 23,
    hotspots: [{ x: 0.5, y: 0.45, radius: 0.28, strength: 0.44 }],
  },
];

const pins: MetricPin[] = [
  { city: "Chicago", value: "98,320,300", top: 25, left: 17, tone: "cyan" },
  { city: "Manaus", value: "12,320,300", top: 52, left: 24, tone: "orange" },
  { city: "Berlin", value: "76,541,106", top: 16, left: 49, tone: "mint" },
  { city: "Giza", value: "10,547,980", top: 37, left: 56, tone: "rose" },
  { city: "Shanghai", value: "239,570,110", top: 28, left: 82, tone: "violet" },
  { city: "Queensland", value: "6,097,321", top: 71, left: 89, tone: "blue" },
];

function seededNoise(row: number, col: number, seed: number): number {
  const wave = Math.sin((row + 1) * 12.9898 + (col + 1) * 78.233 + seed * 5.3412) * 43758.5453;
  return wave - Math.floor(wave);
}

function hexTier(config: ContinentConfig, row: number, col: number): 0 | 1 | 2 | 3 {
  const nx = config.cols > 1 ? col / (config.cols - 1) : 0;
  const ny = config.rows > 1 ? row / (config.rows - 1) : 0;
  let signal = 0;

  for (const hotspot of config.hotspots) {
    const dx = nx - hotspot.x;
    const dy = ny - hotspot.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    signal += hotspot.strength * Math.max(0, 1 - distance / hotspot.radius);
  }

  const noise = seededNoise(row, col, config.seed);
  const intensity = signal + noise * 0.58;

  if (intensity > 1.32) return 3;
  if (intensity > 0.88) return 2;
  if (intensity > 0.52) return 1;
  return 0;
}

function createHexes(config: ContinentConfig): HexCell[] {
  const cells: HexCell[] = [];

  for (let row = 0; row < config.rows; row += 1) {
    for (let col = 0; col < config.cols; col += 1) {
      const x = (col + (row % 2 ? 0.5 : 0)) * 7.3;
      const y = row * 8.2;
      cells.push({
        key: `${config.id}-${row}-${col}`,
        x,
        y,
        tier: hexTier(config, row, col),
      });
    }
  }

  return cells;
}

export default function TestPage() {
  return (
    <main className="hex-testpage">
      <section className="hex-shell" aria-label="Hexbin distribution map">
        <div className="hex-map">
          {continents.map((continent) => (
            <div
              key={continent.id}
              className="continent"
              style={{
                top: `${continent.top}%`,
                left: `${continent.left}%`,
                width: `${continent.width}%`,
                height: `${continent.height}%`,
              }}
            >
              {createHexes(continent).map((cell) => (
                <span
                  key={cell.key}
                  className={`hex-cell tier-${cell.tier}`}
                  style={{
                    left: `${cell.x}%`,
                    top: `${cell.y}%`,
                  }}
                />
              ))}
            </div>
          ))}

          {pins.map((pin) => (
            <article
              key={pin.city}
              className={`metric-card tone-${pin.tone}`}
              style={{ top: `${pin.top}%`, left: `${pin.left}%` }}
            >
              <div className="metric-icon" aria-hidden="true">
                ◫
              </div>
              <div>
                <p className="metric-city">{pin.city}</p>
                <p className="metric-value">{pin.value}</p>
              </div>
            </article>
          ))}

          <div className="map-caption">
            <p className="caption-value">22,652</p>
            <p className="caption-label">New users</p>
          </div>
        </div>
      </section>
    </main>
  );
}
