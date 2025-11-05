import { defineConfig, env } from "prisma/config";
import { config } from 'dotenv';

config(); // <-- Esto es correcto, déjalo

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  engine: "classic",
  datasource: {
    url: env("DATABASE_URL"), // <-- Esto es correcto, déjalo
  },
  // La propiedad 'seed' que estaba aquí fue eliminada
});