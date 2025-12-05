/*
  Warnings:

  - Added the required column `data` to the `Sessao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horarios` to the `Sessao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `Sessao` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Sessao" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "local" TEXT NOT NULL,
    "data" DATETIME NOT NULL,
    "horarios" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "filmeId" INTEGER NOT NULL,
    CONSTRAINT "Sessao_filmeId_fkey" FOREIGN KEY ("filmeId") REFERENCES "Filme" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Sessao" ("filmeId", "id", "local") SELECT "filmeId", "id", "local" FROM "Sessao";
DROP TABLE "Sessao";
ALTER TABLE "new_Sessao" RENAME TO "Sessao";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
