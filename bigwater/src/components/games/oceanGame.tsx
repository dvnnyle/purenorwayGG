import { useState, useEffect, useCallback, useRef } from "react";
import { Howl } from "howler";
import { Sparkles, Heart, Maximize2, Minimize2, Pause, Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import "./oceanGame.css";
import GameLegendSection from "./GameLegendSection";

import havBackdrop from "./miniGameAssets/hav_backdrop.png";
import patStarImage from "./background/patStar.png";
import sponBobImage from "./background/sponBob.png";
import doryImage from "./miniGameAssets/fish_dory.png";
import nemoImage from "./miniGameAssets/fish_nemo.png";
import turtleImage from "./miniGameAssets/fish_turtle.png";
import whaleImage from "./miniGameAssets/fish_whale.png";
import krabsImage from "./miniGameAssets/fish_krabs.png";
import jellerImage from "./miniGameAssets/fish_jeller.png";
import strawImage from "./miniGameAssets/thrash_straw.png";
import bottleImage from "./miniGameAssets/thrash_bottle.png";
import bagImage from "./miniGameAssets/thrash_bag.png";
import ringImage from "./miniGameAssets/thrash_ring.png";
import collectCanImage from "./miniGameAssets/collectable_icon/collect_can.png";
import collectCan2Image from "./miniGameAssets/collectable_icon/collect_can2.png";
import collectCan3Image from "./miniGameAssets/collectable_icon/collect_can3.png";
import collectCan4Image from "./miniGameAssets/collectable_icon/collect_can4.png";

type TrashItem = {
  id: number;
  x: number;
  y: number;
  type: "straw" | "bottle" | "bag" | "ring" | "sponbob";
  rotation: number;
  speed: number;
  alive: boolean;
};

type Creature = {
  id: number;
  x: number;
  y: number;
  type: "fish_dory" | "fish_nemo" | "fish_turtle" | "fish_whale" | "fish_patstar" | "fish_krabs" | "fish_jeller";
  speed: number;
  direction: number;
  size: number;
  baseY?: number;
};

type CollectableItem = {
  id: number;
  x: number;
  y: number;
  variant: "can" | "can2" | "can3" | "can4";
  rotation: number;
  sinkSpeed: number;
};

const LEVEL_THRESHOLDS = [10, 25, 50];
const TRASH_POINTS = 1;
const COLLECTABLE_POINTS = 2;
const LEVEL_NAMES = ["Straw Sweeper", "Wildlife Guardian", "Turtle Saviour"];
const LEVEL_DESCRIPTIONS = [
  "Click to remove plastic from the ocean. Reach 10 points!",
  "The fish are returning! Keep going — 25 points total!",
  "A sea turtle has appeared! Save the ocean — 50 points!",
];

const TRASH_ASSETS: Record<string, any> = {
  straw: strawImage,
  bottle: bottleImage,
  bag: bagImage,
  ring: ringImage,
  sponbob: sponBobImage,
};

const CREATURE_ASSETS: Record<Creature["type"], any> = {
  fish_dory: doryImage,
  fish_nemo: nemoImage,
  fish_turtle: turtleImage,
  fish_whale: whaleImage,
  fish_patstar: patStarImage,
  fish_krabs: krabsImage,
  fish_jeller: jellerImage,
};

const COLLECTABLE_ASSETS: Record<CollectableItem["variant"], any> = {
  can: collectCanImage,
  can2: collectCan2Image,
  can3: collectCan3Image,
  can4: collectCan4Image,
};

const FISH_ACTIVE_CAP = 5;

const ImpactGame = () => {
  const [score, setScore] = useState(0);
  const [collectableScore, setCollectableScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [trash, setTrash] = useState<TrashItem[]>([]);
  const [creatures, setCreatures] = useState<Creature[]>([]);
  const [collectables, setCollectables] = useState<CollectableItem[]>([]);
  const [clicks, setClicks] = useState<{ id: number; x: number; y: number; value: number }[]>([]);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPaused, setIsPaused] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const trashIdRef = useRef(0);
  const collectableIdRef = useRef(0);
  const clickIdRef = useRef(0);
  const collectableVariantBagRef = useRef<CollectableItem["variant"][]>([]);
  const trashSfxRef = useRef<Howl | null>(null);
  const collectableSfxRef = useRef<Howl | null>(null);

  const getNextCollectableVariant = () => {
    if (collectableVariantBagRef.current.length === 0) {
      const shuffled = ["can", "can2", "can3", "can4"] as CollectableItem["variant"][];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      collectableVariantBagRef.current = shuffled;
    }
    return collectableVariantBagRef.current.pop() as CollectableItem["variant"];
  };

  const createOpenWaterCreature = () => {
    const fishTypes: Creature["type"][] = ["fish_dory", "fish_nemo", "fish_turtle", "fish_whale", "fish_patstar"];
    const type = fishTypes[Math.floor(Math.random() * fishTypes.length)];
    const fromLeft = Math.random() > 0.5;
    const baseSize = type === "fish_whale" ? 72 : type === "fish_patstar" ? 64 : 52;

    return {
      id: Date.now() + Math.floor(Math.random() * 100000),
      x: fromLeft ? -10 - Math.random() * 8 : 110 + Math.random() * 8,
      y: 22 + Math.random() * 56,
      type,
      speed: 0.14 + Math.random() * 0.28,
      direction: fromLeft ? 1 : -1,
      size: baseSize + Math.random() * 22,
    } as Creature;
  };

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

  // Once the game is complete, remove remaining trash immediately.
  useEffect(() => {
    if (!gameComplete) return;
    setTrash([]);
  }, [gameComplete]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    const trashSfx = new Howl({
      src: ["/assets/sounds/blub.mp3"],
      volume: 0.5,
      preload: true,
      html5: false,
    });

    // Uses the same source for now, but tuned differently so collectables feel distinct.
    const collectableSfx = new Howl({
      src: ["/assets/sounds/blub.mp3"],
      volume: 0.35,
      rate: 1.25,
      preload: true,
      html5: false,
    });

    trashSfxRef.current = trashSfx;
    collectableSfxRef.current = collectableSfx;

    return () => {
      trashSfxRef.current?.unload();
      collectableSfxRef.current?.unload();
      trashSfxRef.current = null;
      collectableSfxRef.current = null;
    };
  }, []);

  // Spawn open-water creatures at game start.
  useEffect(() => {
    if (gameComplete || isPaused) return;

    setCreatures((prev) => {
      if (prev.some((c) => c.type !== "fish_krabs" && c.type !== "fish_jeller")) return prev;

      const randomCreatures: Creature[] = Array.from({ length: FISH_ACTIVE_CAP }, () => createOpenWaterCreature());

      return [...prev, ...randomCreatures];
    });
  }, [gameComplete, isPaused]);

  // Keep fish population steady with a slower cadence now that krabs are also present.
  useEffect(() => {
    if (gameComplete || isPaused) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const refillFish = () => {
      setCreatures((prev) => {
        const openWaterCount = prev.filter((c) => c.type !== "fish_krabs" && c.type !== "fish_jeller").length;
        if (openWaterCount >= FISH_ACTIVE_CAP) return prev;
        return [...prev, createOpenWaterCreature()];
      });

      const nextDelay = 4600 + Math.random() * 3200;
      timeoutId = setTimeout(refillFish, nextDelay);
    };

    timeoutId = setTimeout(refillFish, 3400);

    return () => clearTimeout(timeoutId);
  }, [gameComplete, isPaused]);

  // Spawn floor-walking krabs in staggered timing so they do not overlap from one side.
  useEffect(() => {
    if (gameComplete || isPaused) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const spawnCount = 3;

    for (let i = 0; i < spawnCount; i += 1) {
      const timeoutId = setTimeout(() => {
        setCreatures((prev) => {
          if (prev.filter((c) => c.type === "fish_krabs").length >= spawnCount) return prev;

          const fromLeft = i % 2 === 0;
          const newKrabs: Creature = {
            id: Date.now() + 1000 + i,
            x: fromLeft ? -12 - Math.random() * 6 : 112 + Math.random() * 6,
            y: 86 + Math.random() * 5,
            type: "fish_krabs",
            speed: 0.08 + Math.random() * 0.06,
            direction: fromLeft ? 1 : -1,
            size: 56 + Math.random() * 10,
          };

          return [...prev, newKrabs];
        });
      }, i * 1200);

      timeouts.push(timeoutId);
    }

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [gameComplete, isPaused]);

  // Spawn top-floating jellers in staggered timing, opposite the krabs lane.
  useEffect(() => {
    if (gameComplete || isPaused) return;

    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const spawnCount = 2;

    for (let i = 0; i < spawnCount; i += 1) {
      const timeoutId = setTimeout(() => {
        setCreatures((prev) => {
          if (prev.filter((c) => c.type === "fish_jeller").length >= spawnCount) return prev;

          const fromLeft = i % 2 !== 0;
          const baseY = 10 + Math.random() * 8;
          const newJeller: Creature = {
            id: Date.now() + 2000 + i,
            x: fromLeft ? -10 - Math.random() * 6 : 110 + Math.random() * 6,
            y: baseY,
            baseY,
            type: "fish_jeller",
            speed: 0.04 + Math.random() * 0.03,
            direction: fromLeft ? 1 : -1,
            size: 52 + Math.random() * 8,
          };

          return [...prev, newJeller];
        });
      }, i * 1400);

      timeouts.push(timeoutId);
    }

    return () => {
      timeouts.forEach((id) => clearTimeout(id));
    };
  }, [gameComplete, isPaused]);

  // Spawn trash continuously with a softer cadence
  useEffect(() => {
    if (gameComplete || isPaused) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const spawnTrash = () => {
      const types: TrashItem["type"][] = ["straw", "bottle", "bag", "ring", "sponbob"];
      const newTrash: TrashItem = {
        id: trashIdRef.current++,
        x: Math.random() * 80 + 10,
        y: Math.random() * 60 + 20,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * 360,
        speed: 0.2 + Math.random() * 0.5,
        alive: true,
      };

      setTrash((prev) => {
        const alive = prev.filter((t) => t.alive);
        if (alive.length >= 10) return prev;
        return [...alive, newTrash];
      });

      // Slight random delay keeps spawning from feeling too mechanical/rapid.
      const nextDelay = 1200 + Math.random() * 700;
      timeoutId = setTimeout(spawnTrash, nextDelay);
    };

    timeoutId = setTimeout(spawnTrash, 1100);

    return () => clearTimeout(timeoutId);
  }, [gameComplete, isPaused]);

  // Randomized collectable spawn near the top so they sink down naturally
  useEffect(() => {
    if (gameComplete || isPaused) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const spawnCollectable = () => {
      const newCollectable: CollectableItem = {
        id: collectableIdRef.current++,
        x: Math.random() * 82 + 8,
        y: Math.random() * 10 - 6,
        variant: getNextCollectableVariant(),
        rotation: Math.random() * 14 - 7,
        sinkSpeed: 0.1 + Math.random() * 0.18,
      };

      setCollectables((prev) => {
        if (prev.length >= 3) return prev;
        return [...prev, newCollectable];
      });

      const nextDelay = 3200 + Math.random() * 3800;
      timeoutId = setTimeout(spawnCollectable, nextDelay);
    };

    timeoutId = setTimeout(spawnCollectable, 1800 + Math.random() * 1800);

    return () => clearTimeout(timeoutId);
  }, [gameComplete, isPaused]);

  // Animate creatures
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCreatures(prev => prev.map(c => {
        let newX = c.x + c.speed * c.direction;
        let newDir = c.direction;
        let newY = c.y;
        if (newX > 110) newDir = -1;
        if (newX < -10) newDir = 1;

        if (c.type === "fish_jeller") {
          const topAnchor = c.baseY ?? c.y;
          newY = topAnchor + Math.sin(Date.now() / 1200 + c.id) * 0.7;
        }

        return { ...c, x: newX, y: newY, direction: newDir };
      }));
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Float trash gently
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setTrash(prev => prev.map(t => ({
        ...t,
        y: t.y + Math.sin(Date.now() / 1000 + t.id) * 0.15,
        x: t.x + Math.cos(Date.now() / 1500 + t.id) * 0.08,
        rotation: t.rotation + 0.3,
      })));
    }, 50);
    return () => clearInterval(interval);
  }, [isPaused]);

  // Let collectables sink through the water with a slight drift
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCollectables((prev) =>
        prev
          .map((item) => ({
            ...item,
            y: item.y + item.sinkSpeed,
            x: item.x + Math.sin(Date.now() / 1400 + item.id) * 0.03,
            rotation: item.rotation + Math.sin(Date.now() / 1200 + item.id) * 0.1,
          }))
          .filter((item) => item.y <= 104)
      );
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handleTrashClick = useCallback((trashId: number, e: React.MouseEvent) => {
    if (isPaused || gameComplete) return;
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const cid = clickIdRef.current++;
    setClicks(prev => [...prev, { id: cid, x: clickX, y: clickY, value: TRASH_POINTS }]);
    setTimeout(() => setClicks(prev => prev.filter(c => c.id !== cid)), 800);

    trashSfxRef.current?.play();

    setTrash(prev => prev.filter(t => t.id !== trashId));
    setScore(prev => prev + TRASH_POINTS);
  }, [gameComplete, isPaused]);

  const handleCollectableClick = useCallback((collectableId: number, e: React.MouseEvent) => {
    if (isPaused || gameComplete) return;
    e.stopPropagation();
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const cid = clickIdRef.current++;
    setClicks((prev) => [...prev, { id: cid, x: clickX, y: clickY, value: COLLECTABLE_POINTS }]);
    setTimeout(() => setClicks((prev) => prev.filter((c) => c.id !== cid)), 800);

    collectableSfxRef.current?.play();

    setCollectables((prev) => prev.filter((item) => item.id !== collectableId));
    setCollectableScore((prev) => prev + 1);
    setScore((prev) => prev + COLLECTABLE_POINTS);
  }, [gameComplete, isPaused]);

  const togglePause = () => {
    if (gameComplete) return;
    setIsPaused((prev) => {
      const next = !prev;
      if (!hasStarted && !next) {
        setHasStarted(true);
      }
      return next;
    });
  };

  const toggleFullscreen = async () => {
    if (!containerRef.current) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await containerRef.current.requestFullscreen();
  };

  const currentLevelIndex = Math.min(level, 2);
  const nextThreshold = level < 3 ? LEVEL_THRESHOLDS[level] : LEVEL_THRESHOLDS[2];
  const prevThreshold = level > 0 ? LEVEL_THRESHOLDS[level - 1] : 0;
  const progress = level >= 3 ? 100 : ((score - prevThreshold) / (nextThreshold - prevThreshold)) * 100;

  // Water gradient gets cleaner as you progress
  // (handled by hav_backdrop.png)

  return (
    <div className="game-wrapper">
      {/* Game Area */}
      <div className="game-area">
        {/* Level info */}
        <div className="game-level-info">
          <div className="game-level-badge">
            <Sparkles size={14} />
            Level {currentLevelIndex + 1} — {LEVEL_NAMES[currentLevelIndex]}
          </div>
          <p className="game-level-desc">
            {gameComplete ? "You saved the ocean! The marine life thanks you." : LEVEL_DESCRIPTIONS[currentLevelIndex]}
          </p>
        </div>

        {/* Ocean */}
        <div
          ref={containerRef}
          className={`game-ocean${isPaused ? " is-paused" : ""}`}
        >
          <div className="hero-controls game-ocean-controls">
            <button
              type="button"
              className="hero-control-btn"
              onClick={togglePause}
              aria-label={isPaused ? "Resume game" : "Pause game"}
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? <Play size={16} /> : <Pause size={16} />}
            </button>
            <button
              type="button"
              className="hero-control-btn"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>

          <Image
            src={havBackdrop}
            alt="Ocean backdrop"
            fill
            style={{ objectFit: "cover", zIndex: 0 }}
            priority
          />
          <div className="game-ocean-logo">
            <Image
              src="/assets/logo/logoWhite.png"
              alt="PURENorway"
              width={120}
              height={36}
              className="game-ocean-logo-image"
            />
          </div>
          {/* Light rays */}
          <div className="ocean-light-rays">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="ocean-light-ray"
                style={{
                  left: `${15 + i * 18}%`,
                  width: "2px",
                  height: `${40 + i * 10}%`,
                  transform: `rotate(${-5 + i * 3}deg)`,
                }}
              />
            ))}
          </div>

          {/* Bubbles */}
          {[...Array(32)].map((_, i) => (
            <div
              key={`b-${i}`}
              className="ocean-bubble"
              style={{
                width: `${8 + (i % 6) * 4}px`,
                height: `${8 + (i % 6) * 4}px`,
                left: `${2 + (i * 3.1) % 96}%`,
                bottom: `${2 + (i % 10) * 9}%`,
                animationDuration: `${6 + (i % 6) * 1.1}s`,
                animationDelay: `${i * 0.38}s`,
              }}
            />
          ))}

          {/* Trash */}
          {!gameComplete && trash.filter(t => t.alive).map(t => (
            <button
              key={t.id}
              className="trash-item"
              onClick={(e) => handleTrashClick(t.id, e)}
              style={{
                left: `${t.x}%`,
                top: `${t.y}%`,
                transform: `rotate(${t.rotation}deg)`,
              }}
              title="Click to clean!"
            >
              <Image
                src={TRASH_ASSETS[t.type]}
                alt={t.type}
                width={48}
                height={48}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </button>
          ))}

          {/* Collectables */}
          {collectables.map((item) => (
            <button
              key={item.id}
              className="collectable-item"
              onClick={(e) => handleCollectableClick(item.id, e)}
              style={{
                left: `${item.x}%`,
                top: `${item.y}%`,
                transform: `rotate(${item.rotation}deg)`,
              }}
              title="Collect valuable"
            >
              <Image
                src={COLLECTABLE_ASSETS[item.variant]}
                alt="Collectable"
                width={86}
                height={86}
                style={{ width: "100%", height: "100%", objectFit: "contain" }}
              />
            </button>
          ))}

          {/* Creatures */}
          {creatures.map(c => (
            <div
              key={c.id}
              className="ocean-creature"
              style={{
                left: `${c.x}%`,
                top: `${c.y}%`,
                transform: `scaleX(${c.direction})`,
                width: `${c.size}px`,
                height: `${c.size}px`,
              }}
            >
              <div
                className="ocean-creature-body"
                style={{
                  animationDuration: `${2 + (c.id % 5) * 0.28}s`,
                  animationDelay: `-${(c.id % 7) * 0.22}s`,
                }}
              >
                <Image
                  src={CREATURE_ASSETS[c.type]}
                  alt={c.type}
                  width={Math.round(c.size)}
                  height={Math.round(c.size)}
                  style={{ width: "100%", height: "100%", objectFit: "contain" }}
                />
              </div>
            </div>
          ))}

          {/* Click effects */}
          {clicks.map(c => (
            <div
              key={c.id}
              className="click-effect"
              style={{ left: `${c.x}%`, top: `${c.y}%` }}
            >
              <span className="click-score">+{c.value}</span>
              <div className="click-ring" />
            </div>
          ))}

          {/* Pause overlay */}
          {isPaused && !gameComplete && (
            <div className="game-overlay game-overlay--paused">
              <div className="pause-card">
                <h3 className="pause-title">{hasStarted ? "Game Paused" : "Ready to Dive In?"}</h3>
                <p className="pause-desc">
                  {hasStarted
                    ? "Ocean activity is on hold. Tap resume to continue cleanup."
                    : "Start when you are ready. The ocean challenge begins the moment you tap the button."}
                </p>
                <button
                  type="button"
                  className="btn-play-again"
                  onClick={togglePause}
                >
                  {hasStarted ? "Resume" : "Start Game"}
                </button>
              </div>
            </div>
          )}

          {/* Level up overlay */}
          {showLevelUp && (
            <div className="game-overlay">
              <div className="levelup-card">
                <div className="levelup-icon">
                  <Image src={sponBobImage} alt="Level up" width={70} height={70} className="levelup-icon-image" />
                </div>
                <h3 className="levelup-title">Level Up!</h3>
                <p className="levelup-name">{LEVEL_NAMES[Math.min(level, 2)]}</p>
              </div>
            </div>
          )}

          {/* Game complete overlay */}
          {gameComplete && (
            <div className="game-overlay">
              <div className="complete-card">
                <div className="complete-icon">
                  <Image src={patStarImage} alt="Pat Star" width={84} height={84} className="complete-icon-image" />
                </div>
                <h3 className="complete-title">Ocean Saved!</h3>
                <p className="complete-desc">
                  You reached {score} points, collected {collectableScore} valuables, and brought marine life back to the ocean.
                </p>
                <div className="complete-creatures">
                  {(["fish_nemo", "fish_dory", "fish_turtle", "fish_whale", "fish_patstar", "fish_krabs"] as Creature["type"][]).map((type) => (
                    <div key={type} className="complete-creature-chip">
                      <Image
                        src={CREATURE_ASSETS[type]}
                        alt={type}
                        width={40}
                        height={40}
                        className="complete-creature-image"
                      />
                    </div>
                  ))}
                </div>
                <div className="complete-actions">
                  <button
                    className="btn-play-again"
                    onClick={() => {
                      setScore(0);
                      setCollectableScore(0);
                      setLevel(0);
                      setTrash([]);
                      setCollectables([]);
                      setCreatures([]);
                      setGameComplete(false);
                      setIsPaused(true);
                      setHasStarted(false);
                    }}
                  >
                    Play Again
                  </button>
                  <Link href="/" className="btn-back-home">
                    Back Home
                  </Link>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Progress */}
        <div className="game-progress">
          <div className="progress-header">
            <div className="progress-stats">
              <div className="score-label">
                <Heart size={14} />
                {score} points
              </div>
              <div className="score-label score-label--collectables">
                <Image
                  src={collectCanImage}
                  alt="Collectables"
                  width={16}
                  height={16}
                  className="score-label-icon"
                />
                {collectableScore} collectables
              </div>
            </div>
            <span className="progress-next">
              {gameComplete ? "Complete!" : `Next: ${nextThreshold} points`}
            </span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
          <div className="level-indicators">
            {LEVEL_NAMES.map((name, i) => (
              <div key={name} className="level-indicator">
                <div className={`level-dot${level > i ? " reached" : ""}`} />
                <span className={`level-name${level > i ? " reached" : ""}`}>{name}</span>
              </div>
            ))}
          </div>

        </div>

        <GameLegendSection />
      </div>
    </div>
  );
};

export default ImpactGame;
