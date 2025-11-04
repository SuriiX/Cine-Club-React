import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';

// GET (Ya existía)
export async function GET() {
  try {
    const generos = await prisma.tblGenero.findMany({
      orderBy: { Nombre: 'asc' },
    });
    return NextResponse.json(generos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener géneros' }, { status: 500 });
  }
}

// POST (¡Nuevo!)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    if (!data.Nombre) {
      return NextResponse.json({ error: 'Nombre es requerido' }, { status: 400 });
    }
    const nuevoGenero = await prisma.tblGenero.create({
      data: { Nombre: data.Nombre },
    });
    return NextResponse.json(nuevoGenero, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al crear el género' }, { status: 500 });
  }
}

// PUT (¡Nuevo!)
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    if (!data.Codigo || !data.Nombre) {
      return NextResponse.json({ error: 'Código y Nombre son requeridos' }, { status: 400 });
    }
    const generoActualizado = await prisma.tblGenero.update({
      where: { Codigo: Number(data.Codigo) },
      data: { Nombre: data.Nombre },
    });
    return NextResponse.json(generoActualizado);
  } catch (error) {
    return NextResponse.json({ error: 'Error al modificar el género' }, { status: 500 });
  }
}

// DELETE (¡Nuevo!)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('id');
    if (!codigo) {
      return NextResponse.json({ error: 'Código (id) es requerido' }, { status: 400 });
    }
    await prisma.tblGenero.delete({
      where: { Codigo: Number(codigo) },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: 'Error al eliminar el género' }, { status: 500 });
  }
}