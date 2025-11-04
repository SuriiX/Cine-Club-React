'use client';

import { CSSProperties, useMemo } from 'react';

type HeartData = {
  left: string;
  delay: string;
  duration: string;
  scale: number;
  drift: string;
};

// Componente de Corazones (sin cambios)
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

// --- ¡TULIPÁN MEJORADO! ---
function Tulip({ color, delay = 0 }: { color: string, delay?: number }) {
  const style = {
    '--petal-color-dark': color === 'fucsia' ? '#d40060' : '#ff8fab', // Tono oscuro
    '--petal-color-mid': color === 'fucsia' ? '#f72585' : '#ffb3c8', // Tono medio
    '--petal-color-light': color === 'fucsia' ? '#f72585' : '#ffd1dc', // Tono claro
    'animationDelay': `${delay}s`
  } as CSSProperties;

  return (
    <div className="tulip" style={style}>
      <div className="stem" />
      <div className="leaf leaf-1" />
      <div className="leaf leaf-2" />
      <div className="flower-cup">
        {/* Pétalos traseros */}
        <div className="petal petal-back petal-back-1" />
        <div className="petal petal-back petal-back-2" />
        
        {/* Pétalos frontales */}
        <div className="petal petal-front petal-1" />
        <div className="petal petal-front petal-3" />

        {/* Pétalos centrales */}
        <div className="petal petal-front petal-2" />
        <div className="petal petal-center" />
      </div>
    </div>
  );
}
// --- FIN TULIPÁN MEJORADO ---

export default function SorpresaPage() {
  return (
    <div className="sorpresa-stage">
      <FloatingHearts />

      {/* --- RAMO DE TULIPANES --- */}
      <div className="sorpresa-pedestal">
        <div className="tulip-wrapper tulip-1">
          <Tulip color="rosa" delay={0.4}/>
        </div>
        <div className="tulip-wrapper tulip-2">
          <Tulip color="fucsia" delay={0.2}/>
        </div>
        <div className="tulip-wrapper tulip-3">
          <Tulip color="rosa" delay={0.6}/>
        </div>
      </div>
      {/* --- FIN RAMO --- */}


      {/* --- MENSAJE CORREGIDO --- */}
      <div className="sorpresa-message animate-fade-in">
        <p>"No te he visto hoy pero estoy seguro que te ves muy linda."</p>
        <span>Att: O</span>
      </div>
      {/* --- FIN MENSAJE CORREGIDO --- */}
    </div>
  );
}