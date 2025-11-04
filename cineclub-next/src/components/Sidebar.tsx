'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Iconos SVG simples para el menú
const IconHome = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" /></svg>;
const IconEmpleados = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.824-2.167-1.943-2.39a4.125 4.125 0 0 0-1.121.037c-1.113.223-1.943 1.277-1.943 2.39v.003M15 19.128c.618 0 1.125-.504 1.125-1.125v-2.25c0-.621-.504-1.125-1.125-1.125h-3c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h3ZM3.375 19.128c.618 0 1.125-.504 1.125-1.125v-2.25c0-.621-.504-1.125-1.125-1.125h-3c-.621 0-1.125.504-1.125 1.125v2.25c0 .621.504 1.125 1.125 1.125h3ZM9 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM21 11.25a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" /></svg>;
const IconPeliculas = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 13.5 5.25h-9a2.25 2.25 0 0 0-2.25 2.25v9A2.25 2.25 0 0 0 4.5 18.75Z" /></svg>;
const IconDirectores = () => <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A1.875 1.875 0 0 1 17.625 22.5h-11.25a1.875 1.875 0 0 1-1.875-2.382Z" /></svg>;

const navLinks = [
  { nombre: 'Home', href: '/', icon: <IconHome /> },
  { nombre: 'Empleados', href: '/empleados', icon: <IconEmpleados /> },
  { nombre: 'Películas', href: '/peliculas', icon: <IconPeliculas /> },
  { nombre: 'Directores', href: '/directores', icon: <IconDirectores /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 h-screen bg-gray-900 text-white flex flex-col p-4 shadow-lg transition-all duration-300">
      <div className="text-2xl font-bold mb-8 text-center flex items-center justify-center gap-2">
        🎬 CineClub
      </div>
      <nav className="flex flex-col gap-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.nombre}
              href={link.href}
              className={`
                flex items-center gap-3 p-3 rounded-lg text-lg font-medium 
                transition-all duration-200 transform
                ${isActive
                  ? 'bg-blue-600 text-white shadow-lg' // Estilo activo
                  : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:translate-x-2' // Estilo inactivo
                }
              `}
            >
              {link.icon}
              <span>{link.nombre}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}