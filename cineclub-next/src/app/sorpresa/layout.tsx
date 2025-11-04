import type { Metadata } from 'next';

// Metadatos para la pestaña del navegador
export const metadata: Metadata = {
  title: 'Una Sorpresa...',
};

// Este layout simple se asegura de que NO se muestre el Sidebar
// en la ruta /sorpresa.
export default function SorpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  );
}