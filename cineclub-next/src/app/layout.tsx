import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/Sidebar'; // Importamos el Sidebar

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'CineClub App',
  description: 'Proyecto CineClub migrado a Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        {/* Cambiamos el fondo a un tono piedra/natural */}
        <div className="flex h-screen bg-stone-50">
          
          <Sidebar /> 
          
          <main className="flex-1 p-8 overflow-auto">
            {children} 
          </main>

        </div>
      </body>
    </html>
  );
}