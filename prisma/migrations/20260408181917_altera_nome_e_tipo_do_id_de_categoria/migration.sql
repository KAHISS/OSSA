/*
  Warnings:

  - The primary key for the `category` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id_categoria` on the `category` table. All the data in the column will be lost.
  - Added the required column `id` to the `category` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "category" DROP CONSTRAINT "category_pkey",
DROP COLUMN "id_categoria",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");
