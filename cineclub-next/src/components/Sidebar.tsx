'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// --- Iconos SVG ---
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const IconEmpleados = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.824-2.167-1.943-2.39a4.125 4.125 0 0 0-1.121.037c-1.113.223-1.943 1.277-1.943 2.39v.003M15 19.128c.618 0 1.125-.504 1.125-1.125v-2.25c0-.621-.504-1.125-1.125-1.125h-3c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h3ZM3.375 19.128c.618 0 1.125-.504 1.125-1.125v-2.25c0-.621-.504-1.125-1.125-1.125h-3c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h3ZM9 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const IconPeliculas = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>;
const IconDirectores = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.875 1.875 0 0 1 17.625 22.5h-11.25a1.875 1.875 0 0 1-1.875-2.382Z" /></svg>;
const IconCatalogos = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>;

const navLinks = [
  { nombre: 'Home', href: '/', icon: <IconHome /> },
  { nombre: 'Empleados', href: '/empleados', icon: <IconEmpleados /> },
  { nombre: 'Películas', href: '/peliculas', icon: <IconPeliculas /> },
  { nombre: 'Directores', href: '/directores', icon: <IconDirectores /> },
  { nombre: 'Géneros', href: '/generos', icon: <IconCatalogos /> },
];


export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="relative flex h-screen w-64 flex-col overflow-hidden border-r border-rose-900/40 bg-gradient-to-b from-black via-[#140006] to-[#2d0010] p-6 text-rose-50 shadow-2xl shadow-rose-900/40">
      <div className="pointer-events-none absolute inset-0 bg-[url('/images/film-strip.svg')] bg-[length:320px_120px] opacity-[0.15] mix-blend-screen"></div>

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 -translate-y-1 animate-spotlight rounded-full bg-rose-500/30 blur-2xl"></div>
            <Image
              src="/images/cinema-emblem.svg"
              alt="Emblema CineClub"
              width={64}
              height={64}
              className="relative z-10 drop-shadow-[0_0_20px_rgba(255,100,140,0.55)]"
            />
          </div>
          <div>
            <p className="text-xl font-semibold tracking-wider">CineClub</p>
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-rose-200/70">Edición Premier</p>
          </div>
        </div>

        <nav className="flex flex-col gap-2">
          {navLinks.map((link) => {
            const isActive = pathname.startsWith(link.href) && (link.href !== '/' || pathname === '/');

            return (
              <Link
                key={link.nombre}
                href={link.href}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold tracking-wide transition-all duration-300 ${
                  isActive
                    ? 'translate-x-1 bg-gradient-to-r from-rose-600/70 via-rose-500/60 to-red-600/60 text-rose-50 shadow-cinema'
                    : 'text-rose-200/70 hover:translate-x-2 hover:bg-white/5 hover:text-rose-50'
                }`}
              >
                <span
                  className={`absolute inset-y-1 left-1 w-1 rounded-full bg-rose-400/80 transition-all duration-300 ${
                    isActive ? 'scale-y-100 opacity-100' : 'scale-y-0 opacity-0 group-hover:scale-y-100 group-hover:opacity-70'
                  }`}
                ></span>
                <span className="relative z-10 text-rose-100 drop-shadow-[0_0_12px_rgba(255,92,132,0.35)]">
                  {link.icon}
                </span>
                <span className="relative z-10">{link.nombre}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto rounded-2xl border border-rose-900/40 bg-white/5 p-4 text-sm text-rose-100/80 backdrop-blur">
          <p className="font-semibold uppercase tracking-[0.3em] text-rose-200">Función Especial</p>
          <p className="mt-2 text-xs leading-relaxed text-rose-100/70">
            Vive la magia del séptimo arte con estrenos exclusivos y la mejor experiencia visual.
          </p>
        </div>
      </div>
    </aside>
  );
}