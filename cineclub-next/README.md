# Cine Club Next.js

Aplicación web para gestionar géneros, empleados, directores, productoras y películas de un cine club. El proyecto utiliza Next.js 16 con Prisma como ORM y una base de datos SQLite preconfigurada y poblada mediante un script de _seed_.

## Requisitos previos

- Node.js 20+
- npm 10+

## Configuración inicial

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Crea el archivo de variables de entorno a partir del ejemplo:
   ```bash
   cp .env.example .env
   ```
3. Ejecuta las migraciones de la base de datos (SQLite) y aplica el script de datos de ejemplo:
   ```bash
   DATABASE_URL="file:./prisma/dev.db" npx prisma migrate deploy
   DATABASE_URL="file:./prisma/dev.db" npx prisma db seed
   ```
   > También puedes exportar `DATABASE_URL` en tu terminal para no repetirlo en cada comando.

## Ejecutar el servidor de desarrollo

1. Inicia el servidor de desarrollo de Next.js:
   ```bash
   npm run dev
   ```
2. Abre [http://localhost:3000](http://localhost:3000) en tu navegador para utilizar la aplicación.

La interfaz permite listar, crear, actualizar y eliminar películas consumiendo las API Routes que interactúan con la base de datos mediante Prisma.

## Scripts disponibles

- `npm run dev`: inicia el servidor de desarrollo.
- `npm run build`: genera la compilación para producción.
- `npm run start`: inicia la aplicación compilada.
- `npm run lint`: ejecuta las reglas de ESLint.

## Migraciones y base de datos

Los archivos de migraciones se encuentran en `prisma/migrations`. Puedes crear nuevas migraciones a medida que evoluciona el esquema ejecutando:
```bash
DATABASE_URL="file:./prisma/dev.db" npx prisma migrate dev --name <nombre_de_la_migracion>
```

El script de semillas (`prisma/seed.ts`) reinicia las tablas principales y agrega datos de referencia para que la aplicación tenga información disponible inmediatamente después de la instalación.

## Créditos

Proyecto construido con [Next.js](https://nextjs.org/) y [Prisma](https://www.prisma.io/).
