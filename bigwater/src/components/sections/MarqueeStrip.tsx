import './MarqueeStrip.css';

const DEFAULT_MARQUEE_ITEMS = [
  'Pure Norwegian Water',
  'Zero Carbon Footprint',
  'Infinitely Recyclable',
  '1% Pledge To The Ocean',
  'No Sugar',
  'No Additives',
  '0 Calories',
  'I CARE',
];

interface MarqueeStripProps {
  items?: string[];
  className?: string;
  ariaLabel?: string;
}

export default function MarqueeStrip({
  items,
  className = '',
  ariaLabel = 'Highlights',
}: MarqueeStripProps) {
  const sourceItems = items && items.length > 0 ? items : DEFAULT_MARQUEE_ITEMS;
  if (!sourceItems.length) return null;

  const repeatedItems = [...sourceItems, ...sourceItems, ...sourceItems];

  return (
    <section className={`marquee-strip ${className}`.trim()} aria-label={ariaLabel}>
      <div className="marquee-track">
        {repeatedItems.map((item, index) => (
          <div className="marquee-item" key={`${item}-${index}`}>
            <span className="marquee-word">{item}</span>
            <span className="marquee-sep" aria-hidden="true" />
          </div>
        ))}
      </div>
    </section>
  );
}
