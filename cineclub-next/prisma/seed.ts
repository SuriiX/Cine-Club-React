import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando el sembrado (seeding)...');

  // 0. Limpiar datos existentes en el orden correcto para evitar conflictos de FK
  await prisma.tblPelicula.deleteMany();
  await prisma.tblProductora.deleteMany();
  await prisma.tblDirector.deleteMany();
  await prisma.tblEmpleado.deleteMany();
  await prisma.tblGenero.deleteMany();
  await prisma.tblPai.deleteMany();
  await prisma.tblTipoDoc.deleteMany();
  console.log('Tablas limpiadas.');

  // 1. Crear catálogos simples
  const generos = await Promise.all([
    prisma.tblGenero.create({ data: { Nombre: 'Ciencia Ficción' } }),
    prisma.tblGenero.create({ data: { Nombre: 'Drama' } }),
    prisma.tblGenero.create({ data: { Nombre: 'Comedia' } }),
    prisma.tblGenero.create({ data: { Nombre: 'Acción' } }),
    prisma.tblGenero.create({ data: { Nombre: 'Animación' } }),
    prisma.tblGenero.create({ data: { Nombre: 'Suspenso' } }),
    prisma.tblGenero.create({ data: { Nombre: 'Fantasía' } }),
    prisma.tblGenero.create({ data: { Nombre: 'Romance' } }),
  ]);

  const paises = await Promise.all([
    prisma.tblPai.create({ data: { Nombre: 'Estados Unidos' } }),
    prisma.tblPai.create({ data: { Nombre: 'Japón' } }),
    prisma.tblPai.create({ data: { Nombre: 'Corea del Sur' } }),
    prisma.tblPai.create({ data: { Nombre: 'Reino Unido' } }),
    prisma.tblPai.create({ data: { Nombre: 'Francia' } }),
    prisma.tblPai.create({ data: { Nombre: 'Colombia' } }),
  ]);

  const tiposDoc = await Promise.all([
    prisma.tblTipoDoc.create({ data: { Nombre: 'Cédula de Ciudadanía' } }),
    prisma.tblTipoDoc.create({ data: { Nombre: 'Pasaporte' } }),
    prisma.tblTipoDoc.create({ data: { Nombre: 'Cédula de Extranjería' } }),
  ]);
  console.log('Catálogos creados.');

  // 2. Crear Empleados (Supervisores primero)
  const supervisor1 = await prisma.tblEmpleado.create({
    data: {
      Nombre: 'Ana María Rojas',
      Fecha_Nacimiento: new Date('1985-10-20'),
      NroDoc: '52888999',
      Salario: 75000,
      Activo: true,
      Id_TipoDoc: tiposDoc[0].Codigo, // Cédula
      Id_Genero: generos[1].Codigo, // Drama
    },
  });

  const supervisor2 = await prisma.tblEmpleado.create({
    data: {
      Nombre: 'Carlos Méndez',
      Fecha_Nacimiento: new Date('1990-01-15'),
      NroDoc: '1035888777',
      Salario: 72000,
      Activo: true,
      Id_TipoDoc: tiposDoc[0].Codigo, // Cédula
      Id_Genero: generos[0].Codigo, // Sci-Fi
    },
  });

  // Empleados regulares
  const empleado1 = await prisma.tblEmpleado.create({
    data: {
      Nombre: 'Owen Pérez',
      Fecha_Nacimiento: new Date('1995-05-15'),
      NroDoc: '123456789',
      Salario: 50000,
      Activo: true,
      Id_TipoDoc: tiposDoc[1].Codigo, // Pasaporte
      Id_Genero: generos[3].Codigo, // Acción
      Id_Supervisor: supervisor1.Codigo,
    },
  });

  const empleado2 = await prisma.tblEmpleado.create({
    data: {
      Nombre: 'Valentina Muñoz',
      Fecha_Nacimiento: new Date('1998-02-28'),
      NroDoc: '1017255666',
      Salario: 48000,
      Activo: true,
      Id_TipoDoc: tiposDoc[0].Codigo, // Cédula
      Id_Genero: generos[7].Codigo, // Romance
      Id_Supervisor: supervisor1.Codigo,
    },
  });

  const empleado3 = await prisma.tblEmpleado.create({
    data: {
      Nombre: 'David Kim',
      Fecha_Nacimiento: new Date('1992-07-12'),
      NroDoc: '777888999',
      Salario: 51000,
      Activo: false,
      Id_TipoDoc: tiposDoc[2].Codigo, // Extranjería
      Id_Genero: generos[2].Codigo, // Comedia
      Id_Supervisor: supervisor2.Codigo,
    },
  });
  console.log('Empleados creados.');

  // 3. Crear Directores
  const directores = await Promise.all([
    prisma.tblDirector.create({
      data: {
        Nombre: 'Christopher Nolan',
        Id_Pais: paises.find(p => p.Nombre === 'Reino Unido')?.Codigo,
        Id_Empleado: empleado1.Codigo,
        Id_Genero: generos.find(g => g.Nombre === 'Ciencia Ficción')?.Codigo,
        Id_TipoDoc: tiposDoc.find(t => t.Nombre === 'Pasaporte')?.Codigo,
      },
    }),
    prisma.tblDirector.create({
      data: {
        Nombre: 'Bong Joon-ho',
        Id_Pais: paises.find(p => p.Nombre === 'Corea del Sur')?.Codigo,
        Id_Empleado: empleado2.Codigo,
        Id_Genero: generos.find(g => g.Nombre === 'Suspenso')?.Codigo,
        Id_TipoDoc: tiposDoc.find(t => t.Nombre === 'Pasaporte')?.Codigo,
      },
    }),
    prisma.tblDirector.create({
      data: {
        Nombre: 'Hayao Miyazaki',
        Id_Pais: paises.find(p => p.Nombre === 'Japón')?.Codigo,
        Id_Empleado: empleado3.Codigo,
        Id_Genero: generos.find(g => g.Nombre === 'Animación')?.Codigo,
        Id_TipoDoc: tiposDoc.find(t => t.Nombre === 'Pasaporte')?.Codigo,
      },
    }),
    prisma.tblDirector.create({
      data: {
        Nombre: 'Greta Gerwig',
        Id_Pais: paises.find(p => p.Nombre === 'Estados Unidos')?.Codigo,
        Id_Empleado: empleado2.Codigo,
        Id_Genero: generos.find(g => g.Nombre === 'Comedia')?.Codigo,
        Id_TipoDoc: tiposDoc.find(t => t.Nombre === 'Pasaporte')?.Codigo,
      },
    }),
    prisma.tblDirector.create({
      data: {
        Nombre: 'Céline Sciamma',
        Id_Pais: paises.find(p => p.Nombre === 'Francia')?.Codigo,
        Id_Empleado: empleado1.Codigo,
        Id_Genero: generos.find(g => g.Nombre === 'Drama')?.Codigo,
        Id_TipoDoc: tiposDoc.find(t => t.Nombre === 'Pasaporte')?.Codigo,
      },
    }),
  ]);
  console.log('Directores creados.');

  // 4. Crear Productoras
  const productoras = await Promise.all([
    prisma.tblProductora.create({ data: { Nombre: 'Warner Bros.', Id_Empleado: empleado1.Codigo } }),
    prisma.tblProductora.create({ data: { Nombre: 'A24', Id_Empleado: empleado2.Codigo } }),
    prisma.tblProductora.create({ data: { Nombre: 'Studio Ghibli', Id_Empleado: empleado3.Codigo } }),
    prisma.tblProductora.create({ data: { Nombre: 'Neon', Id_Empleado: empleado1.Codigo } }),
    prisma.tblProductora.create({ data: { Nombre: 'Barunson E&A', Id_Empleado: empleado2.Codigo } }),
  ]);
  console.log('Productoras creadas.');

  // 5. Crear Películas
  await prisma.tblPelicula.createMany({
    data: [
      {
        Nombre: 'Inception',
        Fecha_Estreno: new Date('2010-07-16'),
        Id_Productora: productoras.find(p => p.Nombre === 'Warner Bros.')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Estados Unidos')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Christopher Nolan')?.Codigo,
        Id_Empleado: empleado1.Codigo,
      },
      {
        Nombre: 'The Dark Knight',
        Fecha_Estreno: new Date('2008-07-18'),
        Id_Productora: productoras.find(p => p.Nombre === 'Warner Bros.')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Estados Unidos')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Christopher Nolan')?.Codigo,
        Id_Empleado: empleado1.Codigo,
      },
      {
        Nombre: 'Parasite',
        Fecha_Estreno: new Date('2019-05-30'),
        Id_Productora: productoras.find(p => p.Nombre === 'Barunson E&A')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Corea del Sur')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Bong Joon-ho')?.Codigo,
        Id_Empleado: empleado2.Codigo,
      },
      {
        Nombre: 'Memories of Murder',
        Fecha_Estreno: new Date('2003-05-02'),
        Id_Productora: productoras.find(p => p.Nombre === 'Barunson E&A')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Corea del Sur')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Bong Joon-ho')?.Codigo,
        Id_Empleado: empleado2.Codigo,
      },
      {
        Nombre: 'El viaje de Chihiro',
        Fecha_Estreno: new Date('2001-07-20'),
        Id_Productora: productoras.find(p => p.Nombre === 'Studio Ghibli')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Japón')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Hayao Miyazaki')?.Codigo,
        Id_Empleado: empleado3.Codigo,
      },
      {
        Nombre: 'Mi vecino Totoro',
        Fecha_Estreno: new Date('1988-04-16'),
        Id_Productora: productoras.find(p => p.Nombre === 'Studio Ghibli')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Japón')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Hayao Miyazaki')?.Codigo,
        Id_Empleado: empleado3.Codigo,
      },
      {
        Nombre: 'Barbie',
        Fecha_Estreno: new Date('2023-07-21'),
        Id_Productora: productoras.find(p => p.Nombre === 'Warner Bros.')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Estados Unidos')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Greta Gerwig')?.Codigo,
        Id_Empleado: empleado2.Codigo,
      },
      {
        Nombre: 'Lady Bird',
        Fecha_Estreno: new Date('2017-09-01'),
        Id_Productora: productoras.find(p => p.Nombre === 'A24')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Estados Unidos')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Greta Gerwig')?.Codigo,
        Id_Empleado: empleado2.Codigo,
      },
      {
        Nombre: 'Portrait of a Lady on Fire',
        Fecha_Estreno: new Date('2019-09-18'),
        Id_Productora: productoras.find(p => p.Nombre === 'Neon')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Francia')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Céline Sciamma')?.Codigo,
        Id_Empleado: empleado1.Codigo,
      },
      {
        Nombre: 'Everything Everywhere All at Once',
        Fecha_Estreno: new Date('2022-03-25'),
        Id_Productora: productoras.find(p => p.Nombre === 'A24')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Estados Unidos')?.Codigo,
        Id_Director: null, // Ejemplo sin director
        Id_Empleado: supervisor2.Codigo,
      },
      {
        Nombre: 'Oppenheimer',
        Fecha_Estreno: new Date('2023-07-21'),
        Id_Productora: productoras.find(p => p.Nombre === 'Warner Bros.')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Estados Unidos')?.Codigo,
        Id_Director: directores.find(d => d.Nombre === 'Christopher Nolan')?.Codigo,
        Id_Empleado: supervisor1.Codigo,
      },
      {
        Nombre: 'El Abrazo de la Serpiente',
        Fecha_Estreno: new Date('2015-05-21'),
        Id_Productora: productoras.find(p => p.Nombre === 'Neon')?.Codigo,
        Id_Pais: paises.find(p => p.Nombre === 'Colombia')?.Codigo,
        Id_Director: null,
        Id_Empleado: empleado1.Codigo,
      },
    ],
  });

  console.log('Películas creadas.');
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