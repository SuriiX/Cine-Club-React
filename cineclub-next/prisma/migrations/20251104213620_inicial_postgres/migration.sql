-- CreateTable
CREATE TABLE "tblGenero" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,

    CONSTRAINT "tblGenero_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblPai" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,

    CONSTRAINT "tblPai_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblTipoDoc" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,

    CONSTRAINT "tblTipoDoc_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblTipoTelefono" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,

    CONSTRAINT "tblTipoTelefono_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblRol" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,

    CONSTRAINT "tblRol_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblEstado" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,

    CONSTRAINT "tblEstado_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblCiudad" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,

    CONSTRAINT "tblCiudad_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblEmpleado" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,
    "Fecha_Nacimiento" TIMESTAMP(3),
    "NroDoc" TEXT,
    "Salario" DECIMAL(65,30),
    "Activo" BOOLEAN,
    "Id_TipoDoc" INTEGER,
    "Id_Genero" INTEGER,
    "Id_Supervisor" INTEGER,

    CONSTRAINT "tblEmpleado_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblDirector" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,
    "Id_Pais" INTEGER,
    "Id_Empleado" INTEGER,
    "Id_Genero" INTEGER,
    "Id_TipoDoc" INTEGER,

    CONSTRAINT "tblDirector_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblProductora" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,
    "Id_Empleado" INTEGER,

    CONSTRAINT "tblProductora_pkey" PRIMARY KEY ("Codigo")
);

-- CreateTable
CREATE TABLE "tblPelicula" (
    "Codigo" SERIAL NOT NULL,
    "Nombre" TEXT,
    "Fecha_Estreno" TIMESTAMP(3),
    "Id_Productora" INTEGER,
    "Id_Pais" INTEGER,
    "Id_Director" INTEGER,
    "Id_Empleado" INTEGER,

    CONSTRAINT "tblPelicula_pkey" PRIMARY KEY ("Codigo")
);

-- AddForeignKey
ALTER TABLE "tblEmpleado" ADD CONSTRAINT "tblEmpleado_Id_TipoDoc_fkey" FOREIGN KEY ("Id_TipoDoc") REFERENCES "tblTipoDoc"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblEmpleado" ADD CONSTRAINT "tblEmpleado_Id_Genero_fkey" FOREIGN KEY ("Id_Genero") REFERENCES "tblGenero"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblEmpleado" ADD CONSTRAINT "tblEmpleado_Id_Supervisor_fkey" FOREIGN KEY ("Id_Supervisor") REFERENCES "tblEmpleado"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblDirector" ADD CONSTRAINT "tblDirector_Id_Pais_fkey" FOREIGN KEY ("Id_Pais") REFERENCES "tblPai"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblDirector" ADD CONSTRAINT "tblDirector_Id_Empleado_fkey" FOREIGN KEY ("Id_Empleado") REFERENCES "tblEmpleado"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblDirector" ADD CONSTRAINT "tblDirector_Id_Genero_fkey" FOREIGN KEY ("Id_Genero") REFERENCES "tblGenero"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblDirector" ADD CONSTRAINT "tblDirector_Id_TipoDoc_fkey" FOREIGN KEY ("Id_TipoDoc") REFERENCES "tblTipoDoc"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblProductora" ADD CONSTRAINT "tblProductora_Id_Empleado_fkey" FOREIGN KEY ("Id_Empleado") REFERENCES "tblEmpleado"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblPelicula" ADD CONSTRAINT "tblPelicula_Id_Productora_fkey" FOREIGN KEY ("Id_Productora") REFERENCES "tblProductora"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblPelicula" ADD CONSTRAINT "tblPelicula_Id_Pais_fkey" FOREIGN KEY ("Id_Pais") REFERENCES "tblPai"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblPelicula" ADD CONSTRAINT "tblPelicula_Id_Director_fkey" FOREIGN KEY ("Id_Director") REFERENCES "tblDirector"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tblPelicula" ADD CONSTRAINT "tblPelicula_Id_Empleado_fkey" FOREIGN KEY ("Id_Empleado") REFERENCES "tblEmpleado"("Codigo") ON DELETE SET NULL ON UPDATE CASCADE;
