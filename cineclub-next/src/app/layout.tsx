import type { Metadata } from 'next';
import './globals.css';
import Sidebar from '@/components/Sidebar'; // Importamos el Sidebar

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
      <body className="antialiased text-rose-50">
        <div className="relative flex min-h-screen">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,72,108,0.18),transparent_60%)]"></div>

          <Sidebar />

          <main className="relative flex-1 overflow-auto px-6 py-10 sm:px-10 lg:px-14">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_40%_20%,rgba(255,120,160,0.12),transparent_55%)]"></div>
            <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-12">
              {children}
            </div>
          </main>

        </div>
      </body>
    </html>
  );
}
