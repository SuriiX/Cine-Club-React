-- CreateTable
CREATE TABLE "tblGenero" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT
);

-- CreateTable
CREATE TABLE "tblPai" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT
);

-- CreateTable
CREATE TABLE "tblTipoDoc" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT
);

-- CreateTable
CREATE TABLE "tblTipoTelefono" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT
);

-- CreateTable
CREATE TABLE "tblRol" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT
);

-- CreateTable
CREATE TABLE "tblEstado" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT
);

-- CreateTable
CREATE TABLE "tblCiudad" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT
);

-- CreateTable
CREATE TABLE "tblEmpleado" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT,
    "Fecha_Nacimiento" DATETIME,
    "NroDoc" TEXT,
    "Salario" DECIMAL,
    "Activo" BOOLEAN,
    "Id_TipoDoc" INTEGER,
    "Id_Genero" INTEGER,
    "Id_Supervisor" INTEGER,
    CONSTRAINT "tblEmpleado_Id_TipoDoc_fkey" FOREIGN KEY ("Id_TipoDoc") REFERENCES "tblTipoDoc" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblEmpleado_Id_Genero_fkey" FOREIGN KEY ("Id_Genero") REFERENCES "tblGenero" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblEmpleado_Id_Supervisor_fkey" FOREIGN KEY ("Id_Supervisor") REFERENCES "tblEmpleado" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tblDirector" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT,
    "Id_Pais" INTEGER,
    "Id_Empleado" INTEGER,
    "Id_Genero" INTEGER,
    "Id_TipoDoc" INTEGER,
    CONSTRAINT "tblDirector_Id_Pais_fkey" FOREIGN KEY ("Id_Pais") REFERENCES "tblPai" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblDirector_Id_Empleado_fkey" FOREIGN KEY ("Id_Empleado") REFERENCES "tblEmpleado" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblDirector_Id_Genero_fkey" FOREIGN KEY ("Id_Genero") REFERENCES "tblGenero" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblDirector_Id_TipoDoc_fkey" FOREIGN KEY ("Id_TipoDoc") REFERENCES "tblTipoDoc" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tblProductora" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT,
    "Id_Empleado" INTEGER,
    CONSTRAINT "tblProductora_Id_Empleado_fkey" FOREIGN KEY ("Id_Empleado") REFERENCES "tblEmpleado" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tblPelicula" (
    "Codigo" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "Nombre" TEXT,
    "Fecha_Estreno" DATETIME,
    "Id_Productora" INTEGER,
    "Id_Pais" INTEGER,
    "Id_Director" INTEGER,
    "Id_Empleado" INTEGER,
    CONSTRAINT "tblPelicula_Id_Productora_fkey" FOREIGN KEY ("Id_Productora") REFERENCES "tblProductora" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblPelicula_Id_Pais_fkey" FOREIGN KEY ("Id_Pais") REFERENCES "tblPai" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblPelicula_Id_Director_fkey" FOREIGN KEY ("Id_Director") REFERENCES "tblDirector" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "tblPelicula_Id_Empleado_fkey" FOREIGN KEY ("Id_Empleado") REFERENCES "tblEmpleado" ("Codigo") ON DELETE SET NULL ON UPDATE CASCADE
);
