import Link from 'next/link';

// Componente de tarjeta (queda igual)
function StatCard({ title, value, linkTo }: { title: string, value: string, linkTo: string }) {
  // ... (código de StatCard sin cambios) ...
  return (
    <Link href={linkTo}>
      <div className="bg-white shadow-lg rounded-xl p-6 transition-all duration-300 hover:shadow-emerald-100 hover:shadow-2xl hover:-translate-y-1 animate-fade-in">
        <h3 className="text-lg font-semibold text-gray-500">{title}</h3>
        <p className="text-4xl font-bold text-emerald-700">{value}</p>
      </div>
    </Link>
  );
}


export default function HomePage() {
  return (
    <div className="container mx-auto">
      {/* Sección de Bienvenida */}
      {/* ¡CAMBIO! Añadimos 'relative' para posicionar el botón secreto */}
      <section className="relative bg-gradient-to-r from-emerald-700 to-teal-800 text-white p-10 rounded-2xl shadow-2xl animate-fade-in">
        <h1 className="text-5xl font-extrabold mb-4">
          Bienvenid@ a CineClub Next.js
        </h1>
        <p className="text-xl text-teal-100">
          Este es el panel de administración de tu proyecto, migrado de .NET a Next.js y Vercel.
        </p>

        {/* --- ¡NUEVO! Botón Secreto --- */}
        <Link href="/sorpresa" className="mf-button" title="MF">
          MF
        </Link>
        {/* --- Fin del Botón Secreto --- */}

      </section>

      {/* Sección de Estadísticas (Tarjetas) */}
      <section className="mt-12">
        {/* ... (el resto de la página sin cambios) ... */}
        <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          Acceso Rápido
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div style={{ animationDelay: '0.4s' }}>
            <StatCard title="Gestionar Empleados" value="Ir →" linkTo="/empleados" />
          </div>
          <div style={{ animationDelay: '0.6s' }}>
            <StatCard title="Gestionar Películas" value="Ir →" linkTo="/peliculas" />
          </div>
          <div style={{ animationDelay: '0.8s' }}>
            <StatCard title="Gestionar Directores" value="Ir →" linkTo="/directores" />
          </div>
        </div>
      </section>
    </div>
  );
}