import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';

// GET (Listar Directores)
// Basado en listarDirector()
export async function GET() {
  try {
    const directores = await prisma.tblDirector.findMany({
      include: { // Reemplaza los 4 joins
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

// POST (Agregar Director)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nuevoDirector = await prisma.tblDirector.create({ data });
    return NextResponse.json(nuevoDirector, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al agregar el director' }, { status: 500 });
  }
}

// PUT (Modificar Director)
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    const { Codigo, ...datosSinCodigo } = data;
    if (!Codigo) {
      return NextResponse.json({ error: 'Código es requerido' }, { status: 400 });
    }
    const directorActualizado = await prisma.tblDirector.update({
      where: { Codigo: Number(Codigo) },
      data: datosSinCodigo,
    });
    return NextResponse.json(directorActualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al modificar el director' }, { status: 500 });
  }
}

// DELETE (Eliminar Director)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('id');
    if (!codigo) {
      return NextResponse.json({ error: 'Código (id) es requerido' }, { status: 400 });
    }
    await prisma.tblDirector.delete({
      where: { Codigo: Number(codigo) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al eliminar el director' }, { status: 500 });
  }
}