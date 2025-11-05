import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';
export const dynamic = 'force-dynamic';
// Basado en productoraController.cs
export async function GET() {
  try {
    // clsOpeProductora.cs hacía un join con Empleado
    const productoras = await prisma.tblProductora.findMany({
      include: {
        Empleado: { select: { Nombre: true } } // Incluimos solo el nombre
      },
      orderBy: { Nombre: 'asc' },
    });
    return NextResponse.json(productoras);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productoras' }, { status: 500 });
  }
}
