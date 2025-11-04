'use client';

// --- Componente para los Corazones Flotantes ---
function FloatingHearts() {
  return (
    <div className="heart-container">
      {/* Generamos 15 corazones con posiciones y animaciones aleatorias */}
      {[...Array(15)].map((_, i) => (
        <div 
          className="heart" 
          key={i} 
          style={{ 
            left: `${Math.random() * 100}%`, // Posición horizontal aleatoria
            animationDelay: `${Math.random() * 5}s`, // Retraso de inicio aleatorio
            animationDuration: `${Math.random() * 3 + 5}s` // Duración aleatoria (entre 5s y 8s)
          }}
        ></div>
      ))}
    </div>
  );
}

// --- Componente para el Tulipán ---
function Tulipan({ delay, color }: { delay: number; color: string }) {
  return (
    // Cada tulipán tiene un retraso de animación
    <div className="tulip" style={{ animationDelay: `${delay}s` }}>
      <div className="stem" /> {/* Tallo */}
      <div className="leaf leaf-1" /> {/* Hoja 1 */}
      <div className="leaf leaf-2" /> {/* Hoja 2 */}
      <div className="flower-cup">
        {/* Los 3 pétalos que forman la flor */}
        <div className="petal-1" style={{ backgroundColor: color }} />
        <div className="petal-2" style={{ backgroundColor: color }} />
        <div className="petal-3" style={{ backgroundColor: color }} />
      </div>
    </div>
  );
}

export default function SorpresaPage() {
  return (
    // Cambiamos el fondo a un degradado de rosa/salmón más suave
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-pink-50 to-rose-100 overflow-hidden relative">
      
      {/* ¡NUEVO! Añadimos el contenedor de corazones */}
      <FloatingHearts />

      {/* El Ramo de Tulipanes */}
      {/* Usamos z-10 para que las flores estén por encima de los corazones */}
      <div className="flex items-end justify-center h-96 relative z-10">
        <Tulipan delay={0.2} color="#f72585" /> {/* Tulipán Fucsia */}
        <Tulipan delay={0} color="#ffafcc" />   {/* Tulipán Rosa Claro */}
        <Tulipan delay={0.4} color="#f8961e" /> {/* Tulipán Naranja */}
      </div>

      {/* El Mensaje Especial */}
      {/* Usamos z-10 para que el mensaje esté por encima de los corazones */}
      <div className="text-center p-8 mt-12 animate-fade-in relative z-10">
        <p className="text-3xl md:text-4xl font-serif text-gray-700 leading-relaxed shadow-sm">
          "No te he visto hoy pero estoy seguro que te ves muy linda."
        </p>
        <p className="text-3xl font-serif text-gray-800 mt-6">
          Att: O
        </p>
      </div>
    </div>
  );
}