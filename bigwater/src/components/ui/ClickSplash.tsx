'use client';

import React, { useState, useEffect } from 'react';
import './ClickSplash.css';

interface Splash {
  id: number;
  x: number;
  y: number;
}

export default function ClickSplash() {
  const [splashes, setSplashes] = useState<Splash[]>([]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const newSplash: Splash = {
        id: Date.now(),
        x: e.clientX,
        y: e.clientY,
      };

      setSplashes(prev => [...prev, newSplash]);

      // Remove splash after animation completes
      setTimeout(() => {
        setSplashes(prev => prev.filter(splash => splash.id !== newSplash.id));
      }, 800);
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  return (
    <>
      {splashes.map(splash => (
        <div
          key={splash.id}
          className="splash"
          style={{
            left: splash.x,
            top: splash.y,
          }}
        />
      ))}
    </>
  );
}
