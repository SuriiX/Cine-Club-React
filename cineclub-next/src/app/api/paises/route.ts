import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';

export async function GET() {
  try {
    const paises = await prisma.tblPai.findMany({
      orderBy: { Nombre: 'asc' },
    });
    return NextResponse.json(paises);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener países' }, { status: 500 });
  }
}