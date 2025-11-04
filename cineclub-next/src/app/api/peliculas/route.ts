import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';

// GET (Listar Películas con Joins)
export async function GET() {
  try {
    // "Traducción" de listarPelicula()
    const peliculas = await prisma.tblPelicula.findMany({
      include: {
        Productora: true,
        Pais: true,
        Director: true,
        Empleado: true,
      },
      orderBy: { Codigo: 'asc' },
    });
    return NextResponse.json(peliculas);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener películas' }, { status: 500 });
  }
}

// POST (Agregar Película)
// "Traducción" de tu método Post() y Agregar()
export async function POST(request: Request) {
  try {
    const data = await request.json(); // Obtiene los datos (tu tblPelicula)
    
    // Nota: ¡Prisma maneja el ID autoincremental automáticamente!
    // No necesitamos buscar el idmax como en clsOpePelicula.cs
    const nuevaPelicula = await prisma.tblPelicula.create({
      data: data,
    });
    return NextResponse.json(nuevaPelicula, { status: 201 }); // 201 = Creado
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al agregar la película' }, { status: 500 });
  }
}


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