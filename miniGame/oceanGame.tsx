import { useState, useEffect, useCallback, useRef, type MouseEvent } from "react";

type TrashItem = {
  id: number;
  x: number;
  y: number;
  type: "straw" | "bottle" | "bag" | "ring";
  rotation: number;
  speed: number;
  alive: boolean;
};

type Creature = {
  id: number;
  x: number;
  y: number;
  type: "fish" | "turtle" | "whale";
  emoji: string;
  speed: number;
  direction: number;
};

const LEVEL_THRESHOLDS = [10, 25, 50];
const LEVEL_NAMES = ["Straw Sweeper", "Wildlife Guardian", "Turtle Saviour"];
const LEVEL_DESCRIPTIONS = [
  "Click to remove plastic from the ocean. Clean 10 pieces!",
  "The fish are returning! Keep going — 25 total!",
  "A sea turtle has appeared! Save the ocean — 50 pieces!",
];

const TRASH_EMOJIS: Record<string, string> = {
  straw: "🥤",
  bottle: "🧴",
  bag: "🛍️",
  ring: "⭕",
};

const ImpactGame = () => {
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number }[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trashIdRef = useRef(0);
  const clickIdRef = useRef(0);

  // Determine current level
  useEffect(() => {
    let newLevel = 0;
    if (score >= LEVEL_THRESHOLDS[2]) {
      newLevel = 3;
    } else if (score >= LEVEL_THRESHOLDS[1]) {
      newLevel = 2;
    } else if (score >= LEVEL_THRESHOLDS[0]) {
      newLevel = 1;
    }

    if (newLevel > level) {
      setLevel(newLevel);
      if (newLevel === 3) {
        setGameComplete(true);
      } else {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 2500);
      }
    }
  }, [score, level]);

  // When ocean is restored, clear any remaining trash from the scene.
  useEffect(() => {
    if (!gameComplete) return;
    setTrash([]);
  }, [gameComplete]);

  // Spawn creatures based on level
  useEffect(() => {
    if (level >= 1 && creatures.filter(c => c.type === "fish").length === 0) {
      setCreatures(prev => [...prev, 
        { id: Date.now(), x: -10, y: 30 + Math.random() * 40, type: "fish", emoji: "🐠", speed: 0.3 + Math.random() * 0.3, direction: 1 },
        { id: Date.now() + 1, x: 110, y: 50 + Math.random() * 30, type: "fish", emoji: "🐟", speed: 0.2 + Math.random() * 0.3, direction: -1 },
      ]);
    }
    if (level >= 2 && creatures.filter(c => c.type === "turtle").length === 0) {
      setCreatures(prev => [...prev,
        { id: Date.now() + 2, x: -15, y: 60 + Math.random() * 20, type: "turtle", emoji: "🐢", speed: 0.15, direction: 1 },
      ]);
    }
  }, [level]);

  // Spawn trash continuously
  useEffect(() => {
    const interval = setInterval(() => {
      if (gameComplete) return;
      const types: TrashItem["type"][] = ["straw", "bottle", "bag", "ring"];
      const newTrash: TrashItem = {
        id: trashIdRef.current++,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * 360,
        speed: 0.2 + Math.random() * 0.5,
        alive: true,
      };
      setTrash(prev => {
        const alive = prev.filter(t => t.alive);
        if (alive.length >= 12) return prev;
        return [...prev.filter(t => t.alive), newTrash];
      });
    }, 800);
    return () => clearInterval(interval);
  }, [gameComplete]);

  // Animate creatures
  useEffect(() => {
    const interval = setInterval(() => {
      setCreatures(prev => prev.map(c => {
        let newX = c.x + c.speed * c.direction;
        let newDir = c.direction;
        if (newX > 110) newDir = -1;
        if (newX < -10) newDir = 1;
        return { ...c, x: newX, direction: newDir };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Float trash gently
  useEffect(() => {
    const interval = setInterval(() => {
      setTrash(prev => prev.map(t => ({
        ...t,
        y: t.y + Math.sin(Date.now() / 1000 + t.id) * 0.15,
        x: t.x + Math.cos(Date.now() / 1500 + t.id) * 0.08,
        rotation: t.rotation + 0.3,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const handleTrashClick = useCallback((trashId: number, e: MouseEvent) => {
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const cid = clickIdRef.current++;
    setClicks(prev => [...prev, { id: cid, x: clickX, y: clickY }]);
    setTimeout(() => setClicks(prev => prev.filter(c => c.id !== cid)), 800);

    setTrash(prev => prev.filter(t => t.id !== trashId));
    setScore(prev => prev + 1);
  }, []);

  const currentLevelIndex = Math.min(level, 2);
  const nextThreshold = level < 3 ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[2];
  const prevThreshold = level > 0 ? LEVEL_THRESHOLDS[level - 1] : 0;
  const progress = level >= 3 ? 100 : ((score - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  // Water gradient gets cleaner as you progress
  const waterOpacity = Math.max(0.15, 0.6 - (score / LEVEL_THRESHOLDS[2]) * 0.45);

  return (
    <div className="min-h-screen bg-ink flex flex-col overflow-hidden">
      {/* Top Bar */}
      <div className="relative z-20 flex items-center justify-between px-6 py-4">
        <a
          href="/"
          className="flex items-center gap-2 font-body text-sm text-primary-foreground/70 hover:text-brand transition-colors"
        >
          <span aria-hidden="true">&larr;</span>
          Back to site
        </a>
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="text-brand">~</span>
          <span className="font-display text-sm font-bold text-primary-foreground tracking-wide">
            OCEAN CLEANUP
          </span>
        </div>
      </div>

      {/* Game Area */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-4">
        {/* Level info */}
        <div className="text-center mb-6 z-10 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand/30 bg-brand/10 mb-3">
            <span aria-hidden="true" className="text-brand">*</span>
            <span className="font-body text-xs font-medium text-brand uppercase tracking-widest">
              Level {currentLevelIndex + 1} — {LEVEL_NAMES[currentLevelIndex]}
            </span>
          </div>
          <p className="font-body text-sm text-primary-foreground/50 max-w-md">
            {gameComplete ? "You saved the ocean! 🌊 The marine life thanks you." : LEVEL_DESCRIPTIONS[currentLevelIndex]}
          </p>
        </div>

        {/* Ocean container */}
        <div
          ref={containerRef}
          className="relative w-full max-w-4xl aspect-[16/10] rounded-2xl overflow-hidden cursor-crosshair select-none"
          style={{
            background: `linear-gradient(180deg, 
              hsl(200 80% ${22 + score * 0.4}%) 0%, 
              hsl(195 85% ${15 + score * 0.3}%) 40%, 
              hsl(210 70% ${10 + score * 0.2}%) 100%)`,
          }}
        >
          {/* Murky overlay — fades as ocean cleans */}
          <div
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              background: `radial-gradient(ellipse at 50% 80%, hsla(30, 30%, 20%, ${waterOpacity}), transparent 70%)`,
            }}
          />

          {/* Caustic light rays */}
          <div className="absolute inset-0 opacity-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bg-gradient-to-b from-primary-foreground/20 to-transparent"
                style={{
                  left: `${15 + i * 18}%`,
                  width: "2px",
                  height: `${40 + i * 10}%`,
                  transform: `rotate(${-5 + i * 3}deg)`,
                  animation: `fade-in ${2 + i * 0.5}s ease-in-out infinite alternate`,
                }}
              />
            ))}
          </div>

          {/* Bubbles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={`b-${i}`}
              className="absolute rounded-full border border-primary-foreground/10"
              style={{
                width: `${4 + Math.random() * 8}px`,
                height: `${4 + Math.random() * 8}px`,
                left: `${10 + i * 12}%`,
                bottom: `${5 + i * 5}%`,
                animation: `float ${3 + i * 0.7}s ease-in-out infinite`,
                animationDelay: `${i * 0.4}s`,
              }}
            />
          ))}

          {/* Trash items */}
          {trash.filter(t => t.alive).map(t => (
            <button
              key={t.id}
              onClick={(e) => handleTrashClick(t.id, e)}
              className="absolute text-2xl md:text-3xl hover:scale-125 transition-transform duration-150 z-10 drop-shadow-lg"
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: `rotate(${t.rotation}deg)`,
              }}
              title="Click to clean!"
            >
              {TRASH_EMOJIS[t.type]}
            </button>
          ))}

          {/* Creatures swimming */}
          {creatures.map(c => (
            <div
              key={c.id}
              className="absolute text-3xl md:text-4xl transition-all duration-200 pointer-events-none z-5"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: `scaleX(${c.direction})`,
              }}
            >
              {c.emoji}
            </div>
          ))}

          {/* Click effects */}
          {clicks.map(c => (
            <div
              key={c.id}
              className="absolute pointer-events-none z-20"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <span className="absolute -translate-x-1/2 -translate-y-1/2 font-display text-lg font-bold text-brand animate-fade-up">
                +1
              </span>
              <div className="absolute -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-brand/60 animate-scale-in opacity-0" />
            </div>
          ))}

          {/* Level up flash */}
          {showLevelUp && (
            <div className="absolute inset-0 flex items-center justify-center z-30 animate-fade-in">
              <div className="bg-ink/80 backdrop-blur-md rounded-2xl px-10 py-8 text-center border border-brand/30 animate-scale-in">
                <div className="text-5xl mb-3">
                  {level === 1 ? "🐠" : level === 2 ? "🐢" : "🐋"}
                </div>
                <h3 className="font-display text-2xl font-bold text-brand mb-1">Level Up!</h3>
                <p className="font-body text-primary-foreground/60 text-sm">{LEVEL_NAMES[Math.min(level, 2)]}</p>
              </div>
            </div>
          )}

          {/* Game complete overlay */}
          {gameComplete && (
            <div className="absolute inset-0 flex items-center justify-center z-30 animate-fade-in">
              <div className="bg-ink/90 backdrop-blur-xl rounded-2xl px-12 py-10 text-center border border-brand/40 animate-scale-in max-w-sm">
                <div className="text-6xl mb-4">🌊</div>
                <h3 className="font-display text-3xl font-bold text-brand mb-2">Ocean Saved!</h3>
                <p className="font-body text-primary-foreground/60 text-sm mb-6">
                  You removed {score} pieces of plastic and brought marine life back to the ocean.
                </p>
                <div className="flex items-center justify-center gap-6 text-3xl mb-6">
                  <span>🐠</span><span>🐟</span><span>🐢</span><span>🐋</span><span>🦈</span>
                </div>
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={() => {
                      setScore(0);
                      setLevel(0);
                      setTrash([]);
                      setCreatures([]);
                      setGameComplete(false);
                    }}
                    className="px-6 py-2.5 rounded-full bg-brand text-accent-foreground font-body text-sm font-medium hover:bg-brand-dark transition-colors"
                  >
                    Play Again
                  </button>
                  <a
                    href="/"
                    className="px-6 py-2.5 rounded-full border border-primary-foreground/20 text-primary-foreground/70 font-body text-sm font-medium hover:border-brand/40 transition-colors"
                  >
                    Back Home
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Sea floor */}
          <div className="absolute bottom-0 left-0 right-0 h-16">
            <svg viewBox="0 0 1200 80" className="w-full h-full" preserveAspectRatio="none">
              <path d="M0 80 L0 50 Q100 30 200 45 Q350 65 500 40 Q650 20 800 45 Q950 60 1100 35 L1200 40 L1200 80 Z" fill="hsl(35, 25%, 20%)" />
              {/* Seaweed */}
              {[100, 300, 550, 800, 1000].map((x, i) => (
                <path
                  key={i}
                  d={`M${x} 50 Q${x + 5} 25 ${x - 8} 10`}
                  stroke="hsl(140, 40%, 25%)"
                  strokeWidth="3"
                  fill="none"
                  opacity="0.6"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-4xl mt-6 z-10">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span aria-hidden="true" className="text-brand">♥</span>
              <span className="font-body text-xs text-primary-foreground/50">
                {score} pieces cleaned
              </span>
            </div>
            <span className="font-body text-xs text-primary-foreground/40">
              {gameComplete ? "Complete!" : `Next: ${nextThreshold} pieces`}
            </span>
          </div>
          <div className="h-2 rounded-full bg-primary-foreground/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-brand transition-all duration-500 ease-out"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          {/* Level indicators */}
          <div className="flex justify-between mt-3">
            {LEVEL_NAMES.map((name, i) => (
              <div key={name} className="flex items-center gap-1.5">
                <div className={`w-2 h-2 rounded-full transition-colors ${level > i ? "bg-brand" : "bg-primary-foreground/15"}`} />
                <span className={`font-body text-[10px] tracking-wide uppercase transition-colors ${level > i ? "text-brand" : "text-primary-foreground/30"}`}>
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImpactGame;
