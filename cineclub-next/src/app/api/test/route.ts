import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Forzar que sea dinámico

export async function GET() {
  try {
    // Esto no usa Prisma ni la base de datos
    return NextResponse.json({ 
      message: '¡El API de prueba funciona!', 
      timestamp: new Date().toISOString() 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Error en la ruta de prueba' }, { status: 500 });
  }
}