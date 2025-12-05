/*
  Warnings:

  - You are about to drop the column `caminhoDaImagem` on the `Filme` table. All the data in the column will be lost.
  - Added the required column `imagem` to the `Filme` table without a default value. This is not possible if the table is not empty.

*/
-- CreateTable
CREATE TABLE "Reserva" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nomeCliente" TEXT NOT NULL,
    "assentos" TEXT NOT NULL,
    "sessaoId" INTEGER NOT NULL,
    CONSTRAINT "Reserva_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Filme" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL
);
-- Corrected INSERT statement to copy data from the old column
INSERT INTO "new_Filme" ("id", "titulo", "imagem") SELECT "id", "titulo", "caminhoDaImagem" FROM "Filme";
DROP TABLE "Filme";
ALTER TABLE "new_Filme" RENAME TO "Filme";
CREATE TABLE "new_Sessao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "local" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "horarios" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "filmeId" INTEGER NOT NULL,
    "assentosOcupados" TEXT NOT NULL DEFAULT '[]',
    CONSTRAINT "Sessao_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "Filme" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sessao" ("data", "filmeId", "horarios", "id", "local", "tipo") SELECT "data", "filmeId", "horarios", "id", "local", "tipo" FROM "Sessao";
DROP TABLE "Sessao";
ALTER TABLE "new_Sessao" RENAME TO "Sessao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
