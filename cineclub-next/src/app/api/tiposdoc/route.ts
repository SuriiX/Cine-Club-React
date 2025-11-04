import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';

export async function GET() {
  try {
    const tiposDoc = await prisma.tblTipoDoc.findMany({
      orderBy: { Nombre: 'asc' },
    });
    return NextResponse.json(tiposDoc);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener tipos de documento' }, { status: 500 });
  }
}