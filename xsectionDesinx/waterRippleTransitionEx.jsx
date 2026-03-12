import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Water Ripple SVG Filter ───────────────────────────────────────────────
const WaterFilter = () => (
  <svg style={{ position: "absolute", width: 0, height: 0 }}>
    <defs>
      <filter id="water-ripple" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.015 0.015"
          numOctaves="3"
          seed="2"
          result="noise"
        >
          <animate
            attributeName="baseFrequency"
            from="0.015 0.015"
            to="0.04 0.04"
            dur="0.8s"
            begin="0s"
            fill="freeze"
          />
        </feTurbulence>
        <feDisplacementMap
          in="SourceGraphic"
          in2="noise"
          scale="0"
          xChannelSelector="R"
          yChannelSelector="G"
          result="displaced"
        >
          <animate
            attributeName="scale"
            values="0;120;60;0"
            keyTimes="0;0.3;0.6;1"
            dur="1.1s"
            begin="0s"
            fill="freeze"
          />
        </feDisplacementMap>
      </filter>
    </defs>
  </svg>
);

// ─── Ripple Overlay ────────────────────────────────────────────────────────
const RippleOverlay = ({ origin, active }) => {
  if (!active) return null;
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0.8 }}
      animate={{ scale: 6, opacity: 0 }}
      transition={{ duration: 1.0, ease: [0.2, 0.8, 0.4, 1] }}
      style={{
        position: "fixed",
        left: origin.x,
        top: origin.y,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background:
          "radial-gradient(circle, rgba(2,20,60,0.92) 0%, rgba(5,35,90,0.65) 50%, transparent 75%)",
        transform: "translate(-50%, -50%)",
        pointerEvents: "none",
        zIndex: 9999,
        boxShadow:
          "0 0 100px 60px rgba(2,15,50,0.6), inset 0 0 40px rgba(10,40,110,0.3)",
      }}
    />
  );
};

// ─── Secondary Ripples ─────────────────────────────────────────────────────
const SecondaryRipple = ({ origin, delay }) => (
  <motion.div
    initial={{ scale: 0, opacity: 0.5 }}
    animate={{ scale: 4, opacity: 0 }}
    transition={{ duration: 1.2, delay, ease: [0.1, 0.6, 0.3, 1] }}
    style={{
      position: "fixed",
      left: origin.x,
      top: origin.y,
      width: 120,
      height: 120,
      borderRadius: "50%",
      border: "2px solid rgba(10,50,120,0.7)",
      transform: "translate(-50%, -50%)",
      pointerEvents: "none",
      zIndex: 9998,
    }}
  />
);

// ─── Page 1: Ocean Depths ──────────────────────────────────────────────────
const PageOne = ({ navigate }) => {
  const [hovered, setHovered] = useState(false);

  const floatVariants = {
    animate: {
      y: [-8, 8, -8],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #020b18 0%, #03254e 40%, #0a4a6e 70%, #0d6b8f 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Animated water light caustics */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            x: [0, 30 * Math.sin(i), -20 * Math.cos(i), 0],
            y: [0, -20 * Math.cos(i), 15 * Math.sin(i), 0],
            opacity: [0.08, 0.18, 0.08],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 6 + i * 1.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.8,
          }}
          style={{
            position: "absolute",
            width: 300 + i * 80,
            height: 300 + i * 80,
            borderRadius: "60% 40% 50% 70% / 50% 60% 40% 50%",
            background: `radial-gradient(ellipse, rgba(30,150,220,0.15) 0%, transparent 70%)`,
            left: `${10 + i * 15}%`,
            top: `${5 + i * 12}%`,
          }}
        />
      ))}

      {/* Floating bubbles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={`bubble-${i}`}
          animate={{ y: [0, -120 - i * 30], opacity: [0, 0.6, 0] }}
          transition={{
            duration: 4 + i * 0.5,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: 4 + (i % 4) * 3,
            height: 4 + (i % 4) * 3,
            borderRadius: "50%",
            background: "rgba(180,230,255,0.4)",
            border: "1px solid rgba(200,240,255,0.5)",
            left: `${8 + i * 7.5}%`,
            bottom: "10%",
          }}
        />
      ))}

      {/* Content */}
      <motion.div variants={floatVariants} animate="animate" style={{ textAlign: "center", zIndex: 10 }}>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            color: "rgba(100,200,255,0.7)",
            letterSpacing: "0.4em",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Depth · Silence · Wonder
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 300,
            color: "rgba(210,240,255,0.95)",
            lineHeight: 1,
            marginBottom: "0.5rem",
            textShadow: "0 0 60px rgba(80,180,255,0.4)",
            letterSpacing: "-0.02em",
          }}
        >
          The Deep
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 300,
            color: "rgba(100,180,240,0.6)",
            fontStyle: "italic",
            marginBottom: "3rem",
          }}
        >
          Where light forgets itself
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          style={{
            maxWidth: 420,
            margin: "0 auto 3.5rem",
            color: "rgba(140,200,230,0.7)",
            lineHeight: 1.9,
            fontSize: "1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          Below the surface, the world dissolves into a cathedral of silence. Pressure becomes presence. Darkness becomes familiar. Here, everything extraordinary is perfectly ordinary.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={navigate}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "1rem 2.8rem",
            background: hovered
              ? "rgba(40,130,200,0.35)"
              : "rgba(20,90,150,0.2)",
            border: "1px solid rgba(100,190,255,0.4)",
            borderRadius: "2px",
            color: "rgba(180,230,255,0.9)",
            fontSize: "0.85rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            backdropFilter: "blur(8px)",
            transition: "background 0.3s",
            boxShadow: hovered
              ? "0 0 30px rgba(80,160,255,0.3), inset 0 0 20px rgba(80,160,255,0.1)"
              : "none",
          }}
        >
          Rise to the Surface →
        </motion.button>
      </motion.div>

      {/* Bottom wave decoration */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 120,
          background:
            "linear-gradient(to top, rgba(10,120,160,0.15), transparent)",
        }}
      />
    </motion.div>
  );
};

// ─── Page 2: Surface Light ─────────────────────────────────────────────────
const PageTwo = ({ navigate }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(170deg, #010a14 0%, #021628 30%, #02243f 60%, #031e36 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Cormorant Garamond', Georgia, serif",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Deep water caustic shimmer */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={`caustic-${i}`}
          animate={{
            x: [0, 25 * Math.cos(i), -18 * Math.sin(i), 0],
            y: [0, -15 * Math.sin(i), 20 * Math.cos(i), 0],
            opacity: [0.05, 0.14, 0.05],
            scale: [1, 1.25, 1],
          }}
          transition={{
            duration: 7 + i * 1.8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 1.1,
          }}
          style={{
            position: "absolute",
            width: 350 + i * 90,
            height: 350 + i * 90,
            borderRadius: "55% 45% 60% 40% / 45% 55% 45% 60%",
            background: `radial-gradient(ellipse, rgba(10,80,160,0.18) 0%, transparent 70%)`,
            left: `${5 + i * 16}%`,
            top: `${8 + i * 10}%`,
          }}
        />
      ))}

      {/* Slow-drifting bioluminescent particles */}
      {[...Array(10)].map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          animate={{
            y: [0, -80 - i * 20],
            x: [0, (i % 2 === 0 ? 1 : -1) * (8 + i * 3)],
            opacity: [0, 0.45, 0],
          }}
          transition={{
            duration: 6 + i * 0.6,
            repeat: Infinity,
            delay: i * 0.9,
            ease: "easeOut",
          }}
          style={{
            position: "absolute",
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            borderRadius: "50%",
            background: "rgba(60,160,255,0.5)",
            boxShadow: "0 0 6px rgba(80,180,255,0.6)",
            left: `${6 + i * 9}%`,
            bottom: "15%",
          }}
        />
      ))}

      {/* Horizontal light bands drifting */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={`band-${i}`}
          animate={{ x: ["-100%", "120%"], opacity: [0, 0.07, 0] }}
          transition={{
            duration: 12 + i * 4,
            repeat: Infinity,
            delay: i * 3.5,
            ease: "linear",
          }}
          style={{
            position: "absolute",
            top: `${25 + i * 22}%`,
            left: 0,
            width: "60%",
            height: 1.5,
            background: "linear-gradient(to right, transparent, rgba(80,170,255,0.35), transparent)",
          }}
        />
      ))}

      {/* Content */}
      <motion.div
        style={{ textAlign: "center", zIndex: 10, padding: "2rem" }}
      >
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          style={{
            color: "rgba(80,160,240,0.65)",
            letterSpacing: "0.4em",
            fontSize: "0.75rem",
            textTransform: "uppercase",
            marginBottom: "1.5rem",
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          Current · Drift · Stillness
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          style={{
            fontSize: "clamp(3.5rem, 8vw, 7rem)",
            fontWeight: 300,
            color: "rgba(180,220,255,0.92)",
            lineHeight: 1,
            marginBottom: "0.5rem",
            textShadow: "0 0 50px rgba(40,120,220,0.5)",
            letterSpacing: "-0.02em",
          }}
        >
          The Surface
        </motion.h1>

        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          style={{
            fontSize: "clamp(1.2rem, 3vw, 2rem)",
            fontWeight: 300,
            color: "rgba(80,150,220,0.55)",
            fontStyle: "italic",
            marginBottom: "3rem",
          }}
        >
          Where the sky begins
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          style={{
            maxWidth: 420,
            margin: "0 auto 3.5rem",
            color: "rgba(100,170,220,0.65)",
            lineHeight: 1.9,
            fontSize: "1rem",
            fontFamily: "'DM Sans', sans-serif",
            fontWeight: 300,
          }}
        >
          Breaking the surface, the world floods back in light and noise and warmth. Every droplet catches a universe. The horizon opens its arms. You remember what it means to breathe.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          onClick={navigate}
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: "1rem 2.8rem",
            background: hovered
              ? "rgba(20,80,160,0.35)"
              : "rgba(10,50,110,0.2)",
            border: "1px solid rgba(60,140,220,0.4)",
            borderRadius: "2px",
            color: "rgba(150,210,255,0.9)",
            fontSize: "0.85rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "'DM Sans', sans-serif",
            backdropFilter: "blur(8px)",
            transition: "background 0.3s",
            boxShadow: hovered
              ? "0 0 30px rgba(40,120,255,0.3), inset 0 0 20px rgba(60,140,255,0.1)"
              : "none",
          }}
        >
          ← Dive Back Down
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

// ─── Main App ──────────────────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const [rippleOrigin, setRippleOrigin] = useState({ x: "50%", y: "50%" });
  const [showRipples, setShowRipples] = useState(false);
  const [filterActive, setFilterActive] = useState(false);
  const timeouts = useRef([]);

  const navigate = (e) => {
    if (transitioning) return;

    const origin = e?.currentTarget
      ? {
          x: e.currentTarget.getBoundingClientRect().left +
            e.currentTarget.getBoundingClientRect().width / 2,
          y: e.currentTarget.getBoundingClientRect().top +
            e.currentTarget.getBoundingClientRect().height / 2,
        }
      : { x: window.innerWidth / 2, y: window.innerHeight / 2 };

    setRippleOrigin(origin);
    setTransitioning(true);
    setShowRipples(true);
    setFilterActive(true);

    const t1 = setTimeout(() => {
      setPage((p) => (p === 0 ? 1 : 0));
    }, 550);

    const t2 = setTimeout(() => {
      setShowRipples(false);
      setFilterActive(false);
      setTransitioning(false);
    }, 1300);

    timeouts.current.push(t1, t2);
  };

  useEffect(() => {
    return () => timeouts.current.forEach(clearTimeout);
  }, []);

  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { overflow: hidden; }
      `}</style>

      <WaterFilter />

      {/* Dark dive overlay — fades screen to deep navy during transition */}
      <AnimatePresence>
        {transitioning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              background: "radial-gradient(ellipse at center, #010d20 0%, #000810 100%)",
              zIndex: 9990,
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      {/* Ripple overlays */}
      <AnimatePresence>
        {showRipples && (
          <>
            <RippleOverlay origin={rippleOrigin} active={showRipples} />
            <SecondaryRipple origin={rippleOrigin} delay={0.1} />
            <SecondaryRipple origin={rippleOrigin} delay={0.25} />
            <SecondaryRipple origin={rippleOrigin} delay={0.4} />
          </>
        )}
      </AnimatePresence>

      {/* Page content with water distortion filter */}
      <motion.div
        style={{
          filter: filterActive ? "url(#water-ripple)" : "none",
          transition: "filter 0.1s",
        }}
      >
        <AnimatePresence mode="wait">
          {page === 0 ? (
            <PageOne key="page1" navigate={navigate} />
          ) : (
            <PageTwo key="page2" navigate={navigate} />
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}