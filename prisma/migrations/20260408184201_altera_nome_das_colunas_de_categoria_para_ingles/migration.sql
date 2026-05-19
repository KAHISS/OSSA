/*
  Warnings:

  - You are about to drop the column `descricao` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `faixa_etaria` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `faixa_peso` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `nome` on the `category` table. All the data in the column will be lost.
  - Added the required column `age_group` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight_range` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "descricao",
DROP COLUMN "faixa_etaria",
DROP COLUMN "faixa_peso",
DROP COLUMN "nome",
ADD COLUMN     "age_group" VARCHAR(30) NOT NULL,
ADD COLUMN     "description" VARCHAR(1255),
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "weight_range" VARCHAR(30) NOT NULL;
