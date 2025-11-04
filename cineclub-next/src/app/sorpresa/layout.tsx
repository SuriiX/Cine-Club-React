import type { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Una Sorpresa...',
};


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