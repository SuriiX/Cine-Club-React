import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib'; // Importamos nuestro cliente de Prisma

export async function GET() {
  try {
    const generos = await prisma.tblGenero.findMany({
      orderBy: {
        Nombre: 'asc', // Equivalente a .OrderBy(x => x.Nombre)
      },
    });

    // Devolvemos los datos en formato JSON
    return NextResponse.json(generos);

  } catch (error) {
    // Un simple manejo de errores
    return NextResponse.json(
      { error: 'Error al obtener los géneros' }, 
      { status: 500 }
    );
  }
}