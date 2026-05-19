/*
  Warnings:

  - You are about to drop the column `sex` on the `user` table. All the data in the column will be lost.
  - Added the required column `genre` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "sex",
ADD COLUMN     "genre" TEXT NOT NULL;
