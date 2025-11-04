import Image from 'next/image';
import Link from 'next/link';

// --- Componente StatCard (sin cambios) ---
function StatCard({
  title,
  value,
  description,
  linkTo,
  delay,
}: {
  title: string;
  value: string;
  description: string;
  linkTo: string;
  delay: string;
}) {
  return (
    <Link
      href={linkTo}
      className="group relative block overflow-hidden rounded-2xl border border-rose-900/40 bg-gradient-to-br from-white/15 via-white/5 to-transparent p-[1px] shadow-cinema transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(255,80,120,0.3)] animate-pop"
      style={{ animationDelay: delay }}
    >
      <div className="relative h-full rounded-2xl bg-gradient-to-br from-[#200008]/90 via-[#120005]/85 to-[#0b0003]/90 p-6">
        <div className="absolute -right-10 top-0 h-28 w-28 rounded-full bg-rose-500/20 blur-3xl transition-opacity duration-500 group-hover:opacity-70"></div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-200/60">Gestión</p>
            <h3 className="mt-2 text-2xl font-semibold text-rose-50">{title}</h3>
          </div>
          <p className="text-sm text-rose-100/70">{description}</p>
          <div className="mt-auto flex items-center justify-between text-rose-100">
            <span className="text-lg font-semibold uppercase tracking-[0.3em] text-rose-300/80">{value}</span>
            <span className="rounded-full border border-rose-500/50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-rose-200 transition-all duration-300 group-hover:border-rose-300 group-hover:text-rose-100">
              Entrar
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

// --- quickLinks y collections (sin cambios) ---
const quickLinks = [
  {
    title: 'Gestionar Empleados',
    value: 'Staff',
    description: 'Administra el talento que da vida a cada función y controla turnos con estilo.',
    linkTo: '/empleados',
    delay: '0.15s',
  },
  {
    title: 'Gestionar Películas',
    value: 'Cartelera',
    description: 'Actualiza estrenos, reposiciones y sorpresas para que la sala nunca pierda magia.',
    linkTo: '/peliculas',
    delay: '0.3s',
  },
  {
    title: 'Gestionar Directores',
    value: 'Autoras/es',
    description: 'Organiza filmografías y mantén vivas las voces que inspiran cada proyección.',
    linkTo: '/directores',
    delay: '0.45s',
  },
];

const collections = [
  {
    title: 'Estrenos Hipnóticos',
    description: 'Una selección candente de premieres para crear funciones inolvidables.',
    image: '/images/premiere-poster.svg',
    href: '/peliculas',
  },
  {
    title: 'Clásicos que Enamoran',
    description: 'Curaduría de películas inmortales listas para revivir su gloria en pantalla grande.',
    image: '/images/classic-poster.svg',
    href: '/peliculas?tag=clasicos',
  },
  {
    title: 'Festivales y Galas',
    description: 'Programas especiales con el pulso de los festivales más prestigiosos del mundo.',
    image: '/images/festival-poster.svg',
    href: '/peliculas?tag=festejos',
  },
];


export default function HomePage() {
  return (
    <div className="space-y-16">
      
      {/* --- Sección 1: Banner Principal (sin cambios) --- */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-900/50 bg-gradient-to-br from-[#200008]/90 via-[#31010c]/85 to-[#120005]/95 px-8 py-12 shadow-cinema animate-fade-in sm:px-12">
        {/* ... (contenido del banner principal) ... */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,120,150,0.15),transparent_65%)]" />
        <div className="pointer-events-none absolute -top-12 left-0 h-32 w-full bg-[url('/images/film-strip.svg')] bg-[length:360px_140px] opacity-30 mix-blend-screen animate-marquee" />
        <div className="relative flex flex-col gap-12 lg:flex-row lg:items-center">
          <div className="flex-1 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-rose-400/50 bg-rose-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-rose-100/80">
              🎞️ Experiencia Cinematográfica
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-rose-50 sm:text-5xl lg:text-6xl">
              Bienvenid@ a la cabina de mando de CineClub
            </h1>
            <p className="max-w-xl text-lg leading-relaxed text-rose-100/80">
              Gestiona tu universo cinematográfico desde una interfaz vibrante, pensada para sorprender y sumergirte en la atmósfera roja del séptimo arte.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                href="/peliculas"
                className="inline-flex items-center gap-2 rounded-full border border-rose-500/60 bg-rose-500/20 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-rose-50 transition-all duration-300 hover:translate-y-[-2px] hover:bg-rose-500/30 hover:shadow-[0_15px_35px_rgba(255,80,120,0.35)]"
              >
                Explorar cartelera
              </Link>
              <Link
                href="/generos"
                className="inline-flex items-center gap-2 rounded-full border border-rose-200/30 px-6 py-3 text-sm font-semibold uppercase tracking-[0.3em] text-rose-200/90 transition-all duration-300 hover:border-rose-200/60 hover:text-rose-50"
              >
                Ver colecciones
              </Link>
            </div>
          </div>

          <div className="relative flex-1">
            <div className="absolute -left-16 top-16 h-32 w-32 rounded-full bg-rose-400/20 blur-3xl" />
            <div className="absolute -right-10 bottom-6 h-24 w-24 rounded-full bg-rose-700/20 blur-3xl" />
            <div className="relative mx-auto w-full max-w-md">
              <div className="absolute -inset-8 rounded-[32px] bg-gradient-to-tr from-rose-500/25 via-transparent to-rose-700/25 blur-3xl" />
              <Image
                src="/images/hero-cinema.svg"
                alt="Escena cinematográfica"
                width={540}
                height={540}
                priority
                className="relative z-10 w-full animate-spotlight rounded-[28px] border border-rose-500/40 object-contain shadow-[0_40px_80px_rgba(255,80,120,0.35)]"
              />
              <div className="absolute -bottom-12 left-1/2 h-24 w-[140%] -translate-x-1/2 rounded-full bg-rose-900/60 blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* --- Sección 2: Acceso Rápido (CORREGIDA) --- */}
      <section className="space-y-8 animate-fade-in" style={{ animationDelay: '0.2s' }}>
        
        {/* BLOQUE DUPLICADO ELIMINADO */}
        
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          {/* Este es el único encabezado que debe quedar */}
          <div className="space-y-2">
            <h2 className="text-3xl font-semibold text-rose-50">Acceso rápido</h2>
            <p className="text-sm text-rose-100/70">Gestiona cada área clave con un par de clics y efectos que deslumbran.</p>
          </div>
          <Link
            href="/sorpresa"
            className="inline-flex items-center gap-2 rounded-full border border-rose-400/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-rose-200/80 transition-all duration-300 hover:border-rose-200 hover:text-rose-50"
          >
            Ir a la función secreta
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map((item) => (
            <StatCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* --- Sección 3: Colecciones (sin cambios) --- */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-900/40 bg-gradient-to-br from-white/10 via-[#200008]/45 to-[#120005]/75 p-8 shadow-cinema backdrop-blur animate-fade-in" style={{ animationDelay: '0.35s' }}>
        {/* ... (contenido de colecciones) ... */}
        <div className="pointer-events-none absolute inset-x-0 -top-16 h-24 bg-[url('/images/film-strip.svg')] bg-[length:360px_140px] opacity-25 animate-marquee" />
        <div className="relative grid gap-8 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <div
              key={collection.title}
              className="group relative overflow-hidden rounded-2xl border border-rose-900/50 bg-black/40 backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:border-rose-400/60 hover:shadow-[0_35px_80px_rgba(255,80,120,0.25)] animate-pop"
              style={{ animationDelay: `${0.2 * (index + 1)}s` }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-rose-500/20 via-transparent to-rose-800/30 opacity-60 transition-opacity duration-500 group-hover:opacity-90" />
              <div className="relative flex h-full flex-col gap-5 p-6">
                <Image
                  src={collection.image}
                  alt={collection.title}
                  width={260}
                  height={320}
                  className="w-full max-w-[220px] self-center rounded-2xl border border-rose-500/40 bg-rose-500/10 p-4 shadow-[0_20px_40px_rgba(255,80,120,0.25)] transition-transform duration-500 group-hover:scale-105"
                />
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-rose-50">{collection.title}</h3>
                  <p className="text-sm leading-relaxed text-rose-100/75">{collection.description}</p>
                </div>
                <Link
                  href={collection.href}
                  className="mt-auto inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-200/90 transition-all duration-300 hover:text-rose-50"
                >
                  Descubrir selección →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* --- Sección 4: Destacados (sin cambios) --- */}
      <section className="relative overflow-hidden rounded-3xl border border-rose-900/50 bg-black/40 p-8 shadow-cinema backdrop-blur animate-fade-in" style={{ animationDelay: '0.55s' }}>
        {/* ... (contenido de destacados) ... */}
        <div className="pointer-events-none absolute inset-0 bg-cinema-grid opacity-20" />
        <div className="relative grid gap-10 md:grid-cols-[1.1fr,0.9fr]">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold text-rose-50">Una interfaz hecha para brillar</h2>
            <p className="text-sm leading-relaxed text-rose-100/775">
              El nuevo look de CineClub mezcla tonos rojizos intensos, texturas cinematográficas y animaciones envolventes que elevan cada interacción.
            </p>
            <ul className="space-y-4 text-sm text-rose-100/80">
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/30 text-rose-50">✨</span>
                Animaciones dinámicas en tarjetas y portadas que se sienten como una marquesina en movimiento.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/30 text-rose-50">📽️</span>
                Imágenes cuidadosamente creadas para reforzar la estética deluxe de cada sección.
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-rose-500/30 text-rose-50">🎟️</span>
                Botones y enlaces con brillos tipo neón que invitan a seguir explorando el club.
              </li>
            </ul>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-12 rounded-full bg-rose-600/20 blur-3xl" />
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-rose-900/50 bg-gradient-to-br from-[#240009]/70 via-[#110005]/75 to-[#050103]/90 p-6">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.35em] text-rose-200/70">
                <span>Agenda</span>
                <span>Panel</span>
                <span>Premium</span>
              </div>
              <div className="mt-6 space-y-4">
                {['Prepara tu próxima función', 'Activa experiencias inmersivas', 'Sorprende a tu audiencia'].map((highlight, index) => (
                  <div
                    key={highlight}
                    className="flex items-center gap-4 rounded-2xl border border-rose-500/40 bg-white/5 px-4 py-3 text-sm text-rose-100/80 transition-all duration-300 hover:border-rose-300/60 hover:text-rose-50"
                    style={{ animationDelay: `${0.2 * (index + 1)}s` }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-500/25 text-rose-50 shadow-[0_10px_20px_rgba(255,80,120,0.25)]">
                      {index === 0 ? '1' : index === 1 ? '2' : '3'}
                    </span>
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-xl border border-rose-500/40 bg-rose-500/10 px-5 py-4 text-center text-xs font-semibold uppercase tracking-[0.35em] text-rose-100/80">
                Siente la sala vibrar con cada clic
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}