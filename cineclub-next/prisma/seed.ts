import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado (seeding)...');

  // 1. Crear catálogos simples
  await prisma.tblGenero.createMany({
    data: [
      { Nombre: 'Acción' }, { Nombre: 'Comedia' },
      { Nombre: 'Drama' }, { Nombre: 'Ciencia Ficción' },
      { Nombre: 'Terror' },
    ],
  });

  await prisma.tblPai.createMany({
    data: [
      { Nombre: 'Estados Unidos' }, { Nombre: 'Colombia' },
      { Nombre: 'Japón' }, { Nombre: 'Reino Unido' },
    ],
  });

  await prisma.tblTipoDoc.createMany({
    data: [
      { Nombre: 'Cédula de Ciudadanía' }, { Nombre: 'Pasaporte' },
      { Nombre: 'Cédula de Extranjería' },
    ],
  });

  console.log('Catálogos creados.');

  // 2. Crear Empleado (para usar en combos)
  const empleado1 = await prisma.tblEmpleado.create({
    data: {
      Nombre: 'Owen Pérez',
      Fecha_Nacimiento: new Date('1990-05-15'),
      NroDoc: '123456789',
      Salario: 50000,
      Activo: true,
      Id_Genero: 1,  // Asume ID 1 (Acción)
      Id_TipoDoc: 1, // Asume ID 1 (Cédula)
    },
  });

  // 3. Crear Director (para usar en combos)
  const director1 = await prisma.tblDirector.create({
    data: {
      Nombre: 'Christopher Nolan',
      Id_Pais: 4,     // Asume ID 4 (Reino Unido)
      Id_Empleado: empleado1.Codigo,
      Id_Genero: 1,
      Id_TipoDoc: 2,  // Asume ID 2 (Pasaporte)
    },
  });

  // 4. Crear Productora (para usar en combos)
  const productora1 = await prisma.tblProductora.create({
    data: {
      Nombre: 'Warner Bros.',
      Id_Empleado: empleado1.Codigo,
    },
  });

  console.log('Entidades principales creadas.');

  // 5. Crear Película de prueba
  await prisma.tblPelicula.create({
    data: {
      Nombre: 'Inception',
      Fecha_Estreno: new Date('2010-07-16'),
      Id_Productora: productora1.Codigo,
      Id_Pais: 1, // Asume ID 1 (EEUU)
      Id_Director: director1.Codigo,
      Id_Empleado: empleado1.Codigo,
    },
  });

  console.log('¡Sembrado completado con éxito!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });