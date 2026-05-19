/*
  Warnings:

  - You are about to drop the `Categoria` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Categoria";

-- CreateTable
CREATE TABLE "Category" (
    "id_categoria" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" VARCHAR(1255),
    "faixa_etaria" VARCHAR(30) NOT NULL,
    "faixa_peso" VARCHAR(30) NOT NULL,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id_categoria")
);
