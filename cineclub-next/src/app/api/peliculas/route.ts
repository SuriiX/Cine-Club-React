import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';
export const dynamic = 'force-dynamic';
// GET (Listar Películas)
// Basado en listarPelicula()
export async function GET() {
  try {
    const peliculas = await prisma.tblPelicula.findMany({
      include: { // Reemplaza todos los joins
        Productora: { select: { Nombre: true } },
        Pais: { select: { Nombre: true } },
        Director: { select: { Nombre: true } },
        Empleado: { select: { Nombre: true } },
      },
      orderBy: { Codigo: 'asc' },
    });
    return NextResponse.json(peliculas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener películas' }, { status: 500 });
  }
}

// POST (Agregar Película)
// Basado en Agregar()
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nuevaPelicula = await prisma.tblPelicula.create({ data });
    return NextResponse.json(nuevaPelicula, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al agregar la película' }, { status: 500 });
  }
}

// PUT (Modificar Película)
// Basado en Modificar()
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { Codigo, ...datosSinCodigo } = data;

    if (!Codigo) {
      return NextResponse.json({ error: 'Código es requerido' }, { status: 400 });
    }

    const peliculaActualizada = await prisma.tblPelicula.update({
      where: { Codigo: Number(Codigo) },
      data: datosSinCodigo,
    });
    return NextResponse.json(peliculaActualizada);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al modificar la película' }, { status: 500 });
  }
}

// DELETE (Eliminar Película)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('id');

    if (!codigo) {
      return NextResponse.json({ error: 'Código (id) es requerido' }, { status: 400 });
    }

    await prisma.tblPelicula.delete({
      where: { Codigo: Number(codigo) },
    });
    
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar la película' }, { status: 500 });
  }
}