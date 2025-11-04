'use client';

import { CSSProperties, useMemo } from 'react';

type HeartData = {
  left: string;
  delay: string;
  duration: string;
  scale: number;
  drift: string;
};

function FloatingHearts() {
  const hearts = useMemo<HeartData[]>(
    () =>
      Array.from({ length: 18 }, () => {
        const scale = Number((Math.random() * 0.4 + 0.7).toFixed(2));
        const drift = `${(Math.random() * 70 - 35).toFixed(1)}px`;
        return {
          left: `${Math.random() * 100}%`,
          delay: `${(Math.random() * 4).toFixed(2)}s`,
          duration: `${(Math.random() * 3 + 6).toFixed(2)}s`,
          scale,
          drift,
        };
      }),
    []
  );

  return (
    <div className="heart-container" aria-hidden="true">
      {hearts.map((heart, index) => (
        <span
          key={`heart-${index}`}
          className="heart"
          style={{
            left: heart.left,
            '--delay': heart.delay,
            '--duration': heart.duration,
            '--scale': heart.scale.toString(),
            '--drift': heart.drift,
          } as CSSProperties}
        />
      ))}
    </div>
  );
}

function Tulip() {
  return (
    <div className="tulip">
      <div className="stem" />
      <div className="leaf leaf-1" />
      <div className="leaf leaf-2" />
      <div className="flower-cup">
        <div className="petal-1" style={{ '--petal-color': '#ff8fab' } as CSSProperties} />
        <div className="petal-2" style={{ '--petal-color': '#f72585' } as CSSProperties} />
        <div className="petal-3" style={{ '--petal-color': '#ff8fab' } as CSSProperties} />
      </div>
    </div>
  );
}

export default function SorpresaPage() {
  return (
    <div className="sorpresa-stage">
      <FloatingHearts />

      <div className="sorpresa-card animate-fade-in">
        <div className="sorpresa-pedestal">
          <Tulip />
        </div>

        <div className="sorpresa-message">
          <p>
            "No te vi hoy pero... Se que estas hermosa"
            <br />
            <span className="sorpresa-signature">Att: O</span>
          </p>
        </div>
      </div>
    </div>
  );
}