import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado (seeding)...');

  // 0. Limpiar datos existentes respetando las relaciones
  await prisma.tblPelicula.deleteMany();
  await prisma.tblProductora.deleteMany();
  await prisma.tblDirector.deleteMany();
  await prisma.tblEmpleado.deleteMany();
  await prisma.tblPai.deleteMany();
  await prisma.tblGenero.deleteMany();
  await prisma.tblTipoDoc.deleteMany();

  // 1. Crear catálogos simples y obtener los IDs generados
  const generos = await Promise.all(
    ['Acción', 'Comedia', 'Drama', 'Ciencia Ficción', 'Terror'].map((Nombre) =>
      prisma.tblGenero.create({ data: { Nombre } }),
    ),
  );

  const paises = await Promise.all(
    ['Estados Unidos', 'Colombia', 'Japón', 'Reino Unido', 'Francia'].map((Nombre) =>
      prisma.tblPai.create({ data: { Nombre } }),
    ),
  );

  const tiposDoc = await Promise.all(
    ['Cédula de Ciudadanía', 'Pasaporte', 'Cédula de Extranjería'].map((Nombre) =>
      prisma.tblTipoDoc.create({ data: { Nombre } }),
    ),
  );

  const generoPorNombre = Object.fromEntries(generos.map((genero) => [genero.Nombre!, genero.Codigo]));
  const paisPorNombre = Object.fromEntries(paises.map((pais) => [pais.Nombre!, pais.Codigo]));
  const tipoDocPorNombre = Object.fromEntries(tiposDoc.map((tipo) => [tipo.Nombre!, tipo.Codigo]));

  console.log('Catálogos creados.');

  // 2. Crear Empleados (para usar en combos)
  const empleados = await Promise.all([
    prisma.tblEmpleado.create({
      data: {
        Nombre: 'Owen Pérez',
        Fecha_Nacimiento: new Date('1990-05-15'),
        NroDoc: '123456789',
        Salario: 50000,
        Activo: true,
        Id_Genero: generoPorNombre['Acción'],
        Id_TipoDoc: tipoDocPorNombre['Cédula de Ciudadanía'],
      },
    }),
    prisma.tblEmpleado.create({
      data: {
        Nombre: 'María Gómez',
        Fecha_Nacimiento: new Date('1988-11-02'),
        NroDoc: '987654321',
        Salario: 42000,
        Activo: true,
        Id_Genero: generoPorNombre['Drama'],
        Id_TipoDoc: tipoDocPorNombre['Cédula de Ciudadanía'],
      },
    }),
    prisma.tblEmpleado.create({
      data: {
        Nombre: 'Kenji Watanabe',
        Fecha_Nacimiento: new Date('1980-03-22'),
        NroDoc: 'A1234567',
        Salario: 61000,
        Activo: true,
        Id_Genero: generoPorNombre['Ciencia Ficción'],
        Id_TipoDoc: tipoDocPorNombre['Pasaporte'],
      },
    }),
  ]);

  // 3. Crear Directores (para usar en combos)
  const directores = await Promise.all([
    prisma.tblDirector.create({
      data: {
        Nombre: 'Christopher Nolan',
        Id_Pais: paisPorNombre['Reino Unido'],
        Id_Empleado: empleados[0].Codigo,
        Id_Genero: generoPorNombre['Acción'],
        Id_TipoDoc: tipoDocPorNombre['Pasaporte'],
      },
    }),
    prisma.tblDirector.create({
      data: {
        Nombre: 'Sofia Coppola',
        Id_Pais: paisPorNombre['Estados Unidos'],
        Id_Empleado: empleados[1].Codigo,
        Id_Genero: generoPorNombre['Drama'],
        Id_TipoDoc: tipoDocPorNombre['Pasaporte'],
      },
    }),
    prisma.tblDirector.create({
      data: {
        Nombre: 'Hayao Miyazaki',
        Id_Pais: paisPorNombre['Japón'],
        Id_Empleado: empleados[2].Codigo,
        Id_Genero: generoPorNombre['Ciencia Ficción'],
        Id_TipoDoc: tipoDocPorNombre['Pasaporte'],
      },
    }),
  ]);

  // 4. Crear Productoras (para usar en combos)
  const productoras = await Promise.all([
    prisma.tblProductora.create({
      data: {
        Nombre: 'Warner Bros.',
        Id_Empleado: empleados[0].Codigo,
      },
    }),
    prisma.tblProductora.create({
      data: {
        Nombre: 'American Zoetrope',
        Id_Empleado: empleados[1].Codigo,
      },
    }),
    prisma.tblProductora.create({
      data: {
        Nombre: 'Studio Ghibli',
        Id_Empleado: empleados[2].Codigo,
      },
    }),
  ]);

  console.log('Entidades principales creadas.');

  // 5. Crear Películas de prueba
  await Promise.all([
    prisma.tblPelicula.create({
      data: {
        Nombre: 'Inception',
        Fecha_Estreno: new Date('2010-07-16'),
        Id_Productora: productoras[0].Codigo,
        Id_Pais: paisPorNombre['Estados Unidos'],
        Id_Director: directores[0].Codigo,
        Id_Empleado: empleados[0].Codigo,
      },
    }),
    prisma.tblPelicula.create({
      data: {
        Nombre: 'Lost in Translation',
        Fecha_Estreno: new Date('2003-09-18'),
        Id_Productora: productoras[1].Codigo,
        Id_Pais: paisPorNombre['Estados Unidos'],
        Id_Director: directores[1].Codigo,
        Id_Empleado: empleados[1].Codigo,
      },
    }),
    prisma.tblPelicula.create({
      data: {
        Nombre: 'Spirited Away',
        Fecha_Estreno: new Date('2001-07-20'),
        Id_Productora: productoras[2].Codigo,
        Id_Pais: paisPorNombre['Japón'],
        Id_Director: directores[2].Codigo,
        Id_Empleado: empleados[2].Codigo,
      },
    }),
  ]);

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