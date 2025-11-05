import { NextResponse } from 'next/server';
import prisma from '@/../prisma/lib';
export const dynamic = 'force-dynamic';
// GET (Listar Empleados con sus relaciones)
export async function GET() {
  try {
    // Esto reemplaza tu JOIN en clsOpeEmpleado.cs
    const empleados = await prisma.tblEmpleado.findMany({
      include: {
        Genero: true,  // Incluye el objeto Genero relacionado
        TipoDoc: true, // Incluye el objeto TipoDoc relacionado
        Supervisor: {  // Incluimos solo nombre y código del supervisor
          select: { Codigo: true, Nombre: true }
        },
      },
      orderBy: { Codigo: 'asc' },
    });
    return NextResponse.json(empleados);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al obtener empleados' }, { status: 500 });
  }
}

// POST (Agregar Empleado)
export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    const nuevoEmpleado = await prisma.tblEmpleado.create({
      data: data,
    });
    return NextResponse.json(nuevoEmpleado, { status: 201 }); // 201 = Creado
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al agregar el empleado' }, { status: 500 });
  }
}

// -----------------------------------------------------------------
// ¡NUEVO! MÉTODO PUT (Modificar Empleado)
// -----------------------------------------------------------------
export async function PUT(request: Request) {
  try {
    const data = await request.json();
    
    // Extraemos el Código para usarlo en el 'where'
    // y el resto de datos para el 'data'
    const { Codigo, ...datosSinCodigo } = data;

    if (!Codigo) {
      return NextResponse.json({ error: 'Código es requerido' }, { status: 400 });
    }

    const empleadoActualizado = await prisma.tblEmpleado.update({
      where: { Codigo: Number(Codigo) }, // Busca por el Código
      data: datosSinCodigo,           // Actualiza el resto de los datos
    });
    
    return NextResponse.json(empleadoActualizado);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error al modificar el empleado' }, { status: 500 });
  }
}
// -----------------------------------------------------------------
// ¡NUEVO! MÉTODO DELETE (Eliminar Empleado)
// -----------------------------------------------------------------
export async function DELETE(request: Request) {
  try {
    // 1. Obtenemos la URL y sus parámetros de búsqueda
    const { searchParams } = new URL(request.url);
    const codigo = searchParams.get('id'); // Buscamos el parámetro 'id'

    if (!codigo) {
      return NextResponse.json({ error: 'Código (id) es requerido' }, { status: 400 });
    }

    // 2. Usamos Prisma para eliminar el registro
    await prisma.tblEmpleado.delete({
      where: { Codigo: Number(codigo) }, // Busca por el Código
    });
    
    // 3. Devolvemos una respuesta de éxito (204 = Sin Contenido, éxito)
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error(error);
    // Manejamos el error (ej. si el empleado no existe)
    return NextResponse.json({ error: 'Error al eliminar el empleado' }, { status: 500 });
  }
}