/*
  Warnings:

  - You are about to alter the column `weight` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(5,2)`.

*/
-- CreateEnum
CREATE TYPE "Belt" AS ENUM ('WHITE', 'GRAY', 'YELLOW', 'ORANGE', 'GREEN', 'BLUE', 'PURPLE', 'BROWN', 'BLACK', 'CORAL', 'RED');

-- AlterTable
ALTER TABLE "user" ALTER COLUMN "weight" SET DATA TYPE DECIMAL(5,2);

-- CreateTable
CREATE TABLE "Student" (
    "id" TEXT NOT NULL,
    "belt" "Belt" NOT NULL,
    "stripe" INTEGER NOT NULL,

    CONSTRAINT "Student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Instructor" (
    "id" TEXT NOT NULL,
    "belt" "Belt" NOT NULL,
    "stripe" INTEGER NOT NULL,
    "commisionPerStudent" DECIMAL(6,2) NOT NULL,

    CONSTRAINT "Instructor_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Student" ADD CONSTRAINT "Student_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Instructor" ADD CONSTRAINT "Instructor_id_fkey" FOREIGN KEY ("id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
