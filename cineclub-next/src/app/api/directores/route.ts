import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';

// Basado en directorController.cs
export async function GET() {
  try {
    // clsOpeDirector.cs hacía 4 joins
    const directores = await prisma.tblDirector.findMany({
      include: {
        Pais: { select: { Nombre: true } },
        Empleado: { select: { Nombre: true } },
        Genero: { select: { Nombre: true } },
        TipoDoc: { select: { Nombre: true } },
      },
      orderBy: { Nombre: 'asc' },
    });
    return NextResponse.json(directores);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener directores' }, { status: 500 });
  }
}
// (Aquí irían POST, PUT, DELETE si quisiéramos un CRUD completo de Directores)